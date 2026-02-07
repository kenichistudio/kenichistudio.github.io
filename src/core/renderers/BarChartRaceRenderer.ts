import type { IRenderer } from "./IRenderer";
import { BarChartRaceObject } from "../objects/BarChartRaceObject";

export class BarChartRaceRenderer implements IRenderer<BarChartRaceObject> {
    render(ctx: CanvasRenderingContext2D, object: BarChartRaceObject, time: number) {
        // 1. Time Interpolation
        const totalDuration = object.duration || 10000;
        const progress = Math.min(Math.max(time / totalDuration, 0), 1);

        const startYear = (object as any).data[0].year;
        const endYear = (object as any).data[(object as any).data.length - 1].year;
        const currentYear = startYear + (endYear - startYear) * progress;

        // Check for seek/jump to reset animation state
        const isSeek = Math.abs(time - object.lastDrawTime) > 500;
        const isStaticUpdate = time === object.lastDrawTime;
        object.lastDrawTime = time;

        // 2. Interpolate Values (same)
        let prevIndex = 0;
        const data = (object as any).data;
        for (let i = 0; i < data.length - 1; i++) {
            if (data[i + 1].year > currentYear) {
                prevIndex = i;
                break;
            }
            if (i === data.length - 2) prevIndex = data.length - 2;
        }

        const prev = data[prevIndex];
        const next = data[prevIndex + 1];
        const t = (currentYear - prev.year) / (next.year - prev.year);

        const currentValues: { label: string, value: number, color: string }[] = [];
        const allKeys = new Set([...Object.keys(prev.values), ...Object.keys(next.values)]);

        allKeys.forEach(key => {
            const v1 = prev.values[key] || 0;
            const v2 = next.values[key] || 0;
            const val = v1 + (v2 - v1) * t;
            if (val > 0) {
                currentValues.push({
                    label: key,
                    value: val,
                    color: (object as any).colors[key] || "#999"
                });
            }
        });

        // 3. Rank
        currentValues.sort((a, b) => b.value - a.value);

        // Normalize for Width
        const maxValue = currentValues[0]?.value || 100;

        // 4. Draw
        ctx.save();
        ctx.translate(object.x, object.y);

        // Title / Year
        ctx.fillStyle = object.labelColor;
        const yearFontSize = object.fontSize * 4.5;
        ctx.font = `bold ${yearFontSize}px ${object.fontFamily}`;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.globalAlpha = 0.2;
        ctx.fillText(Math.floor(currentYear).toString(), object.width - 20, object.height - 20);
        ctx.globalAlpha = object.opacity;

        // Draw Bars
        const visibleBars = currentValues.slice(0, object.maxBars);

        visibleBars.forEach((item, i) => {
            const targetY = i * (object.barHeight + object.gap) + 40;

            let currentY = object.yPositions[item.label];

            if (currentY === undefined || isSeek || isStaticUpdate) {
                currentY = targetY;
            } else {
                currentY = currentY + (targetY - currentY) * 0.15;
                if (Math.abs(currentY - targetY) < 0.5) currentY = targetY;
            }

            object.yPositions[item.label] = currentY;

            const y = currentY;
            const w = (item.value / maxValue) * (object.width - 150);

            ctx.fillStyle = item.color;
            ctx.beginPath();
            if ((ctx as any).roundRect) {
                (ctx as any).roundRect(0, y, w, object.barHeight, 4);
            } else {
                ctx.rect(0, y, w, object.barHeight);
            }
            ctx.fill();

            ctx.fillStyle = object.labelColor;
            ctx.font = `bold ${object.fontSize}px ${object.fontFamily}`;
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(item.label, -10, y + object.barHeight / 2);

            ctx.fillStyle = object.valueColor;
            ctx.font = `${object.fontSize * 0.9}px ${object.fontFamily}`;
            ctx.textAlign = "left";
            ctx.fillText(Math.round(item.value).toLocaleString(), w + 10, y + object.barHeight / 2);
        });

        ctx.restore();
    }
}
