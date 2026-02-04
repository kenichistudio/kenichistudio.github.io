import type { SceneObject } from '../SceneObject';

export interface CanvasTextProperties {
    text: string;
    fontFamily: string;
    fontWeight: string;
    fontSize: number;
    color: string;
    letterSpacing: number;
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    animationType: 'none' | 'typewriter' | 'fade' | 'slide-up' | 'scale-up' | 'rotate-in';
    name?: string;
}

export class CanvasText implements SceneObject {
    id: string;
    type: 'text' = 'text';
    x: number;
    y: number;
    width: number;
    height: number;

    startTime: number;
    duration: number;

    // Props
    text: string;
    fontFamily: string;
    fontWeight: string;
    fontSize: number;
    color: string;
    letterSpacing: number;
    shadowColor: string;
    shadowBlur: number;
    shadowOffsetX: number;
    shadowOffsetY: number;
    animationType: 'none' | 'typewriter' | 'fade' | 'slide-up' | 'scale-up' | 'rotate-in';

    constructor(id: string, props: Partial<CanvasTextProperties> & { x: number, y: number }) {
        this.id = id;
        this.x = props.x;
        this.y = props.y;
        this.text = props.text || 'Hello World';
        this.fontFamily = props.fontFamily || 'Poppins'; // Default changed to Poppins
        this.fontWeight = props.fontWeight || '400';
        this.fontSize = props.fontSize || 80;
        this.color = props.color || '#ffffff';
        this.letterSpacing = props.letterSpacing || 0;
        this.shadowColor = props.shadowColor || 'transparent'; // Default no shadow
        this.shadowBlur = props.shadowBlur || 0;
        this.shadowOffsetX = props.shadowOffsetX || 0;
        this.shadowOffsetY = props.shadowOffsetY || 0;
        this.animationType = props.animationType || 'typewriter';

        this.startTime = 0;
        this.duration = 2000;

        // Approximate width/height
        this.width = this.text.length * (this.fontSize * 0.6);
        this.height = this.fontSize;

        this.name = props.name || this.text || id;
    }

    name: string;

    clone(): CanvasText {
        const newId = `text-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const newX = this.x + 20;
        const newY = this.y + 20;

        const clone = new CanvasText(newId, {
            x: newX,
            y: newY,
            text: this.text,
            fontFamily: this.fontFamily,
            fontWeight: this.fontWeight,
            fontSize: this.fontSize,
            color: this.color,
            letterSpacing: this.letterSpacing,
            shadowColor: this.shadowColor,
            shadowBlur: this.shadowBlur,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            animationType: this.animationType,
        });

        clone.duration = this.duration;
        clone.startTime = this.startTime;
        clone.name = this.name + " (Copy)";

        return clone;
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        ctx.save();

        ctx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}`;

        // Measure
        const metrics = ctx.measureText(this.text);
        this.width = metrics.width;
        this.height = this.fontSize;

        // Local time
        const t = time - this.startTime;

        if (t < 0) {
            ctx.restore();
            return;
        }

        const progress = Math.min(1, t / this.duration);

        // Apply Styles
        ctx.fillStyle = this.color;
        ctx.textBaseline = 'top';

        if (this.letterSpacing) {
            // Provide fallback if canvas letterSpacing not supported (it is in modern chrome)
            // TypeScript might complain, so we cast or use specific API
            if ('letterSpacing' in ctx) {
                (ctx as any).letterSpacing = `${this.letterSpacing}px`;
            }
        }

        if (this.shadowColor && this.shadowColor !== 'transparent') {
            ctx.shadowColor = this.shadowColor;
            ctx.shadowBlur = this.shadowBlur;
            ctx.shadowOffsetX = this.shadowOffsetX;
            ctx.shadowOffsetY = this.shadowOffsetY;
        }

        // Animation Logic
        if (this.animationType === 'typewriter') {
            const charCount = Math.floor(this.text.length * progress);
            const currentText = this.text.substring(0, charCount);
            ctx.fillText(currentText, this.x, this.y);

            // Cursor
            if (progress < 1) {
                // We need to measure partial text for cursor pos
                const partialMetrics = ctx.measureText(currentText);
                ctx.fillRect(this.x + partialMetrics.width + 2, this.y, 2, this.fontSize);
            }

        } else if (this.animationType === 'fade') {
            ctx.globalAlpha = easeOutCubic(progress);
            ctx.fillText(this.text, this.x, this.y);

        } else if (this.animationType === 'slide-up') {
            const offset = (1 - easeOutCubic(progress)) * 50;
            ctx.globalAlpha = easeOutCubic(progress);
            ctx.fillText(this.text, this.x, this.y + offset);

        } else if (this.animationType === 'scale-up') {
            const scale = easeOutBack(progress);
            const cx = this.x + this.width / 2;
            const cy = this.y + this.height / 2;

            ctx.translate(cx, cy);
            ctx.scale(scale, scale);
            ctx.translate(-cx, -cy);
            ctx.fillText(this.text, this.x, this.y);

        } else if (this.animationType === 'rotate-in') {
            const scale = easeOutCubic(progress);
            const angle = (1 - easeOutCubic(progress)) * (-0.5); // Radians

            const cx = this.x + this.width / 2;
            const cy = this.y + this.height / 2;

            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.scale(scale, scale);
            ctx.translate(-cx, -cy);

            ctx.globalAlpha = progress;
            ctx.fillText(this.text, this.x, this.y);

        } else {
            // None
            ctx.fillText(this.text, this.x, this.y);
        }

        ctx.restore();
    }

    containsPoint(px: number, py: number): boolean {
        return px >= this.x && px <= this.x + this.width &&
            py >= this.y && py <= this.y + this.height;
    }

    getProperties() {
        return {
            text: this.text,
            fontFamily: this.fontFamily,
            fontWeight: this.fontWeight,
            fontSize: this.fontSize,
            color: this.color,
            letterSpacing: this.letterSpacing,
            shadowColor: this.shadowColor,
            shadowBlur: this.shadowBlur,
            shadowOffsetX: this.shadowOffsetX,
            shadowOffsetY: this.shadowOffsetY,
            animationType: this.animationType,
            duration: this.duration,
            startTime: this.startTime,
            name: this.name
        };
    }

    updateProperties(props: any) {
        if (props.text !== undefined) this.text = props.text;
        if (props.fontFamily !== undefined) this.fontFamily = props.fontFamily;
        if (props.fontWeight !== undefined) this.fontWeight = props.fontWeight;
        if (props.fontSize !== undefined) this.fontSize = Number(props.fontSize);
        if (props.color !== undefined) this.color = props.color;
        if (props.letterSpacing !== undefined) this.letterSpacing = Number(props.letterSpacing);
        if (props.shadowColor !== undefined) this.shadowColor = props.shadowColor;
        if (props.shadowBlur !== undefined) this.shadowBlur = Number(props.shadowBlur);
        if (props.shadowOffsetX !== undefined) this.shadowOffsetX = Number(props.shadowOffsetX);
        if (props.shadowOffsetY !== undefined) this.shadowOffsetY = Number(props.shadowOffsetY);
        if (props.animationType !== undefined) this.animationType = props.animationType;
        if (props.duration !== undefined) this.duration = Number(props.duration);
        if (props.startTime !== undefined) this.startTime = Number(props.startTime);
        if (props.name !== undefined) this.name = props.name;
    }
}

// Easing Functions
function easeOutCubic(x: number): number {
    return 1 - Math.pow(1 - x, 3);
}

function easeOutBack(x: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
}
