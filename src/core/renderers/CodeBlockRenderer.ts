import type { IRenderer } from "./IRenderer";
import { CodeBlockObject, THEMES } from "../objects/CodeBlockObject";

export class CodeBlockRenderer implements IRenderer<CodeBlockObject> {
    render(ctx: CanvasRenderingContext2D, object: CodeBlockObject, time: number) {
        const theme = THEMES[object.theme] || THEMES["vscode-dark"];

        ctx.save();

        // Generic Animation Logic
        let animProgress = 0;
        if (object.enterAnimation.type !== "none") {
            const start = object.enterAnimation.delay || 0;
            const duration = object.enterAnimation.duration || 1000;
            animProgress = Math.max(0, Math.min(1, (time - start) / duration));
        }

        if (object.enterAnimation.type === "fadeIn") {
            ctx.globalAlpha = object.opacity * animProgress;
        } else if (object.enterAnimation.type === "slideUp") {
            const offset = 50 * (1 - this.easeOutCubic(animProgress));
            ctx.translate(0, offset);
            ctx.globalAlpha = object.opacity * animProgress;
        } else if (object.enterAnimation.type === "scaleIn") {
            const s = this.easeOutBack(animProgress);
            ctx.translate(object.x + object.width / 2, object.y + object.height / 2);
            ctx.scale(s, s);
            ctx.translate(-(object.x + object.width / 2), -(object.y + object.height / 2));
        }

        // Window Chrome
        ctx.fillStyle = theme.bg;
        ctx.beginPath();
        if ((ctx as any).roundRect) {
            (ctx as any).roundRect(object.x, object.y, object.width, object.height, 8);
        } else {
            ctx.rect(object.x, object.y, object.width, object.height);
        }
        ctx.fill();

        // Shadow
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        ctx.fill();
        ctx.shadowColor = "transparent";

        // Mac traffic lights
        theme.traffic.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(object.x + 15 + (i * 20), object.y + 15, 6, 0, Math.PI * 2);
            ctx.fill();
        });

        // Content Area
        ctx.font = `normal ${object.fontSize}px "fira-code", monospace`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        let visibleCode = object.code;
        if (object.enterAnimation.type === "typewriter") {
            const start = object.enterAnimation.delay || 0;
            const duration = object.enterAnimation.duration || 1000;

            if (time < start) {
                visibleCode = "";
            } else if (time >= start + duration) {
                visibleCode = object.code;
            } else {
                const progress = (time - start) / duration;
                const charCount = Math.floor(object.code.length * progress);
                visibleCode = object.code.substring(0, charCount);
            }
        }

        const lines = visibleCode.split("\n");
        let lineY = object.y + 40 + object.padding;
        const contentX = object.x + object.padding;

        lines.forEach((line, i) => {
            if (lineY > object.y + object.height - object.padding) return;

            let textX = contentX;
            const currentLineNumber = object.startLineNumber + i;

            if (object.highlightedLines.includes(currentLineNumber)) {
                ctx.fillStyle = object.highlightColor;
                ctx.fillRect(object.x, lineY - 2, object.width, (object.fontSize * 1.5));
            }

            if (object.showLineNumbers) {
                const lineNumberWidth = ctx.measureText((object.startLineNumber + lines.length).toString()).width + object.lineNumberMargin;
                ctx.fillStyle = theme.numbers;
                ctx.fillText(currentLineNumber.toString(), contentX, lineY);
                textX += lineNumberWidth;
            }

            if (object.syntaxHighlighting) {
                this.drawHighlightedLine(ctx, line, textX, lineY, theme);
            } else {
                ctx.fillStyle = theme.text;
                ctx.fillText(line, textX, lineY);
            }

            lineY += (object.fontSize * 1.5);
        });

        ctx.restore();
    }

    private easeOutCubic(x: number): number {
        return 1 - Math.pow(1 - x, 3);
    }

    private easeOutBack(x: number): number {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    private drawHighlightedLine(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, theme: any) {
        const regex = /(\/\/.*)|(".*?"|'.*?'|`.*?`)|(\b(const|let|var|function|return|import|export|from|class|if|else|new|this|extends|true|false|null|undefined)\b)|(\b\w+\s*(?=\()|console)|(\W+)|(\w+)/g;

        let match;
        let cursorX = x;

        while ((match = regex.exec(text)) !== null) {
            const token = match[0];
            let color = theme.text;

            if (match[1]) color = theme.comment;
            else if (match[2]) color = theme.string;
            else if (match[3]) color = theme.keyword;
            else if (match[5]) color = theme.function;

            ctx.fillStyle = color;
            ctx.fillText(token, cursorX, y);
            cursorX += ctx.measureText(token).width;
        }
    }
}
