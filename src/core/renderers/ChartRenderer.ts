import type { IRenderer } from "./IRenderer";
import { ChartObject } from "../objects/ChartObject";

export class ChartRenderer implements IRenderer<ChartObject> {
    render(ctx: CanvasRenderingContext2D, object: ChartObject, time: number, totalDuration: number = 5000) {
        // Animation Parameters
        const duration = object.enterAnimation.duration;
        const animType = object.enterAnimation.type;

        let globalProgress = 0;
        if (time < duration && animType !== "none") {
            globalProgress = Math.min(time / duration, 1);
        } else if (animType === "none" || time >= duration) {
            globalProgress = 1;
        }

        ctx.save();
        const cx = object.x + object.width / 2;
        const cy = object.y + object.height / 2;
        ctx.translate(cx, cy);
        ctx.rotate((object.rotation || 0) * Math.PI / 180);
        ctx.scale(object.scaleX || 1, object.scaleY || 1);
        ctx.translate(-cx, -cy);

        ctx.globalAlpha = object.opacity;

        const padding = { top: 20, right: 20, bottom: 40, left: 40 };
        const chartWidth = object.width - padding.left - padding.right;
        const chartHeight = object.height - padding.top - padding.bottom;
        const startX = object.x + padding.left;
        const startY = object.y + padding.top;
        const maxVal = Math.max(...object.data) * 1.1 || 10;

        // --- AXES & GRID (Cartesian only) ---
        if (["bar", "line", "area", "scatter"].includes(object.chartType)) {
            // Draw Axes
            ctx.beginPath();
            ctx.strokeStyle = object.axisColor;
            ctx.lineWidth = 1;
            ctx.moveTo(startX, startY + chartHeight);
            ctx.lineTo(startX + chartWidth, startY + chartHeight); // X Axis
            ctx.moveTo(startX, startY);
            ctx.lineTo(startX, startY + chartHeight); // Y Axis
            ctx.stroke();

            // Draw Grid
            if (object.showGrid) {
                ctx.beginPath();
                ctx.strokeStyle = object.axisColor;
                ctx.lineWidth = 0.5;
                ctx.globalAlpha = 0.2 * object.opacity;
                for (let i = 0; i <= 4; i++) {
                    const y = startY + chartHeight - (chartHeight * i) / 4;
                    ctx.moveTo(startX, y);
                    ctx.lineTo(startX + chartWidth, y);
                }
                ctx.stroke();
                ctx.globalAlpha = object.opacity;
            }

            // Draw Y Axis Labels
            ctx.fillStyle = object.axisColor;
            ctx.font = `${object.fontSize}px ${object.fontFamily}`;
            ctx.textAlign = "right";
            for (let i = 0; i <= 4; i++) {
                const val = Math.round((maxVal * i) / 4);
                const y = startY + chartHeight - (chartHeight * i) / 4;
                ctx.fillText(val.toString(), startX - 5, y + object.fontSize / 3);
            }
        }

        // --- BAR CHART ---
        if (object.chartType === "bar") {
            const step = chartWidth / object.data.length;
            const barWidth = step * 0.7;
            const gap = step * 0.15;

            object.data.forEach((val, i) => {
                // Staggered Animation
                const staggerDelay = 50 * i; // ms
                let localTime = time - staggerDelay;
                if (animType === "none") localTime = duration;

                let progress = 0;
                if (localTime > 0) {
                    progress = Math.min(localTime / (duration - staggerDelay || 1), 1);
                    if (animType === "grow") progress = 1 - Math.pow(1 - progress, 3); // EaseOut
                }

                if (progress <= 0 && animType !== "none") return;

                const targetH = (val / maxVal) * chartHeight;
                const h = targetH * progress;

                const bx = startX + i * step + gap;
                const by = startY + chartHeight - h;

                // Color Logic: Custom > Multi/Palette > Single
                let barColor = object.color;
                if (object.customColors[i]) {
                    barColor = object.customColors[i];
                } else if (object.useMultiColor) {
                    barColor = object.colorPalette[i % object.colorPalette.length];
                }

                ctx.fillStyle = barColor;
                ctx.fillRect(bx, by, barWidth, h);

                // Labels
                if (object.labels[i] && object.labelPosition !== "center") {
                    ctx.fillStyle = object.axisColor;
                    ctx.textAlign = "center";
                    if (object.labelPosition === "axis") {
                        ctx.fillText(object.labels[i], bx + barWidth / 2, startY + chartHeight + object.fontSize + 5);
                    } else if (object.labelPosition === "top") {
                        ctx.fillText(val.toString(), bx + barWidth / 2, by - 5);
                    }
                }
            });
        }

        // --- LINE / AREA CHART ---
        if (object.chartType === "line" || object.chartType === "area") {
            const step = chartWidth / (object.data.length - 1 || 1);
            const points = object.data.map((val, i) => ({
                x: startX + i * step,
                y: startY + chartHeight - (val / maxVal) * chartHeight
            }));

            // Animation: progressive draw (Wipe L->R)
            const maxDrawX = startX + chartWidth * (animType === "grow" ? globalProgress : 1);

            if (points.length > 0) {
                ctx.beginPath();
                ctx.strokeStyle = object.color;
                ctx.lineWidth = 3;
                ctx.lineJoin = "round";
                ctx.lineCap = "round";

                // Build path carefully to clip at maxDrawX
                ctx.moveTo(points[0].x, points[0].y);
                let lastDrawnPoint = points[0];

                for (let i = 1; i < points.length; i++) {
                    const p = points[i];
                    const prevP = points[i - 1];
                    if (p.x <= maxDrawX) {
                        ctx.lineTo(p.x, p.y);
                        lastDrawnPoint = p;
                    } else {
                        if (prevP.x < maxDrawX) {
                            const ratio = (maxDrawX - prevP.x) / (p.x - prevP.x);
                            const y = prevP.y + (p.y - prevP.y) * ratio;
                            ctx.lineTo(maxDrawX, y);
                            lastDrawnPoint = { x: maxDrawX, y };
                        }
                        break;
                    }
                }

                if (object.chartType === "line") {
                    ctx.stroke();
                } else {
                    // Close path for Area
                    ctx.lineTo(lastDrawnPoint.x, startY + chartHeight);
                    ctx.lineTo(startX, startY + chartHeight);
                    ctx.closePath();
                    ctx.fillStyle = object.color;
                    ctx.globalAlpha = 0.5 * object.opacity;
                    ctx.fill();
                    ctx.globalAlpha = object.opacity;

                    ctx.beginPath();
                    ctx.moveTo(points[0].x, points[0].y);
                    for (let i = 1; i < points.length; i++) {
                        if (points[i].x <= maxDrawX) ctx.lineTo(points[i].x, points[i].y);
                        else if (points[i - 1].x < maxDrawX) {
                            const ratio = (maxDrawX - points[i - 1].x) / (points[i].x - points[i - 1].x);
                            const y = points[i - 1].y + (points[i].y - points[i - 1].y) * ratio;
                            ctx.lineTo(maxDrawX, y);
                            break;
                        }
                    }
                    ctx.stroke();
                }
            }

            // Dots
            if (object.chartType === "line") {
                points.forEach((p, i) => {
                    if (p.x <= maxDrawX) {
                        ctx.beginPath();
                        let dotColor = object.useMultiColor ? object.colorPalette[i % object.colorPalette.length] : "white";
                        if (object.customColors[i]) dotColor = object.customColors[i];

                        ctx.fillStyle = dotColor;
                        ctx.strokeStyle = object.color;
                        ctx.lineWidth = 2;
                        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
                        ctx.fill();
                        ctx.stroke();

                        if (object.labels[i] && object.labelPosition === "axis") {
                            ctx.fillStyle = object.axisColor;
                            ctx.textAlign = "center";
                            ctx.fillText(object.labels[i], p.x, startY + chartHeight + object.fontSize + 5);
                        }
                    }
                });
            }
        }

        // --- SCATTER PLOT ---
        if (object.chartType === "scatter") {
            const step = chartWidth / (object.data.length - 1 || 1);
            object.data.forEach((val, i) => {
                const stagger = i * 100;
                let localT = 1;
                if (animType === "grow") {
                    localT = Math.max(0, Math.min((time - stagger) / 400, 1));
                    const c4 = (2 * Math.PI) / 3;
                    if (localT > 0 && localT < 1) localT = Math.pow(2, -10 * localT) * Math.sin((localT * 10 - 0.75) * c4) + 1;
                }
                if (localT <= 0 && animType !== "none") return;

                const x = startX + i * step;
                const y = startY + chartHeight - (val / maxVal) * chartHeight;

                ctx.beginPath();

                let dotColor = object.color;
                if (object.customColors[i]) dotColor = object.customColors[i];
                else if (object.useMultiColor) dotColor = object.colorPalette[i % object.colorPalette.length];

                ctx.fillStyle = dotColor;
                ctx.arc(x, y, 6 * localT, 0, Math.PI * 2);
                ctx.fill();

                if (object.labels[i] && object.labelPosition === "top") {
                    ctx.fillStyle = object.axisColor;
                    ctx.textAlign = "center";
                    ctx.globalAlpha = localT * object.opacity;
                    ctx.fillText(val.toString(), x, y - 10);
                    ctx.globalAlpha = object.opacity;
                }
            });
        }

        // --- PIE / DONUT ---
        if (object.chartType === "pie" || object.chartType === "donut") {
            const centerX = object.x + object.width / 2;
            const centerY = object.y + object.height / 2;
            const radius = Math.min(object.width, object.height) / 2 - 20;
            const innerR = object.chartType === "donut" ? radius * object.innerRadius : 0;

            const total = object.data.reduce((a, b) => a + b, 0);
            let currentAngle = -Math.PI / 2;

            object.data.forEach((val, i) => {
                const sliceAngle = (val / total) * (Math.PI * 2);
                const endAngle = currentAngle + sliceAngle;

                let visibleSliceAngle = sliceAngle;
                if (animType === "grow") {
                    const totalAngle = Math.PI * 2;
                    const targetEnd = -Math.PI / 2 + totalAngle * globalProgress;

                    if (currentAngle > targetEnd) {
                        visibleSliceAngle = 0;
                    } else if (endAngle > targetEnd) {
                        visibleSliceAngle = targetEnd - currentAngle;
                    }
                }

                if (visibleSliceAngle > 0) {
                    ctx.beginPath();
                    if (object.chartType === "donut") {
                        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + visibleSliceAngle, false);
                        ctx.arc(centerX, centerY, innerR, currentAngle + visibleSliceAngle, currentAngle, true);
                        ctx.closePath();
                    } else {
                        ctx.moveTo(centerX, centerY);
                        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + visibleSliceAngle);
                        ctx.closePath();
                    }

                    let sliceColor = (i === 0 ? object.color : "#eeeeee");
                    if (object.useMultiColor) sliceColor = object.colorPalette[i % object.colorPalette.length];
                    if (object.customColors[i]) sliceColor = object.customColors[i];

                    ctx.fillStyle = sliceColor;

                    if (!object.useMultiColor && !object.customColors[i]) {
                        ctx.globalAlpha = (1 - i * 0.1) * object.opacity;
                        ctx.fill();
                        ctx.globalAlpha = object.opacity;
                    } else {
                        ctx.fill();
                    }

                    ctx.strokeStyle = "#fff";
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    if (object.labels[i] && visibleSliceAngle > sliceAngle * 0.5) {
                        const midAngle = currentAngle + visibleSliceAngle / 2;
                        const labelR = innerR + (radius - innerR) / 2;
                        const lx = centerX + Math.cos(midAngle) * labelR;
                        const ly = centerY + Math.sin(midAngle) * labelR;

                        ctx.fillStyle = "white";
                        ctx.font = `bold ${object.fontSize}px ${object.fontFamily}`;
                        ctx.textAlign = "center";
                        ctx.fillText(object.labels[i], lx, ly + 4);
                    }
                }
                currentAngle += sliceAngle;
            });
        }
        ctx.restore();
    }
}
