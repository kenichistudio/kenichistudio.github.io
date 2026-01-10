import { KinetixObject } from "../Object";

export interface TextShadowOptions {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
}

export interface TextOptions {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    align: "left" | "center" | "right";
    strokeColor?: string;
    strokeWidth?: number;
    shadow?: TextShadowOptions;
    backgroundColor?: string;
    backgroundPadding?: number;
    backgroundRadius?: number;
}

export class TextObject extends KinetixObject {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    align: "left" | "center" | "right";

    // New Styling Properties
    strokeColor?: string;
    strokeWidth: number = 0;
    shadow?: TextShadowOptions;
    backgroundColor?: string;
    backgroundPadding: number = 0;
    backgroundRadius: number = 0;

    constructor(id: string, options: Partial<TextOptions> = {}) {
        super(id, "Text");
        this.text = options.text || "Hello World";
        this.fontSize = options.fontSize || 40;
        this.fontFamily = options.fontFamily || "Inter";
        this.color = options.color || "#ffffff";
        this.align = options.align || "left";

        this.strokeColor = options.strokeColor;
        this.strokeWidth = options.strokeWidth || 0;
        this.shadow = options.shadow;
        this.backgroundColor = options.backgroundColor;
        this.backgroundPadding = options.backgroundPadding || 10;
        this.backgroundRadius = options.backgroundRadius || 4;

        this.width = 300;
        this.height = 100;
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        // --- Animation Logic ---
        let opacity = this.opacity;
        let y = this.y;
        let scale = 1;
        let textToDraw = this.text;

        if (this.animation.type !== "none") {
            const t = time - this.animation.delay;
            const progress = Math.max(0, Math.min(1, t / this.animation.duration));
            const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

            if (t < 0) {
                opacity = 0;
            } else {
                switch (this.animation.type) {
                    case "fadeIn": opacity = progress; break;
                    case "slideUp":
                        opacity = progress;
                        y = this.y + (50 * (1 - ease));
                        break;
                    case "scaleIn":
                        scale = ease;
                        opacity = progress;
                        break;
                    case "typewriter":
                        const charCount = Math.floor(this.text.length * progress);
                        textToDraw = this.text.slice(0, charCount);
                        break;
                }
            }
        }

        ctx.globalAlpha = opacity;
        ctx.font = `bold ${this.fontSize}px "${this.fontFamily}", sans-serif`;
        ctx.textAlign = this.align;
        ctx.textBaseline = "top";

        // Auto-measure text
        const metrics = ctx.measureText(textToDraw);
        this.width = metrics.width;
        this.height = this.fontSize; // Approx

        ctx.save();
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        ctx.translate(cx, cy);
        ctx.rotate((this.rotation || 0) * Math.PI / 180);

        const animScale = scale;
        ctx.scale((this.scaleX || 1) * animScale, (this.scaleY || 1) * animScale);

        let drawX = -this.width / 2;
        if (this.align === "center") drawX = 0;
        if (this.align === "right") drawX = this.width / 2;

        const drawY = -this.height / 2;
        const yOffset = y - this.y; // Animation offset

        // 1. Draw Background (if active)
        if (this.backgroundColor) {
            ctx.fillStyle = this.backgroundColor;
            const pad = this.backgroundPadding;

            // Background rect needs to covor the whole text box
            // Since we align text differently, we need to calculate the rect based on alignment
            let bgX = drawX;
            if (this.align === "left") bgX = drawX - pad;
            if (this.align === "center") bgX = drawX - (this.width / 2) - pad;
            if (this.align === "right") bgX = drawX - this.width - pad;

            // Actually simpler: we know the bounding box relative to origin is always w/2, h/2
            // Because we set origin to center.
            // So -w/2, -h/2 is the top left.
            const rectX = -this.width / 2 - pad;
            const rectY = -this.height / 2 - pad + yOffset;
            const rectW = this.width + (pad * 2);
            const rectH = this.height + (pad * 2);

            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(rectX, rectY, rectW, rectH, this.backgroundRadius);
            } else {
                ctx.rect(rectX, rectY, rectW, rectH);
            }
            ctx.fill();
        }

        // 2. Setup Shadow (if active)
        if (this.shadow) {
            ctx.shadowColor = this.shadow.color;
            ctx.shadowBlur = this.shadow.blur;
            ctx.shadowOffsetX = this.shadow.offsetX;
            ctx.shadowOffsetY = this.shadow.offsetY;
        }

        // 3. Draw Fill
        ctx.fillStyle = this.color;
        ctx.fillText(textToDraw, drawX, drawY + yOffset);

        // 4. Draw Stroke (if active)
        if (this.strokeColor && this.strokeWidth > 0) {
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeStyle = this.strokeColor;
            ctx.strokeText(textToDraw, drawX, drawY + yOffset);
        }

        ctx.restore();
    }

    clone(): TextObject {
        const clone = new TextObject(`text-${Date.now()}`, {
            text: this.text,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            color: this.color,
            align: this.align,
            strokeColor: this.strokeColor,
            strokeWidth: this.strokeWidth,
            shadow: this.shadow ? { ...this.shadow } : undefined,
            backgroundColor: this.backgroundColor,
            backgroundPadding: this.backgroundPadding,
            backgroundRadius: this.backgroundRadius
        });
        clone.x = this.x + 20;
        clone.y = this.y + 20;
        return clone;
    }
}
