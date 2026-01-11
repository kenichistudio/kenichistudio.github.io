import { Engine } from "../engine/Core";
import { ChartObject } from "../engine/objects/ChartObject";
import { BarChartRaceObject } from "../engine/objects/BarChartRaceObject";
import { RectangleHorizontal, Smartphone, Square, BarChart3, TrendingUp, AreaChart, ScatterChart, PieChart as PieIcon, Circle, GripHorizontal, Activity } from "lucide-react";

export type ChartType = "bar" | "line" | "area" | "scatter" | "pie" | "donut" | "race";

export interface ChartOption {
    type: ChartType;
    label: string;
    icon: any; // Lucide icon
    description?: string;
    colorClass?: string; // Optional coloring helper
}

export const CHART_TYPES: ChartOption[] = [
    { type: "bar", label: "Bar Chart", icon: BarChart3, colorClass: "text-blue-500", description: "Compare categorical data" },
    { type: "line", label: "Line Chart", icon: TrendingUp, colorClass: "text-purple-500", description: "Show trends over time" },
    { type: "area", label: "Area Chart", icon: AreaChart, colorClass: "text-emerald-500", description: "Visualize volume trends" },
    { type: "scatter", label: "Scatter Plot", icon: ScatterChart, colorClass: "text-orange-500", description: "Show correlations" },
    { type: "pie", label: "Pie Chart", icon: PieIcon, colorClass: "text-pink-500", description: "Show proportions" },
    { type: "donut", label: "Donut Chart", icon: Circle, colorClass: "text-cyan-500", description: "Show proportions with style" },
    { type: "race", label: "Bar Race", icon: Activity, colorClass: "text-indigo-500", description: "Animated ranking race" },
];

const getNextName = (engine: Engine, base: string) => {
    let count = 1;
    const regex = new RegExp(`^${base} (\\d+)$`);

    // Check existing objects
    const existingNumbers = engine.scene.objects
        .map(o => {
            const match = o.name.match(regex);
            return match ? parseInt(match[1]) : 0;
        })
        .filter(n => n > 0);

    if (existingNumbers.length > 0) {
        count = Math.max(...existingNumbers) + 1;
    }

    // Check if base name exactly exists, if so we start appending numbers
    const exactMatch = engine.scene.objects.find(o => o.name === base);
    if (exactMatch || existingNumbers.length > 0) {
        return `${base} ${count}`;
    }

    return base; // First one can just be "Bar Chart" for cleanliness if preferred, or "Bar Chart 1"
};

export const createChart = (engine: Engine, type: ChartType) => {

    // Handle Race Chart separately as it is a different class
    if (type === "race") {
        const name = getNextName(engine, "Bar Race");
        const race = new BarChartRaceObject(`race-${Date.now()}`);
        race.name = name;
        race.x = engine.scene.width / 2 - 300;
        race.y = engine.scene.height / 2 - 200;
        engine.scene.add(race);
        engine.render();
        return;
    }

    // Handle Standard Charts
    let nameBase = "Chart";
    if (type === "bar") nameBase = "Bar Chart";
    if (type === "line") nameBase = "Line Chart";
    if (type === "area") nameBase = "Area Chart";
    if (type === "scatter") nameBase = "Scatter Plot";
    if (type === "pie") nameBase = "Pie Chart";
    if (type === "donut") nameBase = "Donut Chart";

    const name = getNextName(engine, nameBase);
    const chart = new ChartObject(`chart-${Date.now()}`, type);
    chart.name = name;
    chart.x = engine.scene.width / 2 - 200;
    chart.y = engine.scene.height / 2 - 150;

    if (type === "pie" || type === "donut") {
        chart.width = 300;
        chart.height = 300;
        chart.labels = ["A", "B", "C", "D"];
        chart.data = [30, 20, 15, 35];
        chart.animation.type = "grow"; // Radial grow
    }

    engine.scene.add(chart);
    engine.render();
};
