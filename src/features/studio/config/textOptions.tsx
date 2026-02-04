import { Engine } from "@core/Core";
import { TextObject } from "@core/objects/TextObject";
import { ParticleTextObject } from "@core/objects/ParticleTextObject";
import { Type, Sparkles, Wand2 } from "lucide-react";

export type TextType = "heading" | "subheading" | "particle";

export interface TextOption {
    type: TextType;
    label: string;
    description: string;
    icon: any;
    colorClass?: string;
    bgClass?: string;
}

export const TEXT_OPTIONS: TextOption[] = [
    {
        type: "heading",
        label: "Heading",
        description: "Inter Display, Bold",
        icon: Type,
        bgClass: "bg-white dark:bg-neutral-800",
        colorClass: "text-slate-900 dark:text-white"
    },
    {
        type: "subheading",
        label: "Subheading",
        description: "Inter Display, Medium",
        icon: Type,
        bgClass: "bg-white dark:bg-neutral-800",
        colorClass: "text-slate-700 dark:text-neutral-300"
    },
    {
        type: "particle",
        label: "Particle Text",
        description: "Explode, Assemble, Vortex FX",
        icon: Wand2,
        bgClass: "bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 dark:from-violet-900/20 dark:to-fuchsia-900/20 border-violet-200 dark:border-violet-900/30",
        colorClass: "text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 dark:from-violet-400 dark:to-fuchsia-400"
    }
];

const getNextName = (engine: Engine, base: string) => {
    let count = 1;
    const regex = new RegExp(`^${base} (\\d+)$`);

    const existingNumbers = engine.scene.objects
        .map(o => {
            const match = o.name.match(regex);
            return match ? parseInt(match[1]) : 0;
        })
        .filter(n => n > 0);

    if (existingNumbers.length > 0) {
        count = Math.max(...existingNumbers) + 1;
    }

    const exactMatch = engine.scene.objects.find(o => o.name === base);
    if (exactMatch || existingNumbers.length > 0) {
        return `${base} ${count}`;
    }

    return base;
};


export interface TextEffect {
    id: string;
    label: string;
    // Styling
    fontFamily: string;
    color: string;
    fontSize?: number;
    strokeColor?: string;
    strokeWidth?: number;
    shadow?: {
        color: string;
        blur: number;
        offsetX: number;
        offsetY: number;
    };
    backgroundColor?: string;
    backgroundPadding?: number;
    backgroundRadius?: number;
    // UI Preview
    previewStyle: React.CSSProperties; // Simplified for UI
}

export const TEXT_EFFECTS: TextEffect[] = [
    {
        id: "plain",
        label: "Plain",
        fontFamily: "Inter",
        color: "#ffffff",
        previewStyle: { color: "white", fontFamily: "Inter", fontWeight: "bold" }
    },
    {
        id: "outline",
        label: "Outline",
        fontFamily: "Inter Display",
        color: "transparent",
        strokeColor: "#ffffff",
        strokeWidth: 2,
        previewStyle: { WebkitTextStroke: "1px white", color: "transparent", fontFamily: "Inter Display", fontWeight: "900" }
    },
    {
        id: "shadow-pop",
        label: "Pop",
        fontFamily: "Impact",
        color: "#fbbf24", // Amber
        shadow: { color: "#000000", blur: 0, offsetX: 4, offsetY: 4 },
        previewStyle: { color: "#fbbf24", fontFamily: "Impact", textShadow: "4px 4px 0px black" }
    },
    {
        id: "neon",
        label: "Neon",
        fontFamily: "Inter",
        color: "#c084fc", // Purple
        shadow: { color: "#a855f7", blur: 15, offsetX: 0, offsetY: 0 },
        previewStyle: { color: "#f3e8ff", fontFamily: "Inter", textShadow: "0 0 10px #a855f7, 0 0 20px #a855f7", fontWeight: "bold" }
    },
    {
        id: "retro",
        label: "Retro",
        fontFamily: "Inter Display",
        color: "#f43f5e",
        shadow: { color: "#fecdd3", blur: 0, offsetX: 3, offsetY: 3 },
        strokeColor: "#fff1f2",
        strokeWidth: 2,
        previewStyle: { color: "#f43f5e", fontFamily: "Inter Display", fontWeight: "900", textShadow: "3px 3px 0px #fecdd3", WebkitTextStroke: "1px #fff1f2" }
    },
    {
        id: "badge",
        label: "Badge",
        fontFamily: "Inter",
        color: "#ffffff",
        backgroundColor: "#2563eb", // Blue
        backgroundPadding: 8,
        backgroundRadius: 4,
        previewStyle: { color: "white", fontFamily: "Inter", fontWeight: "bold", backgroundColor: "#2563eb", padding: "4px 8px", borderRadius: "4px" }
    }
];

export const createText = (engine: Engine, type: TextType | string, effect?: TextEffect) => {
    if (type === "particle") {
        const name = getNextName(engine, "Particles");
        const obj = new ParticleTextObject(`ptext-${Date.now()}`);
        obj.name = name;
        obj.text = "PARTICLES";
        obj.x = engine.scene.width / 2 - 300;
        obj.y = engine.scene.height / 2 - 75;
        engine.scene.add(obj);
        engine.render();
        return;
    }

    if (effect) {
        const name = getNextName(engine, effect.label);
        const txt = new TextObject(`text-${Date.now()}`, {
            text: effect.label, // Use label as default text
            fontSize: effect.fontSize || 80,
            fontFamily: effect.fontFamily,
            color: effect.color,
            strokeColor: effect.strokeColor,
            strokeWidth: effect.strokeWidth,
            shadow: effect.shadow,
            backgroundColor: effect.backgroundColor,
            backgroundPadding: effect.backgroundPadding,
            backgroundRadius: effect.backgroundRadius
        });
        txt.name = name;
        txt.x = engine.scene.width / 2 - (txt.width / 2);
        txt.y = engine.scene.height / 2 - (txt.height / 2);
        engine.scene.add(txt);
        engine.render();
        return;
    }

    const isHeading = type === "heading";
    const name = getNextName(engine, isHeading ? "Heading" : "Subheading");
    const txt = new TextObject(`text-${Date.now()}`, {
        text: name,
        fontSize: isHeading ? 80 : 40,
        color: "#ffffff"
    });
    txt.name = name;
    txt.text = name;
    txt.x = engine.scene.width / 2 - 150;
    txt.y = engine.scene.height / 2 - 50;
    engine.scene.add(txt);
    engine.render();
};
