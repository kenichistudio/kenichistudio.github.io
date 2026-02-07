import type { IRenderer } from "./IRenderer";
import { TextObject } from "../objects/TextObject";

export class TextRenderer implements IRenderer<TextObject> {
    render(ctx: CanvasRenderingContext2D, object: TextObject, time: number, totalDuration: number = 5000) {
        // --- Animation Logic ---
        let opacity = object.opacity;
        let y = object.y;
        let scale = 1;
        let textToDraw = object.text;

        // 1. Enter Animation
        if (object.enterAnimation.type !== "none") {
            const t = time - object.enterAnimation.delay;
            const progress = Math.max(0, Math.min(1, t / object.enterAnimation.duration));
            const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

            if (t < 0) {
                opacity = 0;
            } else {
                switch (object.enterAnimation.type) {
                    case "fadeIn": opacity *= progress; break;
                    case "slideUp":
                        opacity *= progress;
                        y = object.y + (50 * (1 - ease));
                        break;
                    case "scaleIn":
                        scale *= ease;
                        opacity *= progress;
                        break;
                    case "typewriter":
                        const charCount = Math.floor(object.text.length * progress);
                        textToDraw = object.text.slice(0, charCount);
                        break;
                }
            }
        }

        // 2. Exit Animation
        if (object.exitAnimation.type !== "none") {
            // Exit starts at (Total - Duration)
            const exitStart = totalDuration - object.exitAnimation.duration;
            const t = time - exitStart;

            if (t > 0) {
                const progress = Math.min(1, t / object.exitAnimation.duration);
                const ease = progress * progress; // easeInQuad for exit

                switch (object.exitAnimation.type) {
                    case "fadeOut":
                        opacity *= (1 - progress);
                        break;
                    case "slideDown":
                        opacity *= (1 - progress);
                        y = y + (50 * ease);
                        break;
                    case "scaleOut":
                        scale *= (1 - ease);
                        opacity *= (1 - progress);
                        break;
                }
            }
        }

        ctx.globalAlpha = opacity;
        ctx.font = `bold ${object.fontSize}px "${object.fontFamily}", sans-serif`;
        // canvas letterSpacing is supported in recent browsers
        if ('letterSpacing' in ctx) {
            (ctx as any).letterSpacing = `${object.letterSpacing}px`;
        }
        ctx.textAlign = object.align;
        ctx.textBaseline = "top";

        // Auto-measure text
        const metrics = ctx.measureText(textToDraw);
        object.width = metrics.width;
        object.height = object.fontSize; // Approx

        ctx.save();
        const cx = object.x + object.width / 2;
        const cy = object.y + object.height / 2;

        ctx.translate(cx, cy);
        ctx.rotate((object.rotation || 0) * Math.PI / 180);

        const animScale = scale;
        ctx.scale((object.scaleX || 1) * animScale, (object.scaleY || 1) * animScale);

        let drawX = -object.width / 2;
        if (object.align === "center") drawX = 0;
        if (object.align === "right") drawX = object.width / 2;

        const drawY = -object.height / 2;
        const yOffset = y - object.y; // Animation offset

        // 1. Draw Background (if active)
        if (object.backgroundColor) {
            ctx.fillStyle = object.backgroundColor;
            const pad = object.backgroundPadding;

            // Background rect calculations
            // Since we set origin to center: -w/2, -h/2 is the top left.
            const rectX = -object.width / 2 - pad;
            const rectY = -object.height / 2 - pad + yOffset;
            const rectW = object.width + (pad * 2);
            const rectH = object.height + (pad * 2);

            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(rectX, rectY, rectW, rectH, object.backgroundRadius);
            } else {
                ctx.rect(rectX, rectY, rectW, rectH);
            }
            ctx.fill();
        }

        // 2. Setup Shadow (if active)
        if (object.shadow) {
            ctx.shadowColor = object.shadow.color;
            ctx.shadowBlur = object.shadow.blur;
            ctx.shadowOffsetX = object.shadow.offsetX;
            ctx.shadowOffsetY = object.shadow.offsetY;
        }

        // 3. Draw Fill
        ctx.fillStyle = object.color;
        ctx.fillText(textToDraw, drawX, drawY + yOffset);

        // 4. Draw Stroke (if active)
        if (object.strokeColor && object.strokeWidth > 0) {
            ctx.lineWidth = object.strokeWidth;
            ctx.strokeStyle = object.strokeColor;
            ctx.strokeText(textToDraw, drawX, drawY + yOffset);
        }

        ctx.restore();
    }
}
