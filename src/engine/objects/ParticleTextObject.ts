import { KinetixObject } from "../Object";
import { Scene } from "../Scene";

export type ParticleAnimationType = "none" | "explode" | "assemble" | "vortex" | "float";

interface TextParticle {
    x: number;      // Current Position
    y: number;
    tx: number;     // Target Position (Home)
    ty: number;
    vx: number;     // Velocity
    vy: number;
    originX: number; // Starting pos for 'assemble'
    originY: number;

    // Vortex / Noise state
    angle?: number;
    radius?: number;
}

export class ParticleTextObject extends KinetixObject {
    text: string = "PARTICLES";
    fontFamily: string = "Inter";
    fontSize: number = 80;
    color: string = "#ffffff";

    particleSize: number = 2;
    gap: number = 3; // Step size for sampling

    animType: ParticleAnimationType = "explode";

    private _particles: TextParticle[] = [];
    private _lastConfig: string = ""; // To detect changes
    private _scene: Scene | null = null;

    // Interaction
    private _mx = 0;
    private _my = 0;

    constructor(id: string) {
        super(id, "Particle Text");
        this.width = 600;
        this.height = 150;
    }

    onAdd(scene: any) {
        this._scene = scene;
    }

    private _scanText() {
        const configKey = `${this.text}-${this.fontFamily}-${this.fontSize}-${this.gap}`;
        if (configKey === this._lastConfig && this._particles.length > 0) return;

        this._lastConfig = configKey;
        this._particles = [];

        // Offscreen Render
        const cvs = document.createElement("canvas");
        cvs.width = this.width;
        cvs.height = this.height;
        const ctx = cvs.getContext("2d");
        if (!ctx) return;

        // Draw Text
        ctx.font = `900 ${this.fontSize}px "${this.fontFamily}", sans-serif`;
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.text, this.width / 2, this.height / 2);

        // Sample
        const imgData = ctx.getImageData(0, 0, this.width, this.height);
        const data = imgData.data;

        for (let y = 0; y < this.height; y += this.gap) {
            for (let x = 0; x < this.width; x += this.gap) {
                const alpha = data[(y * this.width + x) * 4 + 3];
                if (alpha > 128) {
                    // Create Particle
                    const targetX = this.x + x;
                    const targetY = this.y + y;

                    // Determine Start Pos based on anim type (default random)
                    const startX = targetX + (Math.random() - 0.5) * 500;
                    const startY = targetY + (Math.random() - 0.5) * 500;

                    this._particles.push({
                        x: this.animType === 'assemble' ? startX : targetX,
                        y: this.animType === 'assemble' ? startY : targetY,
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

    draw(ctx: CanvasRenderingContext2D, time: number) {
        this._scanText();

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;

        // Interaction Access
        if (this._scene) {
            this._mx = this._scene.mouseX;
            this._my = this._scene.mouseY;
        }

        const isAssemble = this.animType === "assemble";
        const isExplode = this.animType === "explode";
        const isVortex = this.animType === "vortex";

        // Determine global progress if needed (0 to 1 based on animation.duration)
        // For now, using interaction physics mostly

        for (const p of this._particles) {

            // 1. BEHAVIOR: EXPLODE (Mouse Repulsion)
            if (isExplode) {
                const dx = this._mx - p.x;
                const dy = this._my - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                const minDist = 80;

                if (dist < minDist) {
                    const force = (minDist - dist) / minDist;
                    const angle = Math.atan2(dy, dx);
                    p.vx -= Math.cos(angle) * force * 5; // Push hard
                    p.vy -= Math.sin(angle) * force * 5;
                }

                // Return Home (Spring)
                const homeDx = p.tx - p.x;
                const homeDy = p.ty - p.y;

                p.vx += homeDx * 0.08;
                p.vy += homeDy * 0.08;

                // Friction
                p.vx *= 0.85;
                p.vy *= 0.85;

                p.x += p.vx;
                p.y += p.vy;
            }

            // 2. BEHAVIOR: ASSEMBLE (Tween in)
            else if (isAssemble) {
                // Determine 'progress' based on simple ease
                // Let's make them flow constantly for now, or settle?
                // Settle logic:
                const dx = p.tx - p.x;
                const dy = p.ty - p.y;

                // Move towards target
                p.x += dx * 0.05;
                p.y += dy * 0.05;

                // Add noise
                if (Math.abs(dx) > 1) p.x += (Math.random() - 0.5);
                if (Math.abs(dy) > 1) p.y += (Math.random() - 0.5);
            }

            // 3. BEHAVIOR: VORTEX
            else if (isVortex) {
                // Spiral around origin
                // This usually needs a 'center' point
                const cx = this.x + this.width / 2;
                const cy = this.y + this.height / 2;

                const timeScale = time * 0.002;
                // Complex math placeholder - just jitter for now
                p.x = p.tx + Math.sin(timeScale + p.tx) * 5;
                p.y = p.ty + Math.cos(timeScale + p.ty) * 5;
            }

            // 4. BEHAVIOR: FLOAT (Idle)
            else if (this.animType === "float") {
                p.y = p.ty + Math.sin(time * 0.003 + p.tx * 0.05) * 5;
                p.x = p.tx;
            }

            // DEFAULT: Just draw at target
            else {
                p.x = p.tx;
                p.y = p.ty;
            }

            // RENDER
            // Circle or Rect? Rect is faster
            if (this.particleSize <= 1.5) {
                ctx.fillRect(p.x, p.y, this.particleSize, this.particleSize);
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, this.particleSize / 2, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.restore();
    }

    clone(): ParticleTextObject {
        const c = new ParticleTextObject(`ptext-${Date.now()}`);
        c.x = this.x;
        c.y = this.y;
        c.text = this.text;
        c.fontSize = this.fontSize;
        c.fontFamily = this.fontFamily;
        c.animType = this.animType;
        c.particleSize = this.particleSize;
        c.color = this.color;
        return c;
    }
}
