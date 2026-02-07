import type { IRenderer } from "./IRenderer";
import { ParticleTextObject } from "../objects/ParticleTextObject";

export class ParticleTextRenderer implements IRenderer<ParticleTextObject> {

    // Internal helper to generate particles
    private scanText(object: ParticleTextObject) {
        const configKey = `${object.text}-${object.fontFamily}-${object.fontSize}-${object.gap}`;
        if (configKey === object.lastConfig && object.particles.length > 0) return;

        object.lastConfig = configKey;
        object.particles = [];

        // Offscreen Render
        const cvs = document.createElement("canvas");
        cvs.width = object.width;
        cvs.height = object.height;
        const ctx = cvs.getContext("2d");
        if (!ctx) return;

        // Draw Text
        ctx.font = `900 ${object.fontSize}px "${object.fontFamily}", sans-serif`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(object.text, object.width / 2, object.height / 2);

        // Sample
        const imgData = ctx.getImageData(0, 0, object.width, object.height);
        const data = imgData.data;

        for (let y = 0; y < object.height; y += object.gap) {
            for (let x = 0; x < object.width; x += object.gap) {
                const alpha = data[(y * object.width + x) * 4 + 3];
                if (alpha > 128) {
                    // Create Particle
                    const targetX = object.x + x;
                    const targetY = object.y + y;

                    // Determine Start Pos based on anim type (default random)
                    const startX = targetX + (Math.random() - 0.5) * 500;
                    const startY = targetY + (Math.random() - 0.5) * 500;

                    object.particles.push({
                        x: object.animType === 'assemble' ? startX : targetX,
                        y: object.animType === 'assemble' ? startY : targetY,
                        tx: targetX,
                        ty: targetY,
                        vx: 0,
                        vy: 0,
                        originX: startX,
                        originY: startY,
                        angle: Math.random() * Math.PI * 2,
                        radius: Math.random() * 200
                    });
                }
            }
        }
    }

    render(ctx: CanvasRenderingContext2D, object: ParticleTextObject, time: number) {
        // Trigger scan text (setup)
        this.scanText(object);

        ctx.save();
        ctx.fillStyle = object.color;
        ctx.globalAlpha = object.opacity;

        // Interaction Access
        if (object.sceneRef) {
            object.mx = object.sceneRef.mouseX;
            object.my = object.sceneRef.mouseY;
        }

        const isAssemble = object.animType === "assemble";
        const isExplode = object.animType === "explode";
        const isVortex = object.animType === "vortex";

        for (const p of object.particles) {
            // 1. BEHAVIOR: EXPLODE (Mouse Repulsion)
            if (isExplode) {
                const dx = object.mx - p.x;
                const dy = object.my - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = 80;

                if (dist < minDist) {
                    const force = (minDist - dist) / minDist;
                    const angle = Math.atan2(dy, dx);
                    p.vx -= Math.cos(angle) * force * 5;
                    p.vy -= Math.sin(angle) * force * 5;
                }

                const homeDx = p.tx - p.x;
                const homeDy = p.ty - p.y;

                p.vx += homeDx * 0.08;
                p.vy += homeDy * 0.08;

                p.vx *= 0.85;
                p.vy *= 0.85;

                p.x += p.vx;
                p.y += p.vy;
            }

            // 2. BEHAVIOR: ASSEMBLE (Tween in)
            else if (isAssemble) {
                const dx = p.tx - p.x;
                const dy = p.ty - p.y;

                p.x += dx * 0.05;
                p.y += dy * 0.05;

                if (Math.abs(dx) > 1) p.x += (Math.random() - 0.5);
                if (Math.abs(dy) > 1) p.y += (Math.random() - 0.5);
            }

            // 3. BEHAVIOR: VORTEX
            else if (isVortex) {
                const timeScale = time * 0.002;
                p.x = p.tx + Math.sin(timeScale + p.tx) * 5;
                p.y = p.ty + Math.cos(timeScale + p.ty) * 5;
            }

            // 4. BEHAVIOR: FLOAT (Idle)
            else if (object.animType === "float") {
                p.y = p.ty + Math.sin(time * 0.003 + p.tx * 0.05) * 5;
                p.x = p.tx;
            }

            // DEFAULT: Just draw at target
            else {
                p.x = p.tx;
                p.y = p.ty;
            }

            // RENDER
            if (object.particleSize <= 1.5) {
                ctx.fillRect(p.x, p.y, object.particleSize, object.particleSize);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, object.particleSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }
}
