import { Engine } from "../engine/Core";
import { TextObject } from "../engine/objects/TextObject";
import { ParticleTextObject } from "../engine/objects/ParticleTextObject";
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

export const createText = (engine: Engine, type: TextType) => {
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
