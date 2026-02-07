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

export type SmartChartType = "bar" | "scatter" | "bubble";

export class SmartChartObject extends KinetixObject {
    // Data Source
    public data: { id: string, value: number, label: string, group?: string }[] = [];

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
            { id: "A", value: 10, label: "Alpha" },
            { id: "B", value: 25, label: "Beta" },
            { id: "C", value: 15, label: "Gamma" },
            { id: "D", value: 30, label: "Delta" },
            { id: "E", value: 5, label: "Epsilon" }
        ]);
    }

    /**
     * Updates data and triggers a layout recalculation.
     * Nodes are matched by ID to preserve identity (morphing).
     */
    setData(newData: { id: string, value: number, label: string, group?: string }[]) {
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
                    color: "#3b82f6",
                    shape: "rect",
                    target: { // Will be set by layout
                        x: 0, y: 0, width: 0, height: 0,
                        rotation: 0, opacity: 1, color: "#3b82f6", shape: "rect"
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
    private updateLayout() {
        const drawW = this.width - this.padding.left - this.padding.right;
        const drawH = this.height - this.padding.top - this.padding.bottom;
        const startX = this.padding.left;
        const startY = this.padding.top;

        if (this.chartType === "bar") {
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
        else if (this.chartType === "scatter") {
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
