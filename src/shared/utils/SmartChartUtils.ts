import type { RaceDataPoint } from "../../core/objects/SmartChartObject";

export const generateMockRaceData = (years: number = 20, items: number = 10): RaceDataPoint[] => {
    const data: RaceDataPoint[] = [];
    const entityNames = [
        "React", "Vue", "Angular", "Svelte", "Ember",
        "Backbone", "jQuery", "Preact", "Alpine", "Solid"
    ];

    // Initial values
    let currentValues: Record<string, number> = {};
    entityNames.forEach(name => {
        currentValues[name] = Math.random() * 100 + 50;
    });

    const startYear = 2000;

    for (let i = 0; i < years; i++) {
        const year = startYear + i;
        const yearValues: Record<string, number> = {};

        // Evolve values
        entityNames.forEach(name => {
            // Random growth (some negative, mostly positive)
            const growth = (Math.random() - 0.2) * 50;
            currentValues[name] = Math.max(10, currentValues[name] + growth);
            yearValues[name] = currentValues[name];
        });

        data.push({
            year,
            values: { ...yearValues }
        });
    }

    return data;
};

export const MOCK_RACE_COLORS: Record<string, string> = {
    "React": "#61dafb",
    "Vue": "#42b883",
    "Angular": "#dd1b16",
    "Svelte": "#ff3e00",
    "Ember": "#e04e39",
    "Backbone": "#0071b5",
    "jQuery": "#0769ad",
    "Preact": "#673ab8",
    "Alpine": "#8bc0d0",
    "Solid": "#2c4f7c"
};

export const MOCK_RACE_GROUPS: Record<string, string> = {
    "React": "Library",
    "Vue": "Framework",
    "Angular": "Framework",
    "Svelte": "Compiler",
    "Ember": "Framework",
    "Backbone": "Library",
    "jQuery": "Library",
    "Preact": "Library",
    "Alpine": "Library",
    "Solid": "Library"
};
