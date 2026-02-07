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
            this.lerpNode(node, object);

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
        if (object.chartType === "race" && object.currentLabel) {
            ctx.save();
            ctx.font = `bold ${Math.min(drawW, drawH) * 0.4}px ${object.fontFamily}`;
            ctx.fillStyle = object.gridColor || "#333";
            ctx.globalAlpha = 0.2; // Faint background
            ctx.textAlign = "right";
            ctx.textBaseline = "bottom";
            // Draw at bottom right, slightly padded
            ctx.fillText(object.currentLabel, startX + drawW - 20, startY + drawH - 20);
            ctx.restore();
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

        // Color Legend (for Split/Grouped data)
        if (["split", "scatter", "race", "parliament", "dotplot"].includes(object.chartType)) {
            this.drawLegend(ctx, object);
        }

        // 4. Annotations
        this.drawAnnotations(ctx, object);
    }

    private drawLegend(ctx: CanvasRenderingContext2D, object: SmartChartObject) {
        // Extract unique groups
        const groups = new Set<string>();
        const groupColors: Record<string, string> = {};

        object.data.forEach(d => {
            if (d.group) {
                groups.add(d.group);
                if (!groupColors[d.group]) groupColors[d.group] = d.color;
            }
        });

        if (groups.size === 0) return;

        const groupList = Array.from(groups);
        const { width, padding } = object;
        const startX = padding.left;
        const y = padding.top - 25; // Above chart

        ctx.font = `bold 12px ${object.fontFamily}`;
        ctx.textBaseline = "middle";

        let currentX = startX;

        groupList.forEach(group => {
            const color = groupColors[group];

            // Draw Dot
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(currentX, y, 5, 0, Math.PI * 2);
            ctx.fill();

            // Draw Label
            ctx.fillStyle = object.axisColor || "#888";
            ctx.textAlign = "left";
            ctx.fillText(group, currentX + 10, y);

            // Advance X
            const labelWidth = ctx.measureText(group).width;
            currentX += 10 + labelWidth + 20; // Dot + Label + Gap
        });
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
        else if (object.chartType === "scatter" || object.chartType === "split" || object.chartType === "parliament" || object.chartType === "dotplot") {
            // Center label
            ctx.fillStyle = "#fff";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            if (node.width > 20) {
                ctx.fillText(node.label.substring(0, 2), node.x + node.width / 2, node.y + node.height / 2);
            }
        }
    }

    private lerpNode(node: VisualNode, object: SmartChartObject) {
        // Map Duration to Lerp Factor (Approx)
        // 1000ms ~ 0.1 factor at 60fps? 
        // Formula: factor = 1 - pow(remaining, dt)? 
        // Simple mapping: 
        // 0ms -> 1.0 (Instant)
        // 3000ms -> 0.02 (Slow)
        let speed = 0.1;
        if (object.animationDuration !== undefined) {
            const d = Math.max(100, object.animationDuration);
            speed = 100 / d; // e.g. 100/1000 = 0.1. 100/3000 = 0.033
        }

        let factor = speed;

        // Easing Modifiers
        if (object.animationEasing === "elastic") {
            // Elasticity check: if close to target, snap? 
            // Real elastic needs velocity. 
            // Fake elastic: overshoot?
            // For now, just make it faster/springier
            factor = speed * 1.5;
        } else if (object.animationEasing === "linear") {
            // Linear is hard with lerp. Just standard.
        }

        // Apply
        const l = (a: number, b: number) => {
            const diff = b - a;
            if (Math.abs(diff) < 0.1) return b;
            return a + diff * factor;
        };

        node.x = l(node.x, node.target.x);
        node.y = l(node.y, node.target.y);
        node.width = l(node.width, node.target.width);
        node.height = l(node.height, node.target.height);
        node.rotation = l(node.rotation, node.target.rotation);
        node.opacity = l(node.opacity, node.target.opacity);
        node.color = lerpColor(node.color, node.target.color, factor);
    }

    private drawAnnotations(ctx: CanvasRenderingContext2D, object: SmartChartObject) {
        if (!object.annotations || object.annotations.length === 0) return;

        ctx.save();
        ctx.font = `bold 14px ${object.fontFamily}`;

        object.annotations.forEach(note => {
            let tx = note.x || 0;
            let ty = note.y || 0;

            // If attached to a node, calculate position
            if (note.targetNodeId) {
                const node = object.nodes.find(n => n.id === note.targetNodeId);
                if (node && node.opacity > 0.1) {
                    tx = node.x + node.width / 2;
                    ty = node.y + node.height / 2;
                } else {
                    // Node not found or invisible, skip? 
                    // Or keep sticky at last known?
                    // For now, skip
                    if (!note.x && !note.y) return;
                }
            }

            // Annotation Offset (Where the text bubble lives relative to target)
            // Ideally customizable. For now, fixed offset top-right or based on position.
            // Let's create a "Visual Offset" based on chart type or simple defaults.
            // Default: Up and Right
            const bubbleX = tx + 30;
            const bubbleY = ty - 40;

            // Draw Connector
            ctx.beginPath();
            ctx.strokeStyle = object.axisColor || "#666";
            ctx.lineWidth = 1;
            ctx.moveTo(tx, ty);
            ctx.lineTo(bubbleX, bubbleY);
            ctx.stroke();

            // Draw Connector Dot at target
            ctx.beginPath();
            ctx.fillStyle = object.axisColor || "#666";
            ctx.arc(tx, ty, 3, 0, Math.PI * 2);
            ctx.fill();

            // Measure Text
            const metrics = ctx.measureText(note.text);
            const p = 8; // padding
            const textW = metrics.width;
            const textH = 14;

            // Draw Bubble Background
            ctx.fillStyle = "#ffffff";
            ctx.shadowColor = "rgba(0,0,0,0.1)";
            ctx.shadowBlur = 4;
            ctx.shadowOffsetY = 2;

            // Bubble Rect (Centered on bubbleX, bubbleY approx)
            // Let's put bubble start at bubbleX?
            const bx = bubbleX;
            const by = bubbleY - textH - p;

            ctx.beginPath();
            if (typeof ctx.roundRect === 'function') {
                ctx.roundRect(bx, by, textW + p * 2, textH + p * 2, 4);
            } else {
                ctx.rect(bx, by, textW + p * 2, textH + p * 2);
            }
            ctx.fill();

            // Remove shadow for text
            ctx.shadowColor = "transparent";

            // Draw Text
            ctx.fillStyle = "#000"; // Always black text for now? Or contrast.
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(note.text, bx + p, by + p);
        });

        ctx.restore();
    }
}
