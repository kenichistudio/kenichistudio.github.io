import { KinetixObject } from "../Object";

export type VisualShape = "rect" | "circle" | "text" | "icon";

export interface VisualNode {
    id: string; // Unique ID to track identity across morphs

    // Current State (Rendered)
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    color: string;
    shape: VisualShape;

    // Target State (Animation Goal)
    target: {
        x: number;
        y: number;
        width: number;
        height: number;
        rotation: number;
        opacity: number;
        color: string;
        shape: VisualShape;
    };

    // Data Context
    value: number;
    label: string;
    group?: string;
}

export interface DataPoint {
    id: string;
    value: number;
    label: string;
    color: string;
    group?: string;
}

export interface RaceDataPoint {
    year: number;
    values: Record<string, number>;
}

export type SmartChartType = "bar" | "scatter" | "bubble" | "race";

export class SmartChartObject extends KinetixObject {
    // Data Source
    public data: DataPoint[] = [];
    public raceData: RaceDataPoint[] = []; // Timeline data for race

    // Visual State
    public nodes: VisualNode[] = [];
    public chartType: SmartChartType = "bar";

    // Configuration
    public padding = { top: 40, right: 40, bottom: 60, left: 60 };
    public barGap = 0.2; // 20% gap
    public axisColor = "#666";
    public fontFamily = "Inter";

    constructor(id: string) {
        super(id, "SmartChart");
        this.width = 600;
        this.height = 400;

        // Initialize with some mock data
        this.setData([
            { id: "A", value: 10, label: "Alpha", color: "#60a5fa" },
            { id: "B", value: 25, label: "Beta", color: "#f472b6" },
            { id: "C", value: 15, label: "Gamma", color: "#34d399" },
            { id: "D", value: 30, label: "Delta", color: "#fbbf24" },
            { id: "E", value: 5, label: "Epsilon", color: "#818cf8" }
        ]);
    }

    public getDuration(): number {
        // Mock duration or configurable
        return 10000;
    }

    /**
     * Called every frame by the Renderer (or System).
     * Updates data values based on time/progress if in Race mode.
     */
    public update(time: number) {
        if (this.chartType === "race" && this.raceData.length > 1) {
            this.updateRaceData(time);
        }
        this.updateLayout();
    }

    private updateRaceData(time: number) {
        // 1. Determine relative time/progress
        // Assuming time is 0 to Duration
        const duration = this.getDuration();
        const progress = Math.min(Math.max(time / duration, 0), 1);

        // 2. Find prev and next year indices
        const totalSteps = this.raceData.length - 1;
        const currentStep = progress * totalSteps;
        const index = Math.floor(currentStep);
        const nextIndex = Math.min(index + 1, totalSteps);
        const localProgress = currentStep - index; // 0 to 1 between years

        const prevData = this.raceData[index];
        const nextData = this.raceData[nextIndex];

        // 3. Interpolate values
        // We need to update `this.data` which drives the nodes
        // Create a map for next values for O(1) lookup
        const nextValues = nextData.values;

        this.data.forEach(d => {
            const startVal = prevData.values[d.id] || 0;
            const endVal = nextValues[d.id] || 0;
            d.value = startVal + (endVal - startVal) * localProgress;
        });

        // 4. Trigger Sync (to ensure node values are updated)
        this.syncNodes();
    }

    /**
     * Updates data and triggers a layout recalculation.
     * Nodes are matched by ID to preserve identity (morphing).
     */
    setData(newData: DataPoint[]) {
        this.data = newData;
        this.syncNodes();
        this.updateLayout();
    }

    setChartType(type: SmartChartType) {
        this.chartType = type;
        this.updateLayout();
    }

    /**
     * Ensures every data point has a corresponding VisualNode.
     * Handles Enter/Exit logic by creating/flagging nodes.
     */
    private syncNodes() {
        const dataMap = new Map(this.data.map(d => [d.id, d]));
        const nodeMap = new Map(this.nodes.map(n => [n.id, n]));

        // 1. UPDATE & ENTER
        this.data.forEach(d => {
            let node = nodeMap.get(d.id);
            if (!node) {
                // ENTER: Create new node (spawn at bottom center or default pos)
                node = {
                    id: d.id,
                    x: this.width / 2,
                    y: this.height, // Spawn from bottom
                    width: 0,
                    height: 0,
                    rotation: 0,
                    opacity: 0,
                    color: d.color || "#3b82f6",
                    shape: "rect",
                    target: { // Will be set by layout
                        x: 0, y: 0, width: 0, height: 0,
                        rotation: 0, opacity: 1, color: d.color || "#3b82f6", shape: "rect"
                    },
                    value: d.value,
                    label: d.label,
                    group: d.group
                };
                this.nodes.push(node);
            } else {
                // UPDATE: Sync data props
                node.value = d.value;
                node.label = d.label;
                node.group = d.group;
                // Target opacity is 1 (visible)
                node.target.opacity = 1;
                // If color changes in data, update it?
                if (d.color) node.target.color = d.color;
            }
        });

        // 2. EXIT
        this.nodes.forEach(node => {
            if (!dataMap.has(node.id)) {
                // EXIT: Set target opacity to 0
                node.target.opacity = 0;
                // Optional: Shrink to 0 size
                node.target.width = 0;
                node.target.height = 0;
            }
        });

        // Cleanup: Ideally, we remove fully invisible nodes after animation.
        // For now, we keep them but skip rendering or filter occasionally.
    }

    /**
     * Calculates target positions for all nodes based on current ChartType.
     */
    public updateLayout() {
        const drawW = this.width - this.padding.left - this.padding.right;
        const drawH = this.height - this.padding.top - this.padding.bottom;
        const startX = this.padding.left;
        const startY = this.padding.top;

        if (this.chartType === "bar") this.layoutBarChart(drawW, drawH, startX, startY);
        else if (this.chartType === "scatter") this.layoutScatterPlot(drawW, drawH, startX, startY);
        else if (this.chartType === "race") this.layoutBarRace(drawW, drawH, startX, startY);
    }

    private layoutBarRace(drawW: number, drawH: number, startX: number, startY: number) {
        // Race Layout: Sorted Horizontal Bars
        // 1. Sort active nodes by value (Descending)
        const activeNodes = this.nodes.filter(n => n.target.opacity > 0);
        activeNodes.sort((a, b) => b.value - a.value);

        // 2. Find max value for scaling
        const maxVal = Math.max(...activeNodes.map(n => n.value)) || 1;
        const barHeight = 40;
        const gap = 10;

        activeNodes.forEach((node, rank) => {
            // Only show top N bars?
            if (rank > 10) {
                node.target.opacity = 0;
                return;
            }

            const w = (node.value / maxVal) * drawW;

            node.target.x = startX;
            node.target.y = startY + (rank * (barHeight + gap));
            node.target.width = w;
            node.target.height = barHeight;
            node.target.shape = "rect";
            // node.target.color = node.color; // Keep color
            node.target.opacity = 1;
        });
    }

    private layoutBarChart(drawW: number, drawH: number, startX: number, startY: number) {
        const activeNodes = this.nodes.filter(n => n.target.opacity > 0);
        const count = activeNodes.length;
        const step = drawW / count;
        const barW = step * (1 - this.barGap);

        const maxVal = Math.max(...this.data.map(d => d.value)) || 1;

        activeNodes.forEach((node, i) => {
            const h = (node.value / maxVal) * drawH;

            node.target.x = startX + (i * step) + (step - barW) / 2;
            node.target.y = startY + drawH - h;
            node.target.width = barW;
            node.target.height = h;
            node.target.shape = "rect";
            node.target.rotation = 0;
        });
    }

    private layoutScatterPlot(drawW: number, drawH: number, startX: number, startY: number) {
        const maxVal = Math.max(...this.data.map(d => d.value)) || 1;

        // Simple mock scatter: x is index, y is value
        this.nodes.forEach((node, i) => {
            if (node.target.opacity === 0) return;

            // Random x for demo / or index based
            const cx = startX + (i / (this.nodes.length - 1 || 1)) * drawW;
            const cy = startY + drawH - (node.value / maxVal) * drawH;

            node.target.x = cx - 10; // Center logic adjustment
            node.target.y = cy - 10;
            node.target.width = 20; // Radius * 2
            node.target.height = 20;
            node.target.shape = "circle";
            node.target.rotation = 0;
        });
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        // No-op: Handled by SmartChartRenderer
    }

    clone(): SmartChartObject {
        const clone = new SmartChartObject(`smart-${Date.now()}`);
        clone.x = this.x + 20;
        clone.y = this.y + 20;
        clone.setData(JSON.parse(JSON.stringify(this.data)));
        clone.chartType = this.chartType;
        return clone;
    }
}
