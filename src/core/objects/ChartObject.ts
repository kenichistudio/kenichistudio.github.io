import { KinetixObject } from "../Object";

export type ChartType = "bar" | "line" | "area" | "scatter" | "pie" | "donut";

export class ChartObject extends KinetixObject {
    chartType: ChartType = "bar";
    data: number[] = [10, 25, 40, 30, 60];
    labels: string[] = ["A", "B", "C", "D", "E"];

    // Customization
    color: string = "#3b82f6"; // Base color
    useMultiColor: boolean = false;
    colorPalette: string[] = ["#3B82F6", "#EC4899", "#10B981", "#F59E0B", "#8B5CF6"];
    customColors: string[] = []; // Individual overrides

    fontFamily: string = "Inter";
    fontSize: number = 12;
    axisColor: string = "#666666";
    showGrid: boolean = true;

    // New Properties
    labelPosition: "axis" | "top" | "center" = "axis";
    innerRadius: number = 0.6; // For donut (0-1 relative to radius)

    constructor(id: string, type: ChartType = "bar") {
        super(id, "Chart", "ChartObject");
        this.chartType = type;
        this.width = 400;
        this.height = 300;
        this.enterAnimation.type = "grow"; // Default animation
    }

    draw(ctx: CanvasRenderingContext2D, time: number, totalDuration: number = 5000) {
        // Deprecated: Rendering handled by ChartRenderer via RenderSystem.
        console.warn("ChartObject.draw() called directly. This method is deprecated. Use RenderSystem.");
    }

    clone(): ChartObject {
        const clone = new ChartObject(`chart-${Date.now()}`, this.chartType);
        clone.x = this.x + 20;
        clone.y = this.y + 20;
        clone.width = this.width;
        clone.height = this.height;
        clone.data = [...this.data];
        clone.labels = [...this.labels];
        clone.color = this.color;
        clone.useMultiColor = this.useMultiColor;
        clone.fontFamily = this.fontFamily;
        clone.fontSize = this.fontSize;
        clone.axisColor = this.axisColor;
        clone.showGrid = this.showGrid;
        clone.customColors = [...this.customColors];

        // Clone animation settings
        clone.enterAnimation = { ...this.enterAnimation };

        return clone;
    }
}
