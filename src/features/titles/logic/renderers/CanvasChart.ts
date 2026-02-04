import type { SceneObject } from '../SceneObject';

export interface CanvasChartProperties {
    title: string;
    chartType: 'bar' | 'line' | 'area' | 'pie';
    styleVariant: 'clean' | 'scribble' | 'vox';
    data: string; // JSON string of {label, value}[]
    barColor: string;
    textColor: string;
    showLabels: boolean;
    name?: string;
}

interface ChartDataPoint {
    label: string;
    value: number;
    color?: string; // New: Per-item color
}

export class CanvasChart implements SceneObject {
    id: string;
    type: 'chart' = 'chart';
    x: number;
    y: number;
    width: number;
    height: number;

    startTime: number;
    duration: number;

    // Props
    title: string;
    chartType: 'bar' | 'line' | 'area' | 'pie';
    styleVariant: 'clean' | 'scribble' | 'vox';
    dataJSON: string;
    parsedData: ChartDataPoint[];
    barColor: string;
    textColor: string;
    showLabels: boolean;

    // Scribble noise cache
    private noiseOffsets: number[] = [];

    constructor(id: string, props: Partial<CanvasChartProperties> & { x: number, y: number }) {
        this.id = id;
        this.x = props.x;
        this.y = props.y;
        this.width = 500;
        this.height = 350;

        this.title = props.title || 'Growth Chart';
        this.chartType = props.chartType || 'bar';
        this.styleVariant = props.styleVariant || 'clean';
        this.dataJSON = props.data || JSON.stringify([
            { label: 'Jan', value: 30, color: '#3b82f6' },
            { label: 'Feb', value: 45, color: '#ef4444' },
            { label: 'Mar', value: 25, color: '#22c55e' },
            { label: 'Apr', value: 60, color: '#eab308' },
            { label: 'May', value: 80, color: '#a855f7' }
        ]);
        this.parsedData = this.parseData(this.dataJSON);

        this.barColor = props.barColor || '#3b82f6';
        this.textColor = props.textColor || '#1e293b'; // slate-800 default (dark mode handles contrast)
        this.showLabels = props.showLabels !== undefined ? props.showLabels : true;

        this.startTime = 0;
        this.duration = 2000;
        this.name = props.name || this.title || id;

        // Init noise
        for (let i = 0; i < 100; i++) this.noiseOffsets.push(Math.random());
    }

    name: string;

    private parseData(json: string): ChartDataPoint[] {
        try {
            return JSON.parse(json);
        } catch (e) {
            return [{ label: 'Error', value: 0 }];
        }
    }

    clone(): CanvasChart {
        const newId = `chart-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const clone = new CanvasChart(newId, {
            x: this.x + 20,
            y: this.y + 20,
            title: this.title,
            chartType: this.chartType,
            styleVariant: this.styleVariant,
            data: this.dataJSON,
            barColor: this.barColor,
            textColor: this.textColor,
            showLabels: this.showLabels
        });
        clone.duration = this.duration;
        clone.startTime = this.startTime;
        clone.name = this.name + " (Copy)";
        return clone;
    }

    containsPoint(x: number, y: number): boolean {
        return x >= this.x && x <= this.x + this.width && y >= this.y && y <= this.y + this.height;
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        const t = time - this.startTime;
        if (t < 0) return;

        const progress = Math.min(1, t / this.duration);
        const ease = this.easeOutExpo(progress);

        ctx.save();
        ctx.translate(this.x, this.y);

        // --- Render Background/Grid (Optional based on style) ---
        if (this.styleVariant === 'vox') {
            // Vox style background
            ctx.fillStyle = '#1e1e1e';
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 20;
            ctx.fillRect(-20, -20, this.width + 40, this.height + 40);
            ctx.shadowBlur = 0;
            // Grid
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1;
            this.drawGrid(ctx);
        }

        // --- Title ---
        ctx.fillStyle = this.textColor;
        if (this.styleVariant === 'vox') ctx.fillStyle = '#ffffff';
        if (this.styleVariant === 'scribble') ctx.font = '24px "Architects Daughter", "Comic Sans MS", cursive';
        else ctx.font = 'bold 24px Inter, sans-serif';

        ctx.textAlign = 'center';
        ctx.fillText(this.title, this.width / 2, 0);

        // --- Chart Area ---
        const top = 40;
        const bottom = this.height - 30;
        const left = 40;
        const right = this.width - 20;
        const h = bottom - top;
        const w = right - left;

        // --- Axis Lines ---
        ctx.strokeStyle = this.styleVariant === 'vox' ? '#555' : this.textColor;
        ctx.lineWidth = this.styleVariant === 'scribble' ? 2 : 1;

        if (this.styleVariant === 'scribble') {
            this.scribbleLine(ctx, left, top, left, bottom);
            this.scribbleLine(ctx, left, bottom, right, bottom);
        } else {
            ctx.beginPath();
            ctx.moveTo(left, top);
            ctx.lineTo(left, bottom);
            ctx.lineTo(right, bottom);
            ctx.stroke();
        }

        // --- DATA ---
        const maxValue = Math.max(...this.parsedData.map(d => d.value), 1) * 1.1;

        if (this.chartType === 'bar') {
            this.drawBarChart(ctx, left, top, w, h, maxValue, ease);
        } else if (this.chartType === 'line') {
            this.drawLineChart(ctx, left, top, w, h, maxValue, ease);
        } else if (this.chartType === 'area') {
            this.drawAreaChart(ctx, left, top, w, h, maxValue, ease);
        } else if (this.chartType === 'pie') {
            this.drawPieChart(ctx, w, h, ease); // Different layout
        }

        ctx.restore();
    }

    // --- Chart Implementations ---

    private drawBarChart(ctx: CanvasRenderingContext2D, left: number, top: number, w: number, h: number, max: number, ease: number) {
        const count = this.parsedData.length;
        const space = w / count;
        const barW = space * 0.6;
        const margin = space * 0.2;

        this.parsedData.forEach((d, i) => {
            const val = d.value * ease;
            const barH = (val / max) * h;
            const x = left + (i * space) + margin;
            const y = (top + h) - barH;

            // Use per-item color or fallback
            ctx.fillStyle = d.color || this.barColor;

            if (this.styleVariant === 'scribble') {
                this.scribbleRect(ctx, x, y, barW, barH);
            } else if (this.styleVariant === 'vox') {
                // 3D effect
                ctx.fillStyle = this.adjustColor(d.color || this.barColor, -20);
                ctx.fillRect(x + 5, y + 5, barW, barH); // Shadow/Side
                ctx.fillStyle = d.color || this.barColor;
                ctx.fillRect(x, y, barW, barH);
            } else {
                ctx.fillRect(x, y, barW, barH);
            }

            if (this.showLabels) {
                ctx.fillStyle = this.textColor;
                if (this.styleVariant === 'vox') ctx.fillStyle = '#eee';
                ctx.font = '12px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(d.label, x + barW / 2, top + h + 20);
            }
        });
    }

    private drawLineChart(ctx: CanvasRenderingContext2D, left: number, top: number, w: number, h: number, max: number, ease: number) {
        const count = this.parsedData.length;
        const step = w / (count - 1 || 1);

        ctx.beginPath();
        ctx.strokeStyle = this.barColor;
        ctx.lineWidth = 3;

        this.parsedData.forEach((d, i) => {
            const val = d.value * ease;
            const y = (top + h) - ((val / max) * h);
            const x = left + (i * step);
            if (i === 0) ctx.moveTo(x, y);
            else {
                if (this.styleVariant === 'scribble') {
                    // Just simple line for now, scribble hard to path
                    ctx.lineTo(x + (Math.random() - 0.5) * 2, y + (Math.random() - 0.5) * 2);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            // Draw Point
            // ctx.fillStyle = this.barColor;
            // ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI*2); ctx.fill();
        });
        ctx.stroke();

        if (this.styleVariant === 'vox') {
            // Drop shadow for line
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            ctx.shadowBlur = 10;
            ctx.shadowOffsetY = 5;
            ctx.stroke();
            ctx.shadowColor = 'transparent';
        }

        // Labels
        if (this.showLabels) {
            this.parsedData.forEach((d, i) => {
                const x = left + (i * step);
                ctx.fillStyle = this.textColor;
                if (this.styleVariant === 'vox') ctx.fillStyle = '#eee';
                ctx.font = '12px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(d.label, x, top + h + 20);
            });
        }
    }

    private drawAreaChart(ctx: CanvasRenderingContext2D, left: number, top: number, w: number, h: number, max: number, ease: number) {
        // Same as line but closed
        const count = this.parsedData.length;
        const step = w / (count - 1 || 1);

        ctx.beginPath();
        ctx.fillStyle = this.barColor + '80'; // transparent
        if (this.styleVariant === 'vox') ctx.fillStyle = this.barColor + 'AA';

        ctx.moveTo(left, top + h); // Bottom Left

        this.parsedData.forEach((d, i) => {
            const val = d.value * ease;
            const y = (top + h) - ((val / max) * h);
            const x = left + (i * step);
            ctx.lineTo(x, y);
        });

        ctx.lineTo(left + w, top + h); // Bottom Right
        ctx.closePath();
        ctx.fill();

        // Stroke on top
        this.drawLineChart(ctx, left, top, w, h, max, ease);
    }

    private drawPieChart(ctx: CanvasRenderingContext2D, w: number, h: number, ease: number) {
        const total = this.parsedData.reduce((acc, cur) => acc + cur.value, 0);
        let startAngle = -Math.PI / 2;
        const cx = this.width / 2;
        const cy = (this.height / 2) + 20;
        const radius = Math.min(w, h) * 0.35 * ease;

        this.parsedData.forEach((d, i) => {
            const sliceAngle = (d.value / total) * (Math.PI * 2);

            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
            ctx.closePath();

            // Vary color slightly or use per-item color
            ctx.fillStyle = d.color || this.adjustColor(this.barColor, i * 20);

            if (this.styleVariant === 'scribble') {
                // Scribble fill? Complex to do fast. Just solid for now.
                ctx.fill();
                ctx.stroke();
            } else {
                ctx.fill();
                if (this.styleVariant === 'vox') {
                    ctx.lineWidth = 2;
                    ctx.strokeStyle = '#111';
                    ctx.stroke();
                } else {
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }

            // Label
            if (this.showLabels) {
                const midAngle = startAngle + sliceAngle / 2;
                const lx = cx + Math.cos(midAngle) * (radius + 20);
                const ly = cy + Math.sin(midAngle) * (radius + 20);
                ctx.fillStyle = this.textColor;
                if (this.styleVariant === 'vox') ctx.fillStyle = '#fff';
                ctx.textAlign = 'center';
                ctx.font = '12px sans-serif';
                ctx.fillText(d.label, lx, ly);
            }

            startAngle += sliceAngle;
        });
    }

    // --- Helpers ---

    private scribbleLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        // Second pass for scratchy look
        ctx.moveTo(x1 + Math.random() * 2, y1 + Math.random() * 2);
        ctx.lineTo(x2 + Math.random() * 2, y2 + Math.random() * 2);
        ctx.stroke();
    }

    private scribbleRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
        // Outline
        ctx.strokeStyle = this.barColor;
        ctx.lineWidth = 2;
        this.scribbleLine(ctx, x, y, x + w, y);
        this.scribbleLine(ctx, x + w, y, x + w, y + h);
        this.scribbleLine(ctx, x + w, y + h, x, y + h);
        this.scribbleLine(ctx, x, y + h, x, y);

        // Fill (hatch)
        ctx.beginPath();
        ctx.lineWidth = 1;
        for (let i = x; i < x + w; i += 5) {
            ctx.moveTo(i, y + h);
            ctx.lineTo(i + 2, y);
        }
        ctx.stroke();
    }

    private drawGrid(ctx: CanvasRenderingContext2D) {
        // ... simple grid
    }

    private adjustColor(color: string, amount: number): string {
        // Simple hex adjust
        return color; // Placeholder, better color manipulation lib would be good but keeping simple
    }

    private easeOutExpo(x: number): number {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    getProperties() {
        return {
            title: this.title,
            chartType: this.chartType,
            styleVariant: this.styleVariant,
            data: this.dataJSON,
            barColor: this.barColor,
            textColor: this.textColor,
            showLabels: this.showLabels,
            duration: this.duration,
            startTime: this.startTime,
            name: this.name
        };
    }

    updateProperties(props: any) {
        if (props.title !== undefined) this.title = props.title;
        if (props.chartType !== undefined) this.chartType = props.chartType;
        if (props.styleVariant !== undefined) this.styleVariant = props.styleVariant;
        if (props.data !== undefined) {
            this.dataJSON = props.data;
            this.parsedData = this.parseData(this.dataJSON);
        }
        if (props.barColor !== undefined) this.barColor = props.barColor;
        if (props.textColor !== undefined) this.textColor = props.textColor;
        if (props.showLabels !== undefined) this.showLabels = props.showLabels;

        if (props.duration !== undefined) this.duration = Number(props.duration);
        if (props.startTime !== undefined) this.startTime = Number(props.startTime);
        if (props.name !== undefined) this.name = props.name;
    }
}
