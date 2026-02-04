import { Engine } from "@core/Core";
import { CharacterObject } from "@core/objects/CharacterObject";
import { LogoCharacterObject } from "@core/objects/LogoCharacterObject";
import { User, Sparkles } from "lucide-react";

export type ShapeType = "character" | "logo";

export interface ShapeOption {
    type: ShapeType;
    label: string;
    description: string;
    icon: any;
    iconBgClass: string;
    iconColorClass: string;
}

export const SHAPE_OPTIONS: ShapeOption[] = [
    {
        type: "character",
        label: "Character",
        description: "Animated Persona",
        icon: User,
        iconBgClass: "bg-blue-100 dark:bg-blue-900/40",
        iconColorClass: "text-blue-600 dark:text-blue-400"
    },
    {
        type: "logo",
        label: "Profile Logo",
        description: "Particle Text Effect",
        icon: Sparkles,
        iconBgClass: "bg-orange-100 dark:bg-orange-900/40",
        iconColorClass: "text-orange-600 dark:text-orange-400"
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

export const createShape = (engine: Engine, type: ShapeType) => {
    if (type === "character") {
        const name = getNextName(engine, "Character");
        const char = new CharacterObject(`char-${Date.now()}`);
        char.name = name;
        char.x = engine.scene.width / 2 - 60;
        char.y = engine.scene.height / 2 - 100;
        engine.scene.add(char);
    } else if (type === "logo") {
        const name = getNextName(engine, "Header Logo");
        const logo = new LogoCharacterObject(`logo-${Date.now()}`);
        logo.name = name;
        logo.x = engine.scene.width / 2 - 150;
        logo.y = engine.scene.height / 2 - 150;
        engine.scene.add(logo);
    }
    engine.render();
};
