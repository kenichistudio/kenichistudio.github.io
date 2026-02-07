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
    letterSpacing?: number;
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
    letterSpacing: number = 0;

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
        this.letterSpacing = options.letterSpacing || 0;

        this.width = 300;
        this.height = 100;
    }

    draw(ctx: CanvasRenderingContext2D, time: number, totalDuration: number = 5000) {
        // Deprecated: Rendering is now handled by TextRenderer via RenderSystem.
        console.warn("TextObject.draw() called directly. This method is deprecated. Use RenderSystem.");
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
            backgroundRadius: this.backgroundRadius,
            letterSpacing: this.letterSpacing
        });
        clone.x = this.x + 20;
        clone.y = this.y + 20;
        return clone;
    }
}
