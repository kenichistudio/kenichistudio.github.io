import type { IRenderer } from "./IRenderer";
import { LogoCharacterObject } from "../objects/LogoCharacterObject";

export class LogoCharacterRenderer implements IRenderer<LogoCharacterObject> {
    render(ctx: CanvasRenderingContext2D, object: LogoCharacterObject, time: number) {
        // Init particles if needed
        (object as any)._initParticles(ctx);

        const cx = object.x + object.width / 2;
        const cy = object.y + object.height / 2 - 20;

        let mx = 0, my = 0;
        if (object._scene) {
            mx = object._scene.mouseX;
            my = object._scene.mouseY;
        }

        ctx.save();
        ctx.fillStyle = object.circleColor;
        ctx.beginPath();
        const r = 100;
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.clip();

        ctx.fillStyle = "#1e293b";
        ctx.beginPath();
        if ((ctx as any).ellipse) {
            (ctx as any).ellipse(cx, cy + 100, 70, 60, 0, 0, Math.PI * 2);
        } else {
            ctx.arc(cx, cy + 100, 65, 0, Math.PI * 2);
        }
        ctx.fill();

        ctx.fillStyle = "#fca5a5";
        ctx.fillRect(cx - 15, cy + 10, 30, 30);

        ctx.beginPath();
        ctx.arc(cx, cy - 10, 45, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#0f172a";
        ctx.beginPath();
        ctx.arc(cx, cy - 15, 48, Math.PI, 0);
        ctx.moveTo(cx - 48, cy - 15);
        ctx.lineTo(cx - 48, cy + 10);
        ctx.lineTo(cx - 35, cy - 5);
        ctx.lineTo(cx + 35, cy - 5);
        ctx.lineTo(cx + 48, cy + 10);
        ctx.lineTo(cx + 48, cy - 15);
        ctx.fill();

        const eyeY = cy - 10;
        const eyeOffset = 18;

        const drawEye = (ox: number) => {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.arc(cx + ox, eyeY, 12, 0, Math.PI * 2);
            ctx.fill();

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

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy + 15, 10, 0, Math.PI, false);
        ctx.stroke();

        ctx.restore();

        ctx.fillStyle = object.textColor;
        for (const p of (object._particles as any[])) {
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

            const odx = p.originX - p.x;
            const ody = p.originY - p.y;
            p.vx += odx * 0.05;
            p.vy += ody * 0.05;

            p.vx *= 0.8;
            p.vy *= 0.8;

            p.x += p.vx;
            p.y += p.vy;

            ctx.fillRect(p.x, p.y, 2, 2);
        }
    }
}
