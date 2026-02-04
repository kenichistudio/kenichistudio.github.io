import { KinetixObject } from "../Object";

export type CodeTheme = "vscode-dark" | "light" | "monokai" | "github-dark" | "dracula";

// Extended Theme Definition
const THEMES: Record<CodeTheme, { bg: string, text: string, numbers: string, traffic: string[], keyword: string, string: string, comment: string, function: string }> = {
    "vscode-dark": {
        bg: "#1e1e1e", text: "#d4d4d4", numbers: "#858585", traffic: ["#ff5f56", "#ffbd2e", "#27c93f"],
        keyword: "#569cd6", string: "#ce9178", comment: "#6a9955", function: "#dcdcaa"
    },
    "light": {
        bg: "#ffffff", text: "#24292e", numbers: "#6a737d", traffic: ["#ff5f56", "#ffbd2e", "#27c93f"],
        keyword: "#d73a49", string: "#032f62", comment: "#6a737d", function: "#6f42c1"
    },
    "monokai": {
        bg: "#272822", text: "#f8f8f2", numbers: "#75715e", traffic: ["#ff5f56", "#ffbd2e", "#27c93f"],
        keyword: "#f92672", string: "#e6db74", comment: "#75715e", function: "#a6e22e"
    },
    "github-dark": {
        bg: "#0d1117", text: "#c9d1d9", numbers: "#6e7681", traffic: ["#ff5f56", "#ffbd2e", "#27c93f"],
        keyword: "#ff7b72", string: "#a5d6ff", comment: "#8b949e", function: "#d2a8ff"
    },
    "dracula": {
        bg: "#282a36", text: "#f8f8f2", numbers: "#6272a4", traffic: ["#ff5f56", "#ffbd2e", "#27c93f"],
        keyword: "#ff79c6", string: "#f1fa8c", comment: "#6272a4", function: "#50fa7b"
    }
};

export class CodeBlockObject extends KinetixObject {
    code: string;
    language: string;
    fontSize: number;
    showLineNumbers: boolean = true;
    syntaxHighlighting: boolean = true; // Default ON
    theme: CodeTheme = "vscode-dark";
    padding: number = 20;
    startLineNumber: number = 1;
    lineNumberMargin: number = 15;
    highlightedLines: number[] = [];
    highlightColor: string = "rgba(255, 255, 255, 0.1)";

    constructor(id: string, code: string = "") {
        super(id, "CodeBlock");
        this.code = code || "console.log('Hello Kinetix');";
        this.language = "javascript";
        this.fontSize = 16;
        this.width = 400;
        this.height = 200;
        this.padding = 20;
        this.startLineNumber = 1;
        this.lineNumberMargin = 15;
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        const theme = THEMES[this.theme] || THEMES["vscode-dark"];

        ctx.save(); // Save state for transforms/opacity

        // Generic Animation Logic
        let animProgress = 0;
        if (this.enterAnimation.type !== "none") {
            const start = this.enterAnimation.delay || 0;
            const duration = this.enterAnimation.duration || 1000;
            animProgress = Math.max(0, Math.min(1, (time - start) / duration));
        }

        if (this.enterAnimation.type === "fadeIn") {
            ctx.globalAlpha = this.opacity * animProgress;
        } else if (this.enterAnimation.type === "slideUp") {
            const offset = 50 * (1 - this.easeOutCubic(animProgress));
            ctx.translate(0, offset);
            ctx.globalAlpha = this.opacity * animProgress; // usually slide up includes fade
        } else if (this.enterAnimation.type === "scaleIn") {
            const s = this.easeOutBack(animProgress);
            // Scale from center
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.scale(s, s);
            ctx.translate(-(this.x + this.width / 2), -(this.y + this.height / 2));
        }

        // Window Chrome
        ctx.fillStyle = theme.bg;
        ctx.beginPath();
        ctx.roundRect(this.x, this.y, this.width, this.height, 8);
        ctx.fill();

        // Shadow (subtle)
        ctx.shadowColor = "rgba(0,0,0,0.3)";
        ctx.shadowBlur = 20;
        ctx.shadowOffsetY = 10;
        ctx.fill();
        ctx.shadowColor = "transparent"; // Reset

        // Mac traffic lights
        theme.traffic.forEach((color, i) => {
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(this.x + 15 + (i * 20), this.y + 15, 6, 0, Math.PI * 2);
            ctx.fill();
        });

        // Content Area
        ctx.font = `normal ${this.fontSize}px "fira-code", monospace`;
        ctx.textAlign = "left";
        ctx.textBaseline = "top";

        // Determine visible code based on animation
        let visibleCode = this.code;
        if (this.enterAnimation.type === "typewriter") {
            // Calculate progress
            const start = this.enterAnimation.delay || 0;
            const duration = this.enterAnimation.duration || 1000;

            if (time < start) {
                visibleCode = "";
            } else if (time >= start + duration) {
                visibleCode = this.code;
            } else {
                const progress = (time - start) / duration;
                const charCount = Math.floor(this.code.length * progress);
                visibleCode = this.code.substring(0, charCount);
            }
        }

        const lines = visibleCode.split("\n");
        let lineY = this.y + 40 + this.padding; // Top padding adjustment (header is ~40px)
        const contentX = this.x + this.padding;

        lines.forEach((line, i) => {
            if (lineY > this.y + this.height - this.padding) return; // Clip with bottom padding

            let textX = contentX;

            const currentLineNumber = this.startLineNumber + i;

            // Draw Line Highlight Background
            if (this.highlightedLines.includes(currentLineNumber)) {
                ctx.fillStyle = this.highlightColor;
                ctx.fillRect(this.x, lineY - 2, this.width, (this.fontSize * 1.5));
            }

            if (this.showLineNumbers) {
                // Calculate width needed for line numbers based on total lines/digits
                const lineNumberWidth = ctx.measureText((this.startLineNumber + lines.length).toString()).width + this.lineNumberMargin;

                ctx.fillStyle = theme.numbers;
                ctx.fillText(currentLineNumber.toString(), contentX, lineY);

                textX += lineNumberWidth;
            }

            if (this.syntaxHighlighting) {
                this.drawHighlightedLine(ctx, line, textX, lineY, theme);
            } else {
                ctx.fillStyle = theme.text;
                ctx.fillText(line, textX, lineY);
            }

            lineY += (this.fontSize * 1.5);
        });

        ctx.restore(); // Restore state
    }

    // Easings
    easeOutCubic(x: number): number {
        return 1 - Math.pow(1 - x, 3);
    }

    easeOutBack(x: number): number {
        const c1 = 1.70158;
        const c3 = c1 + 1;
        return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
    }

    // Simple Syntax Highlighting (Regex based)
    drawHighlightedLine(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, theme: any) {
        // Simple Tokenizer
        // Matches: strings, comments, keywords, or normal text words
        // Note: strict validation is not goal, just visual approximation
        const regex = /(\/\/.*)|(".*?"|'.*?'|`.*?`)|(\b(const|let|var|function|return|import|export|from|class|if|else|new|this|extends|true|false|null|undefined)\b)|(\b\w+\s*(?=\()|console)|(\W+)|(\w+)/g;

        let match;
        let cursorX = x;

        while ((match = regex.exec(text)) !== null) {
            const token = match[0];
            let color = theme.text;

            if (match[1]) color = theme.comment;      // Comments
            else if (match[2]) color = theme.string;  // Strings
            else if (match[3]) color = theme.keyword; // Keywords
            else if (match[5]) color = theme.function; // Functions (looks ahead for paren or is console)

            ctx.fillStyle = color;
            ctx.fillText(token, cursorX, y);
            cursorX += ctx.measureText(token).width;
        }
    }

    clone(): CodeBlockObject {
        const clone = new CodeBlockObject(`code-${Date.now()}`, this.code);
        clone.x = this.x + 20;
        clone.y = this.y + 20;
        clone.theme = this.theme;
        clone.fontSize = this.fontSize;
        clone.syntaxHighlighting = this.syntaxHighlighting;
        clone.padding = this.padding;
        clone.startLineNumber = this.startLineNumber;
        clone.showLineNumbers = this.showLineNumbers;
        clone.lineNumberMargin = this.lineNumberMargin;
        clone.highlightedLines = [...this.highlightedLines];
        clone.highlightColor = this.highlightColor;
        return clone;
    }
}
