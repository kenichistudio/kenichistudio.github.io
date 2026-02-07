import type { IRenderer } from "./IRenderer";
import { SmartChartObject, type VisualNode } from "../objects/SmartChartObject";
import { lerpColor } from "../../shared/utils/ColorUtils";

export class SmartChartRenderer implements IRenderer<SmartChartObject> {

    render(ctx: CanvasRenderingContext2D, object: SmartChartObject, time: number) {
        ctx.save();
        ctx.translate(object.x, object.y);

        const lerpFactor = 0.15;

        // 1. Update Object / Physics
        object.update(time);

        // 2. Draw Background Elements (Grid, Axes, Big Year)
        this.drawBackground(ctx, object);

        // 3. Draw Nodes
        object.nodes.forEach(node => {
            // Physics / Interpolation
            this.lerpNode(node, lerpFactor);

            if (node.opacity < 0.01 && node.target.opacity <= 0.01) return;

            ctx.save();
            ctx.globalAlpha = node.opacity * object.opacity;
            ctx.fillStyle = node.color;

            // Shape Rendering
            if (node.shape === "rect") {
                ctx.beginPath();
                if (typeof ctx.roundRect === 'function') {
                    ctx.roundRect(node.x, node.y, node.width, node.height, object.cornerRadius || 4);
                } else {
                    ctx.rect(node.x, node.y, node.width, node.height);
                }
                ctx.fill();
            }
            else if (node.shape === "circle") {
                ctx.beginPath();
                const radius = Math.min(node.width, node.height) / 2;
                const cx = node.x + node.width / 2;
                const cy = node.y + node.height / 2;
                ctx.arc(cx, cy, radius, 0, Math.PI * 2);
                ctx.fill();
            }

            // Label / Value Rendering
            this.drawNodeLabels(ctx, object, node);

            ctx.restore();
        });

        ctx.restore();
    }

    private drawBackground(ctx: CanvasRenderingContext2D, object: SmartChartObject) {
        const { width, height, padding } = object;
        const drawW = width - padding.left - padding.right;
        const drawH = height - padding.top - padding.bottom;
        const startX = padding.left;
        const startY = padding.top;

        // Big Background Year for Race Chart
        if (object.chartType === "race" && object.raceData.length > 0) {
            // Find current year estimate from data (heuristic or stored prop?)
            // Since we don't pass 'time' deep into renderer for logic, we infer from object state if possible
            // Actually, `SmartChartRenderer.render` receives `time`. 
            // But simpler: just grab the first node's data context if available? 
            // Or better: calculated in `object.update()`?
            // Let's rely on `object.raceData` being interpolated? No, `object` is state.
            // We'll calculate "Progress" or just use a placeholder if we can't easily find current year.
            // EDIT: SmartChartObject doesn't store "currentYear" publicly. 
            // Let's skip year for now to avoid specific "Race" coupling in this generic renderer,
            // OR add it if strictly needed. The user screenshot didn't imply it was missing, but it is "inspiration".
        }

        if (object.showGrid) {
            ctx.strokeStyle = object.gridColor || "#333";
            ctx.lineWidth = 0.5; // Thinner grid
            ctx.beginPath();

            // Horizontal Grid Lines (5 steps)
            const steps = 5;
            for (let i = 0; i <= steps; i++) {
                const y = startY + drawH - (drawH / steps) * i;
                ctx.moveTo(startX, y);
                ctx.lineTo(startX + drawW, y);
            }

            // Vertical Grid Lines (for Scatter/Race?)
            if (object.chartType === "race" || object.chartType === "scatter") {
                for (let i = 0; i <= steps; i++) {
                    const x = startX + (drawW / steps) * i;
                    ctx.moveTo(x, startY);
                    ctx.lineTo(x, startY + drawH);
                }
            }
            ctx.stroke();
        }

        if (object.showAxes) {
            ctx.strokeStyle = object.axisColor || "#666";
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            // Y-Axis
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX, startY + drawH);
            // X-Axis
            ctx.moveTo(startX, startY + drawH);
            ctx.lineTo(startX + drawW, startY + drawH);
            ctx.stroke();

            // Axis Value Labels (Y-Axis)
            if (object.chartType === "bar" || object.chartType === "scatter") {
                ctx.fillStyle = object.axisColor || "#888";
                ctx.font = `10px ${object.fontFamily}`;
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";

                const maxVal = Math.max(...object.data.map(d => d.value)) || 10;
                const steps = 5;
                for (let i = 0; i <= steps; i++) {
                    const val = Math.round((maxVal * i) / steps);
                    const y = startY + drawH - (drawH / steps) * i;
                    ctx.fillText(val.toString(), startX - 8, y);
                }
            }
        }
    }

    private drawNodeLabels(ctx: CanvasRenderingContext2D, object: SmartChartObject, node: VisualNode) {
        if (node.width < 5 && node.height < 5) return; // Skip tiny nodes

        ctx.font = `bold 12px ${object.fontFamily}`;
        ctx.textBaseline = "middle";

        if (object.chartType === "race") {
            // Race: Label Left (or inside), Value Right
            // Label inside if fits
            if (node.width > 100) {
                ctx.fillStyle = "#fff";
                ctx.textAlign = "right";
                ctx.fillText(node.label, node.x + node.width - 10, node.y + node.height / 2);
            } else {
                ctx.fillStyle = object.axisColor;
                ctx.textAlign = "left";
                ctx.fillText(node.label, node.x + node.width + 10, node.y + node.height / 2);
            }

            // Value outside
            if (object.showValues) {
                ctx.fillStyle = object.axisColor; // or white?
                ctx.textAlign = "left"; // After label?
                // Simple: just put value at far right? 
                // Let's put value next to bar end
                const valStr = Math.round(node.value).toLocaleString();
                const labelWidth = ctx.measureText(node.label).width;
                const offset = node.width > 100 ? 10 : labelWidth + 20;

                ctx.fillText(valStr, node.x + node.width + offset, node.y + node.height / 2);
            }
        }
        else if (object.chartType === "bar") {
            // Standard Bar: Label on Axis (X), Value Top (optional)
            if (object.labelPosition === "axis") {
                ctx.fillStyle = object.axisColor;
                ctx.textAlign = "center";
                ctx.textBaseline = "top";
                // Clip label if too long?
                ctx.fillText(node.label, node.x + node.width / 2, node.y + node.height + 8);
            }

            if (object.showValues) {
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                if (node.height > 20) {
                    // Inside top
                    ctx.fillText(Math.round(node.value).toString(), node.x + node.width / 2, node.y + node.height - 5); // Wait, node.y is top
                    ctx.fillText(Math.round(node.value).toString(), node.x + node.width / 2, node.y + 15); // Top of bar
                } else {
                    // Outside top
                    ctx.fillStyle = object.axisColor;
                    ctx.fillText(Math.round(node.value).toString(), node.x + node.width / 2, node.y - 5);
                }
            }
        }
        else if (object.chartType === "scatter" || object.chartType === "split") {
            // Center label
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if (node.width > 20) {
                ctx.fillText(node.label.substring(0, 2), node.x + node.width / 2, node.y + node.height / 2);
            }
        }
    }

    private lerpNode(node: VisualNode, factor: number) {
        // Simple lerp with threshold snap
        const l = (a: number, b: number) => Math.abs(b - a) < 0.01 ? b : a + (b - a) * factor;

        node.x = l(node.x, node.target.x);
        node.y = l(node.y, node.target.y);
        node.width = l(node.width, node.target.width);
        node.height = l(node.height, node.target.height);
        node.rotation = l(node.rotation, node.target.rotation);
        node.opacity = l(node.opacity, node.target.opacity);
        node.color = lerpColor(node.color, node.target.color, factor);
    }
}
