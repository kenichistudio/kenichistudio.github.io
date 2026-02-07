import { KinetixObject } from "../Object";

export type CodeTheme = "vscode-dark" | "light" | "monokai" | "github-dark" | "dracula";

// Extended Theme Definition
export const THEMES: Record<CodeTheme, { bg: string, text: string, numbers: string, traffic: string[], keyword: string, string: string, comment: string, function: string }> = {
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
        // Deprecated: Rendering handled by CodeBlockRenderer via RenderSystem.
        console.warn("CodeBlockObject.draw() called directly. This method is deprecated. Use RenderSystem.");
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
