export interface ColorPalette {
    id: string;
    label: string;
    colors: string[];
    type: 'categorical' | 'sequential' | 'diverging';
}

export const SMART_CHART_PALETTES: ColorPalette[] = [
    {
        id: "default",
        label: "Default (Blue)",
        type: "categorical",
        colors: ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#6366f1", "#14b8a6"]
    },
    {
        id: "neon",
        label: "Cyber Neon",
        type: "categorical",
        colors: ["#00f3ff", "#ff00ff", "#ffee00", "#00ff99", "#ff3300"]
    },
    {
        id: "sunset",
        label: "Sunset",
        type: "sequential",
        colors: ["#f59e0b", "#f97316", "#ef4444", "#ec4899", "#8b5cf6"]
    },
    {
        id: "ocean",
        label: "Deep Ocean",
        type: "sequential",
        colors: ["#ecfeff", "#a5f3fc", "#22d3ee", "#0891b2", "#164e63"]
    },
    {
        id: "forest",
        label: "Forest",
        type: "categorical",
        colors: ["#dcfce7", "#86efac", "#22c55e", "#15803d", "#14532d"]
    },
    {
        id: "slate",
        label: "Minimal Slate",
        type: "categorical",
        colors: ["#f8fafc", "#cbd5e1", "#94a3b8", "#64748b", "#334155"]
    }
];

export const SMART_CHART_FONTS = [
    { id: "Inter", label: "Inter (Modern)" },
    { id: "Playfair Display", label: "Playfair (Serif)" },
    { id: "JetBrains Mono", label: "Mono (Code)" },
    { id: "Arial", label: "System Default" }
];
