import type { SceneObject } from '../SceneObject';

export interface CanvasCodeProperties {
    code: string;
    language: 'javascript' | 'python' | 'html';
    fontSize: number;
    theme: 'dark' | 'light' | 'vscode' | 'classic' | 'matrix' | 'dracula';
    animationStyle: 'typewriter' | 'line-by-line' | 'fade';
    highlightedLines: number[];
    highlightedWords: string[];
    name?: string;
}

export class CanvasCode implements SceneObject {
    id: string;
    type: 'code' = 'code';
    x: number;
    y: number;
    width: number;
    height: number;

    startTime: number;
    duration: number;

    // Props
    code: string;
    language: string;
    fontSize: number;
    theme: 'dark' | 'light' | 'vscode' | 'classic' | 'matrix' | 'dracula';
    animationStyle: 'typewriter' | 'line-by-line' | 'fade';
    highlightedLines: number[];
    highlightedWords: string[];
    name: string;

    constructor(id: string, props: Partial<CanvasCodeProperties> & { x: number, y: number }) {
        this.id = id;
        this.x = props.x;
        this.y = props.y;
        this.width = 400;
        this.height = 200;

        this.code = props.code || `function hello() {\n  console.log("Hello Kinetix!");\n}`;
        this.language = props.language || 'javascript';
        this.fontSize = props.fontSize || 16;
        this.theme = props.theme || 'dark';
        this.animationStyle = props.animationStyle || 'typewriter';
        this.highlightedLines = props.highlightedLines || [];
        this.highlightedWords = props.highlightedWords || [];
        this.name = props.name || 'Code Block';

        this.startTime = 0;
        this.duration = 2000;
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        const t = time - this.startTime;
        if (t < 0) return;

        const progress = Math.min(1, t / this.duration);

        ctx.save();

        // 1. Theme Configuration
        const themes: any = {
            dark: { bg: '#1e1e1e', header: '#252526', text: '#d4d4d4', keyword: '#569cd6', string: '#ce9178', comment: '#6a9955', cursor: '#3b82f6' },
            light: { bg: '#f8fafc', header: '#e2e8f0', text: '#334155', keyword: '#0000ff', string: '#a31515', comment: '#008000', cursor: '#000000' },
            vscode: { bg: '#1e1e1e', header: '#252526', text: '#d4d4d4', keyword: '#c586c0', string: '#ce9178', comment: '#6a9955', cursor: '#d4d4d4' },
            classic: { bg: '#ffffff', header: '#cccccc', text: '#000000', keyword: '#0000ff', string: '#800000', comment: '#008000', cursor: '#000000' },
            matrix: { bg: '#000000', header: '#001100', text: '#00ff00', keyword: '#00cc00', string: '#00cc00', comment: '#006600', cursor: '#00ff00' },
            dracula: { bg: '#282a36', header: '#44475a', text: '#f8f8f2', keyword: '#ff79c6', string: '#f1fa8c', comment: '#6272a4', cursor: '#bfbfbf' },
        };
        const colors = themes[this.theme] || themes.dark;

        // 2. Window Chrome
        const padding = 20;
        const lineHeight = this.fontSize * 1.5;

        // Background
        ctx.fillStyle = colors.bg;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Header
        ctx.fillStyle = colors.header;
        ctx.fillRect(this.x, this.y, this.width, 30);

        // Buttons
        ctx.fillStyle = '#ff5f56';
        ctx.beginPath(); ctx.arc(this.x + 15, this.y + 15, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#ffbd2e';
        ctx.beginPath(); ctx.arc(this.x + 35, this.y + 15, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#27c93f';
        ctx.beginPath(); ctx.arc(this.x + 55, this.y + 15, 6, 0, Math.PI * 2); ctx.fill();

        // 3. Content Rendering
        ctx.font = `normal ${this.fontSize}px 'Fira Code', monospace`;
        ctx.textBaseline = 'top';

        const lines = this.code.split('\n');
        let currentY = this.y + 30 + padding;

        lines.forEach((line, index) => {
            if (currentY + lineHeight > this.y + this.height) return;

            // -- Line Highlighting --
            if (this.highlightedLines.includes(index + 1)) {
                ctx.fillStyle = this.theme === 'light' || this.theme === 'classic' ? 'rgba(255, 230, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)';
                ctx.fillRect(this.x, currentY, this.width, lineHeight);
            }

            // -- Animation Logic --
            let visibleLine = line;
            let alpha = 1;

            if (this.animationStyle === 'typewriter') {
                // Calculate global char index for typewriter effect
                const totalChars = this.code.length;
                const charsToShow = Math.floor(totalChars * progress);

                // Get start index of this line in the full string
                let startIndex = 0;
                for (let i = 0; i < index; i++) startIndex += lines[i].length + 1; // +1 for newline

                if (charsToShow < startIndex) {
                    visibleLine = '';
                } else if (charsToShow < startIndex + line.length) {
                    visibleLine = line.substring(0, charsToShow - startIndex);
                }
            } else if (this.animationStyle === 'line-by-line') {
                const totalLines = lines.length;
                const visibleLinesCount = Math.floor(totalLines * progress);
                if (index >= visibleLinesCount) visibleLine = '';
            } else if (this.animationStyle === 'fade') {
                alpha = progress;
            }

            if (visibleLine.length > 0) {
                ctx.globalAlpha = alpha;

                // -- Tokenizing & Word Highlighting (Simple) --
                // Split by word boundary but keep delimiters
                const tokens = visibleLine.split(/([a-zA-Z0-9_$]+)/g);
                let currentX = this.x + padding;

                tokens.forEach(token => {
                    // Check Highlighting
                    let isHighlightedWord = this.highlightedWords.includes(token);

                    if (isHighlightedWord) {
                        const width = ctx.measureText(token).width;
                        ctx.fillStyle = 'rgba(255, 255, 0, 0.3)';
                        ctx.fillRect(currentX, currentY, width, lineHeight);
                    }

                    // Color Logic
                    if (isHighlightedWord) ctx.fillStyle = colors.keyword; // Make pop
                    else if (['function', 'const', 'let', 'var', 'import', 'export', 'return', 'class'].includes(token)) ctx.fillStyle = colors.keyword;
                    else if (token.match(/".*"/)) ctx.fillStyle = colors.string; // Very naive string check (doesn't work well with split)
                    else if (token.startsWith('//')) ctx.fillStyle = colors.comment;
                    else ctx.fillStyle = colors.text;

                    ctx.fillText(token, currentX, currentY);
                    currentX += ctx.measureText(token).width;
                });
                ctx.globalAlpha = 1;
            }

            // Cursor for Typewriter
            if (this.animationStyle === 'typewriter' && progress < 1 && lines[index] === visibleLine && index === Math.floor(lines.length * progress * (lines.length / this.code.length))) {
                // Approximate cursor position logic
            }

            currentY += lineHeight;
        });

        // Simple Typewriter Cursor (Fallback position logic)
        if (progress < 1 && this.animationStyle === 'typewriter') {
            // Re-calculate basic cursor pos
            const totalChars = this.code.length * progress;
            const codeSub = this.code.substring(0, totalChars);
            const subLines = codeSub.split('\n');
            const lastLine = subLines[subLines.length - 1];

            ctx.fillStyle = colors.cursor;
            const cursorY = this.y + 30 + padding + ((subLines.length - 1) * lineHeight);
            const cursorX = this.x + padding + ctx.measureText(lastLine).width;

            if (cursorY + lineHeight < this.y + this.height) {
                ctx.fillRect(cursorX + 2, cursorY + 2, 2, this.fontSize);
            }
        }

        ctx.restore();
    }

    containsPoint(px: number, py: number): boolean {
        return px >= this.x && px <= this.x + this.width &&
            py >= this.y && py <= this.y + this.height;
    }

    getProperties() {
        return {
            code: this.code,
            language: this.language,
            fontSize: this.fontSize,
            theme: this.theme,
            animationStyle: this.animationStyle,
            highlightedLines: this.highlightedLines.join(', '),
            highlightedWords: this.highlightedWords.join(', '),
            duration: this.duration,
            startTime: this.startTime,
            name: this.name
        };
    }

    updateProperties(props: any) {
        if (props.code !== undefined) this.code = props.code;
        if (props.language !== undefined) this.language = props.language;
        if (props.fontSize !== undefined) this.fontSize = Number(props.fontSize);
        if (props.theme !== undefined) this.theme = props.theme;
        if (props.animationStyle !== undefined) this.animationStyle = props.animationStyle;

        if (props.highlightedLines !== undefined) {
            // Parse "1, 3-5" => [1, 3, 4, 5]
            const parts = String(props.highlightedLines).split(',');
            const lines: number[] = [];
            parts.forEach(p => {
                const range = p.trim().split('-');
                if (range.length === 2) {
                    const start = parseInt(range[0]);
                    const end = parseInt(range[1]);
                    for (let i = start; i <= end; i++) lines.push(i);
                } else {
                    const num = parseInt(p);
                    if (!isNaN(num)) lines.push(num);
                }
            });
            this.highlightedLines = lines;
        }

        if (props.highlightedWords !== undefined) {
            this.highlightedWords = String(props.highlightedWords).split(',').map(s => s.trim()).filter(s => s);
        }

        if (props.duration !== undefined) this.duration = Number(props.duration);
        if (props.startTime !== undefined) this.startTime = Number(props.startTime);
        if (props.name !== undefined) this.name = props.name;
    }

    clone(): CanvasCode {
        const newId = `code-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const clone = new CanvasCode(newId, {
            x: this.x + 20,
            y: this.y + 20,
            code: this.code,
            language: this.language as any,
            fontSize: this.fontSize,
            theme: this.theme,
            name: this.name + " (Copy)"
        });
        clone.animationStyle = this.animationStyle;
        clone.highlightedLines = [...this.highlightedLines];
        clone.highlightedWords = [...this.highlightedWords];
        clone.duration = this.duration;
        clone.startTime = this.startTime;
        clone.width = this.width;
        clone.height = this.height;
        return clone;
    }
}
