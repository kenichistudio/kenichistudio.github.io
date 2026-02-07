import type { IRenderer } from "./IRenderer";
import { CharacterObject } from "../objects/CharacterObject";

export class CharacterRenderer implements IRenderer<CharacterObject> {
    render(ctx: CanvasRenderingContext2D, object: CharacterObject, time: number) {
        const cx = object.x + object.width / 2;
        const cy = object.y + object.height / 2;

        ctx.save();
        ctx.globalAlpha = object.opacity;

        // 1. LEGS
        ctx.fillStyle = "#1e293b";
        ctx.fillRect(cx - 20, object.y + 140, 15, 60);
        ctx.fillRect(cx + 5, object.y + 140, 15, 60);

        // 2. BODY
        ctx.fillStyle = object.costumeColor;
        ctx.beginPath();
        if ((ctx as any).roundRect) {
            (ctx as any).roundRect(cx - 30, object.y + 70, 60, 80, 10);
        } else {
            ctx.rect(cx - 30, object.y + 70, 60, 80);
        }
        ctx.fill();

        if (object.costume === "suit") {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            ctx.moveTo(cx, object.y + 70);
            ctx.lineTo(cx - 10, object.y + 110);
            ctx.lineTo(cx + 10, object.y + 110);
            ctx.fill();

            ctx.fillStyle = "#ef4444";
            ctx.fillRect(cx - 3, object.y + 70, 6, 40);
        } else if (object.costume === "superhero") {
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.arc(cx, object.y + 100, 15, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. HEAD & HAIR
        const headY = object.y + 35;
        const headBob = object.currentAnimation === "walk" ? Math.sin(time * 0.01) * 3 : 0;

        if (object.hairStyle === "long") {
            ctx.fillStyle = object.hairColor;
            ctx.fillRect(cx - 38, headY + headBob - 10, 76, 60);
        }

        ctx.fillStyle = object.skinColor;
        ctx.fillRect(cx - 8, object.y + 60, 16, 15);

        ctx.fillStyle = object.skinColor;
        ctx.beginPath();
        ctx.arc(cx, headY + headBob, 35, 0, Math.PI * 2);
        ctx.fill();

        if (object.hairStyle !== "bald") {
            ctx.fillStyle = object.hairColor;
            ctx.beginPath();
            ctx.arc(cx, headY + headBob - 5, 36, Math.PI, 0);
            ctx.fill();
        }

        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(cx - 12, headY + headBob - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(cx + 12, headY + headBob - 5, 4, 0, Math.PI * 2);
        ctx.fill();

        if (object.accessory === "glasses") {
            ctx.strokeStyle = "#334155";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx - 12, headY + headBob - 5, 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(cx + 12, headY + headBob - 5, 8, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(cx - 4, headY + headBob - 5);
            ctx.lineTo(cx + 4, headY + headBob - 5);
            ctx.stroke();
        }

        if (object.accessory === "hat") {
            ctx.fillStyle = "#334155";
            ctx.fillRect(cx - 40, headY + headBob - 30, 80, 10);
            ctx.fillRect(cx - 25, headY + headBob - 60, 50, 30);
        }

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000000";
        ctx.arc(cx, headY + headBob + 10, 8, 0, Math.PI, false);
        ctx.stroke();

        // 4. ARMS
        ctx.fillStyle = object.costume === "casual" ? object.skinColor : object.costumeColor;

        ctx.save();
        ctx.translate(cx - 30, object.y + 80);
        ctx.rotate(0.2);
        ctx.fillRect(-5, 0, 10, 50);
        ctx.fillStyle = object.skinColor;
        ctx.beginPath();
        ctx.arc(0, 50, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(cx + 30, object.y + 80);

        let armRot = -0.2;
        if (object.currentAnimation === "wave") {
            armRot = Math.PI + Math.sin(time * 0.01) * 0.5;
        } else if (object.currentAnimation === "think") {
            armRot = Math.PI - 0.5;
        }

        ctx.rotate(armRot);
        ctx.fillStyle = object.costume === "casual" ? object.skinColor : object.costumeColor;
        ctx.fillRect(-5, 0, 10, 50);
        ctx.fillStyle = object.skinColor;
        ctx.beginPath();
        ctx.arc(0, 50, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (object.currentAnimation === "think") {
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.strokeStyle = "#334155";
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.arc(cx + 40, object.y + 20, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx + 50, object.y + 10, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            if ((ctx as any).ellipse) {
                (ctx as any).ellipse(cx + 80, object.y - 20, 30, 20, 0, 0, Math.PI * 2);
            } else {
                ctx.arc(cx + 80, object.y - 20, 25, 0, Math.PI * 2);
            }
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#000000";
            ctx.font = "20px Arial";
            ctx.fillText("?", cx + 75, object.y - 12);
        }

        ctx.restore();
    }
}
