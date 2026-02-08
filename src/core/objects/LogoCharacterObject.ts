import { KinetixObject } from "../Object";
import { Scene } from "../Scene";

interface Particle {
    x: number;
    y: number;
    originX: number;
    originY: number;
    vx: number;
    vy: number;
    color: string;
}

export class LogoCharacterObject extends KinetixObject {
    text: string = "RAGHAV";
    circleColor: string = "#fca5a5"; // Peach/Orange
    textColor: string = "#1e293b";

    public _scene: Scene | null = null;
    public _particles: Particle[] = [];
    public _lastText: string = "";

    // Performance: Don't update particles every frame if idle? 
    // Ideally update always for smooth interaction

    constructor(id: string) {
        super(id, "Logo Character", "LogoCharacterObject");
        this.width = 300;
        this.height = 300;
        this.text = "RAGHAV";
    }

    onAdd(scene: any) {
        this._scene = scene;
    }

    private _initParticles(ctx: CanvasRenderingContext2D) {
        if (this.text === this._lastText && this._particles.length > 0) return;

        this._particles = [];
        this._lastText = this.text;

        // Offline render
        const offCanvas = document.createElement("canvas");
        offCanvas.width = this.width;
        offCanvas.height = 100; // Text area
        const offCtx = offCanvas.getContext("2d");
        if (!offCtx) return;

        offCtx.font = "900 60px Impact, sans-serif";
        offCtx.fillStyle = this.textColor;
        offCtx.textAlign = "center";
        offCtx.textBaseline = "middle";
        offCtx.fillText(this.text, this.width / 2, 50);

        const data = offCtx.getImageData(0, 0, this.width, 100).data;

        // Sampling gap (higher = fewer particles, faster)
        const gap = 3;

        for (let y = 0; y < 100; y += gap) {
            for (let x = 0; x < this.width; x += gap) {
                const alpha = data[(y * this.width + x) * 4 + 3];
                if (alpha > 128) {
                    this._particles.push({
                        x: x + this.x,     // Global pos
                        y: y + this.y + 220, // Position below character
                        originX: x + this.x,
                        originY: y + this.y + 220,
                        vx: 0,
                        vy: 0,
                        color: this.textColor
                    });
                }
            }
        }
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        // Init particles if needed (lazy)
        this._initParticles(ctx);

        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2 - 20; // Move char up

        // Mouse calc
        let mx = 0, my = 0;
        if (this._scene) {
            mx = this._scene.mouseX;
            my = this._scene.mouseY;
        }

        // 1. CIRCLE BG
        ctx.save();
        ctx.fillStyle = this.circleColor;
        ctx.beginPath();
        const r = 100;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Clip for character
        ctx.clip();

        // 2. CHARACTER (Simplified Raghav)
        // Body
        ctx.fillStyle = "#1e293b"; // Dark shirt
        ctx.beginPath();
        ctx.ellipse(cx, cy + 100, 70, 60, 0, 0, Math.PI * 2);
        ctx.fill();

        // Neck
        ctx.fillStyle = "#fca5a5";
        ctx.fillRect(cx - 15, cy + 10, 30, 30);

        // Head
        ctx.beginPath();
        ctx.arc(cx, cy - 10, 45, 0, Math.PI * 2);
        ctx.fill();

        // Hair (Messy)
        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(cx, cy - 15, 48, Math.PI, 0); // Top
        ctx.moveTo(cx - 48, cy - 15); // Sideburns
        ctx.lineTo(cx - 48, cy + 10);
        ctx.lineTo(cx - 35, cy - 5);
        ctx.lineTo(cx + 35, cy - 5);
        ctx.lineTo(cx + 48, cy + 10);
        ctx.lineTo(cx + 48, cy - 15);
        ctx.fill();

        // Eyes (Follow Mouse)
        const eyeY = cy - 10;
        const eyeOffset = 18;

        const drawEye = (ox: number) => {
            // White
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(cx + ox, eyeY, 12, 0, Math.PI * 2);
            ctx.fill();

            // Pupil
            const dx = mx - (cx + ox);
            const dy = my - eyeY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const maxDisp = 4;
            const px = (dx / dist) * maxDisp || 0;
            const py = (dy / dist) * maxDisp || 0;

            ctx.fillStyle = "#000000";
            ctx.beginPath();
            ctx.arc(cx + ox + px, eyeY + py, 4, 0, Math.PI * 2);
            ctx.fill();
        };

        drawEye(-eyeOffset);
        drawEye(eyeOffset);

        // Smile
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy + 15, 10, 0, Math.PI, false);
        ctx.stroke();

        ctx.restore(); // End Clip

        // Glasses (Outside clip?? No, should be inside, but maybe on top of rim?)
        // Let's draw rim around circle
        // ctx.strokeStyle = "#ffffff";
        // ctx.lineWidth = 5;
        // ctx.stroke();

        // 3. PARTICLES (TEXT)
        ctx.fillStyle = this.textColor;

        for (const p of this._particles) {
            // Physics
            const dx = mx - p.x;
            const dy = my - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const minDist = 50;

            if (dist < minDist) {
                const force = (minDist - dist) / minDist;
                const angle = Math.atan2(dy, dx);
                p.vx -= Math.cos(angle) * force * 2;
                p.vy -= Math.sin(angle) * force * 2;
            }

            // Return to origin (Spring)
            const odx = p.originX - p.x;
            const ody = p.originY - p.y;
            p.vx += odx * 0.05;
            p.vy += ody * 0.05;

            // Damping
            p.vx *= 0.8;
            p.vy *= 0.8;

            p.x += p.vx;
            p.y += p.vy;

            // Draw
            ctx.fillRect(p.x, p.y, 2, 2);
        }
    }

    clone(): LogoCharacterObject {
        const c = new LogoCharacterObject(`logo-${Date.now()}`);
        c.x = this.x + 20;
        c.y = this.y + 20;
        c.text = this.text;
        c.circleColor = this.circleColor;
        return c;
    }
}
