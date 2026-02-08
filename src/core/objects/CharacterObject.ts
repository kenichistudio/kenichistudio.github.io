import { KinetixObject } from "../Object";

export type CharacterAnimation = "idle" | "wave" | "think" | "walk";
export type CharacterCostume = "casual" | "suit" | "superhero";

export class CharacterObject extends KinetixObject {
    skinColor: string = "#fca5a5"; // Default peach
    costume: CharacterCostume = "casual";
    costumeColor: string = "#3b82f6"; // Default blue
    currentAnimation: CharacterAnimation = "idle";

    hairStyle: "short" | "long" | "bald" = "short";
    hairColor: string = "#334155";
    accessory: "none" | "glasses" | "hat" = "none";

    // Internal animation state
    public animOffset = 0;

    constructor(id: string) {
        super(id, "Character", "CharacterObject");
        this.width = 120;
        this.height = 200;
        this.name = "My Character";
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        // Simple stylized character drawing
        // Origin is this.x, this.y (Top-Left)
        // Center X relative to object
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        // Animate based on time (ms)
        this._updateAnimation(time);

        ctx.save();

        // Handle global opacity/transform if we were using a matrix, but here we just draw at x,y
        ctx.globalAlpha = this.opacity;

        // 1. LEGS
        ctx.fillStyle = "#1e293b"; // Dark pants
        // Left Leg
        ctx.fillRect(cx - 20, this.y + 140, 15, 60);
        // Right Leg
        ctx.fillRect(cx + 5, this.y + 140, 15, 60);

        // 2. BODY (Torso)
        ctx.fillStyle = this.costumeColor;
        if (this.costume === "suit") {
            // Draw Tie later
        }

        // Torso Box
        ctx.beginPath();
        ctx.roundRect(cx - 30, this.y + 70, 60, 80, 10);
        ctx.fill();

        // Suit details
        if (this.costume === "suit") {
            ctx.fillStyle = "#ffffff";
            ctx.beginPath();
            // V-neck shirt
            ctx.moveTo(cx, this.y + 70);
            ctx.lineTo(cx - 10, this.y + 110);
            ctx.lineTo(cx + 10, this.y + 110);
            ctx.fill();

            // Tie
            ctx.fillStyle = "#ef4444";
            ctx.fillRect(cx - 3, this.y + 70, 6, 40);
        } else if (this.costume === "superhero") {
            // Logo
            ctx.fillStyle = "#fbbf24";
            ctx.beginPath();
            ctx.arc(cx, this.y + 100, 15, 0, Math.PI * 2);
            ctx.fill();
        }

        // 3. HEAD & HAIR
        const headY = this.y + 35;
        // Bobbing animation for head
        const headBob = this.currentAnimation === "walk" ? Math.sin(time * 0.01) * 3 : 0;

        // Hair (Back)
        if (this.hairStyle === "long") {
            ctx.fillStyle = this.hairColor;
            ctx.fillRect(cx - 38, headY + headBob - 10, 76, 60);
        }

        // Neck
        ctx.fillStyle = this.skinColor;
        ctx.fillRect(cx - 8, this.y + 60, 16, 15);

        // Head Circle
        ctx.fillStyle = this.skinColor;
        ctx.beginPath();
        ctx.arc(cx, headY + headBob, 35, 0, Math.PI * 2);
        ctx.fill();

        // Hair (Top/Front)
        if (this.hairStyle !== "bald") {
            ctx.fillStyle = this.hairColor;
            ctx.beginPath();
            ctx.arc(cx, headY + headBob - 5, 36, Math.PI, 0); // Top half
            ctx.fill();
        }

        // Eyes (Blinking logic could go here)
        ctx.fillStyle = "#000000";
        // Left Eye
        ctx.beginPath();
        ctx.arc(cx - 12, headY + headBob - 5, 4, 0, Math.PI * 2);
        ctx.fill();
        // Right Eye
        ctx.beginPath();
        ctx.arc(cx + 12, headY + headBob - 5, 4, 0, Math.PI * 2);
        ctx.fill();

        // Accessory: Glasses
        if (this.accessory === "glasses") {
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

        // Accessory: Hat
        if (this.accessory === "hat") {
            ctx.fillStyle = "#334155";
            ctx.fillRect(cx - 40, headY + headBob - 30, 80, 10); // Brim
            ctx.fillRect(cx - 25, headY + headBob - 60, 50, 30); // Top
        }

        // Mouth (Smile)
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "#000000";
        ctx.arc(cx, headY + headBob + 10, 8, 0, Math.PI, false);
        ctx.stroke();

        // 4. ARMS
        ctx.fillStyle = this.costume === "casual" ? this.skinColor : this.costumeColor;

        // Left Arm (Normal)
        ctx.save();
        ctx.translate(cx - 30, this.y + 80);
        ctx.rotate(0.2); // Slight relax
        ctx.fillRect(-5, 0, 10, 50);
        // Hand
        ctx.fillStyle = this.skinColor;
        ctx.beginPath();
        ctx.arc(0, 50, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Right Arm (Animated)
        ctx.save();
        ctx.translate(cx + 30, this.y + 80);

        let armRot = -0.2;
        if (this.currentAnimation === "wave") {
            armRot = Math.PI + Math.sin(time * 0.01) * 0.5; // Wave up high
        } else if (this.currentAnimation === "think") {
            armRot = Math.PI - 0.5; // Hand to chin roughly
        }

        ctx.rotate(armRot);
        ctx.fillStyle = this.costume === "casual" ? this.skinColor : this.costumeColor;
        ctx.fillRect(-5, 0, 10, 50);
        // Hand
        ctx.fillStyle = this.skinColor;
        ctx.beginPath();
        ctx.arc(0, 50, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Thinking Bubble
        if (this.currentAnimation === "think") {
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.strokeStyle = "#334155";
            ctx.lineWidth = 2;

            // Bubbles
            ctx.beginPath();
            ctx.arc(cx + 40, this.y + 20, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cx + 50, this.y + 10, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Cloud
            ctx.beginPath();
            ctx.ellipse(cx + 80, this.y - 20, 30, 20, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = "#000000";
            ctx.font = "20px Arial";
            ctx.fillText("?", cx + 75, this.y - 12);
        }

        ctx.restore();
    }

    private _updateAnimation(time: number) {
        // Just state updates if needed
    }

    clone(): CharacterObject {
        const c = new CharacterObject(`char-${Date.now()}`);
        c.x = this.x + 20;
        c.y = this.y + 20;
        c.width = this.width;
        c.height = this.height;
        c.skinColor = this.skinColor;
        c.costume = this.costume;
        c.costumeColor = this.costumeColor;
        c.hairStyle = this.hairStyle;
        c.hairColor = this.hairColor;
        c.accessory = this.accessory;
        return c;
    }
}
