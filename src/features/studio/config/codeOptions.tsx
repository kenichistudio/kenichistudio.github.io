import { Engine } from "@core/Core";
import { CodeBlockObject } from "@core/objects/CodeBlockObject";
import { Terminal } from "lucide-react";

export type CodeType = "code";

export interface CodeOption {
    type: CodeType;
    label: string;
    description: string;
    icon: any;
}

export const CODE_OPTIONS: CodeOption[] = [
    {
        type: "code",
        label: "Code Block",
        description: "Syntax highlighted code snippet",
        icon: Terminal
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

export const createCode = (engine: Engine, type: CodeType) => {
    const name = getNextName(engine, "Code");
    const code = new CodeBlockObject(`code-${Date.now()}`);
    code.name = name;
    code.x = engine.scene.width / 2 - 200;
    code.y = engine.scene.height / 2 - 100;
    engine.scene.add(code);
    engine.render();
};
