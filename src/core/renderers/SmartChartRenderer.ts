import type { IRenderer } from "./IRenderer";
import { SmartChartObject, type VisualNode } from "../objects/SmartChartObject";
import { lerpColor } from "../../shared/utils/ColorUtils";

export class SmartChartRenderer implements IRenderer<SmartChartObject> {

    render(ctx: CanvasRenderingContext2D, object: SmartChartObject, time: number) {
        // 1. Calculate Delta Time (dt)
        // Since we don't get dt directly, we estimate it or use a fixed factor for simple easing.
        // A standard approach in this engine seems to be relying on 'time' for deterministic animations.
        // However, for state-driven morphing, 'lerp' is easier.
        // We'll use a fixed lerp factor for "catch up" logic (e.g. 0.1 per frame).

        const lerpFactor = 0.15; // Speed of morphing

        // 1.5 Update Object Logic (Race Data Interpolation)
        object.update(time);

        // 2. Interpolate & Draw Nodes
        object.nodes.forEach(node => {
            // Update Current State -> Target State
            this.lerpNode(node, lerpFactor);

            // Skip invisible nodes (optimization)
            if (node.opacity < 0.01 && node.target.opacity <= 0.01) return;

            // Draw
            ctx.save();
            ctx.globalAlpha = node.opacity * object.opacity;
            ctx.fillStyle = node.color; // Supports gradient later?

            if (node.shape === "rect") {
                // If morphing from circle to rect, we might want borderRadius
                // For now, strict rect
                ctx.beginPath();
                if ((ctx as any).roundRect) {
                    (ctx as any).roundRect(node.x, node.y, node.width, node.height, 4);
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

            // Draw Label (Simple)
            if (node.width > 20) { // Only if big enough
                ctx.fillStyle = "#fff";
                ctx.font = `12px ${object.fontFamily}`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const cx = node.x + node.width / 2;
                const cy = node.y + node.height / 2;

                // Clip text to node
                ctx.clip();
                ctx.fillText(node.label, cx, cy);
            }

            ctx.restore();
        });
    }

    private lerpNode(node: VisualNode, factor: number) {
        node.x = this.lerp(node.x, node.target.x, factor);
        node.y = this.lerp(node.y, node.target.y, factor);
        node.width = this.lerp(node.width, node.target.width, factor);
        node.height = this.lerp(node.height, node.target.height, factor);
        node.rotation = this.lerp(node.rotation, node.target.rotation, factor);
        node.opacity = this.lerp(node.opacity, node.target.opacity, factor);

        node.opacity = this.lerp(node.opacity, node.target.opacity, factor);
        node.color = lerpColor(node.color, node.target.color, factor);
    }

    private lerp(start: number, end: number, factor: number): number {
        if (Math.abs(end - start) < 0.01) return end;
        return start + (end - start) * factor;
    }
}
