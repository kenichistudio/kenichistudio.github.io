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

import { SMART_CHART_PALETTES } from "./SmartChartDesignSystem";

export type SmartChartType = "bar" | "scatter" | "bubble" | "race" | "split" | "parliament" | "dotplot";

export interface Annotation {
    id: string;
    text: string;
    targetNodeId?: string; // If set, follows the node
    x?: number; // fallback or absolute if no targetNodeId
    y?: number;
    startTime?: number; // Show from this time
    endTime?: number; // Hide after this time
    color?: string;
}

export class SmartChartObject extends KinetixObject {
    // Data Source
    public data: DataPoint[] = [];
    public raceData: RaceDataPoint[] = []; // Timeline data for race

    // Visual State
    public nodes: VisualNode[] = [];
    public annotations: Annotation[] = []; // Storytelling layers
    public chartType: SmartChartType = "bar";
    public currentLabel: string = ""; // For Race Chart Background (e.g. "2005")

    // Configuration
    public padding = { top: 60, right: 40, bottom: 60, left: 60 }; // Balanced padding
    public barGap = 0.2; // 20% gap
    public axisColor = "#666";
    public gridColor = "#333";
    public fontFamily = "Inter";
    public cornerRadius = 4;
    public colorPaletteId: string = "default"; // ID from SMART_CHART_PALETTES

    // Animation Settings
    public animationDuration: number = 800; // ms
    public animationStagger: number = 5; // ms per item index
    public animationEasing: 'linear' | 'elastic' | 'cubic' = 'cubic';

    // Toggles
    public showGrid = true;
    public showAxes = true;
    public showLabels = true;
    public showValues = true;
    public showTicker = false; // For Bar Race year ticker
    public sorted = false; // For Bar Race / Dot Plot sorting
    public labelPosition: "inside" | "outside" | "axis" = "axis";

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

        // If we are in a transition (morphing nodes), we need to ensure layout is updated
        // But `updateLayout` calculates targets. The `lerp` happens in Renderer.
        // If Renderer isn't called, no lerp. 
        // We need an external driver.

        this.updateLayout();
    }

    // Helper to trigger external loops
    public onTransition?: () => void;

    private triggerTransition() {
        if (this.onTransition) this.onTransition();
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

        // Update Label
        this.currentLabel = prevData.year.toString();

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
        this.triggerTransition();
    }

    setChartType(type: SmartChartType) {
        this.chartType = type;
        this.updateLayout();
        this.triggerTransition();
    }

    applyPalette(id: string) {
        this.colorPaletteId = id;
        const palette = SMART_CHART_PALETTES.find(p => p.id === id) || SMART_CHART_PALETTES[0];
        const colors = palette.colors;

        // Group mapping
        const groupColorMap: Record<string, string> = {};
        let groupIndex = 0;

        this.nodes.forEach((node, i) => {
            let color = colors[i % colors.length];

            if (node.group) {
                if (!groupColorMap[node.group]) {
                    groupColorMap[node.group] = colors[groupIndex % colors.length];
                    groupIndex++;
                }
                color = groupColorMap[node.group];
            }

            node.target.color = color;
            // Also update data source to persist?
            // node.color -> this.data? 
            // Ideally visual state is derived. 
            // But lets keep it simple.
        });

        this.triggerTransition();
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
                // ENTER: Create new node
                // Spawn at correct position but scale 0
                node = {
                    id: d.id,
                    x: this.width / 2, // Default center, will be updated by layout immediately
                    y: this.height / 2,
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
                // Smooth value interpolation? 
                // The renderer lerps x/y/w/h, but `value` is used for text.
                // We should lerp value too if we want counting numbers.
                // For now, let's just snap value for text, or add `displayValue` prop later.
                node.value = d.value;
                node.label = d.label;
                node.group = d.group;

                // Target opacity is 1 (visible)
                node.target.opacity = 1;
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
        else if (this.chartType === "split") this.layoutSplit(drawW, drawH, startX, startY);
        else if (this.chartType === "parliament") this.layoutParliament(drawW, drawH, startX, startY);
        else if (this.chartType === "dotplot") this.layoutDotPlot(drawW, drawH, startX, startY);
    }

    private layoutParliament(drawW: number, drawH: number, startX: number, startY: number) {
        const activeNodes = this.nodes.filter(n => n.target.opacity > 0);
        // Sort by group then value
        activeNodes.sort((a, b) => (a.group || "").localeCompare(b.group || "") || b.value - a.value);

        const cx = startX + drawW / 2;
        const cy = startY + drawH; // Bottom center

        // Approx radius
        const maxR = Math.min(drawW / 2, drawH);
        const minR = maxR * 0.3; // Inner hole

        // Calculate ideal node size -> Area = (PI*R^2 - PI*r^2)/2
        // TotalArea = N * PI * (rad/2)^2
        // rad approx sqrt(TotalAvailableArea / N)
        const totalArea = (Math.PI * maxR * maxR - Math.PI * minR * minR) / 2;
        const nodeArea = totalArea / (activeNodes.length || 1);
        const nodeRadius = Math.sqrt(nodeArea / Math.PI) * 0.8; // gap factor
        const nodeSize = nodeRadius * 2;

        let currentCount = 0;
        const totalNodes = activeNodes.length;

        // Simple ring packing
        // We can just spiral out?
        // Or row by row
        const rows = 10; // Auto-calculate?
        const step = (maxR - minR) / rows;

        // Better: Archimedean spiral-ish but constrained to semi-circle?
        // Let's use simple concentric arcs

        // Re-calculate simplistic layout:
        // iterate rows from inner to outer
        let r = minR;
        let nodeIdx = 0;

        while (nodeIdx < totalNodes && r < maxR * 1.5) {
            // How many fit in this arc?
            const arcProb = Math.PI * r;
            const countInRow = Math.floor(arcProb / (nodeSize * 1.1));
            const thetaStep = Math.PI / Math.max(1, countInRow - 1);

            for (let i = 0; i < countInRow && nodeIdx < totalNodes; i++) {
                const node = activeNodes[nodeIdx];
                const theta = Math.PI + (i * thetaStep); // Start at PI (left) go to 2PI (right)? No, 180 to 360? 
                // Canvas arc: 0 is right, PI is left. 
                // We want PI (left) to 2PI (right) -> Upper Semi? Or Bottom?
                // Visual usually is Bottom-Up -> PI to 2PI is bottom half.
                // Parliament is usually inverted U -> PI (left) -> 0 (right) via Top.
                // Let's do PI to 0 (Counter Clockwise methods usually).

                // Let's go PI to 2PI (Bottom) if cy is Top?
                // Code above: cy = startY + drawH (Bottom).
                // So we want Upper arc: PI (left) -> 1.5PI (top) -> 2PI (right) or 0? 
                // Math.cos(PI) = -1, Math.sin(PI) = 0
                // We want to fill from Left to Right.

                const angle = Math.PI + (Math.PI * (i / Math.max(1, countInRow - 1)));

                // Wait, Parliament is usually an Arch.
                // Left (-1, 0) to Right (1, 0) going UP.
                // Angle PI to 0. 

                const actualAngle = Math.PI - (Math.PI * i / Math.max(1, countInRow - 1)); // Go backwards from PI to 0

                // Let's try:
                // i=0 -> PI
                // i=max -> 0

                const finalAngle = Math.PI - (Math.PI * (i / Math.max(1, countInRow - 1)));

                node.target.x = cx + Math.cos(finalAngle) * r;
                node.target.y = cy - Math.sin(finalAngle) * r; // subtract Y because canvas Y is down
                node.target.width = nodeSize;
                node.target.height = nodeSize;
                node.target.shape = "circle";
                node.target.rotation = 0;
                node.target.opacity = 1;

                if (node.opacity === 0 && node.width === 0) {
                    node.x = cx;
                    node.y = cy;
                }

                nodeIdx++;
            }
            r += nodeSize * 1.1;
        }
    }

    private layoutDotPlot(drawW: number, drawH: number, startX: number, startY: number) {
        const activeNodes = this.nodes.filter(n => n.target.opacity > 0);
        const maxVal = Math.max(...this.data.map(d => d.value)) || 1;
        const nodeSize = 15;

        // Bucket for stacking
        // Round values to nearest "nodeSize" equivalent in pixel space?
        // Or just bin them.

        const bins: Record<number, number> = {}; // binIndex -> count
        const range = drawW;

        activeNodes.forEach(node => {
            const xPos = (node.value / maxVal) * drawW;
            // Discretize xPos to bin
            const binIdx = Math.floor(xPos / (nodeSize + 2));

            if (!bins[binIdx]) bins[binIdx] = 0;
            const stackIdx = bins[binIdx]++;

            // X is precise, Y is stacked? 
            // Truly "Dot Plot" often bins the X too. 
            // Let's bin X for clean stacks.

            const finalX = startX + binIdx * (nodeSize + 2);
            const finalY = (startY + drawH) - nodeSize / 2 - (stackIdx * (nodeSize + 2));

            node.target.x = finalX;
            node.target.y = finalY;
            node.target.width = nodeSize;
            node.target.height = nodeSize;
            node.target.shape = "circle";
            node.target.rotation = 0;
            node.target.opacity = 1;

            if (node.opacity === 0 && node.width === 0) {
                node.x = finalX;
                node.y = startY + drawH;
            }
        });
    }

    private layoutSplit(drawW: number, drawH: number, startX: number, startY: number) {
        // Group nodes by 'group' property
        const groups: Record<string, VisualNode[]> = {};
        const activeNodes = this.nodes.filter(n => n.target.opacity > 0);

        activeNodes.forEach(node => {
            const g = node.group || "Other";
            if (!groups[g]) groups[g] = [];
            groups[g].push(node);
        });

        const groupKeys = Object.keys(groups).sort();
        const groupCount = groupKeys.length;
        if (groupCount === 0) return;

        // Split width into columns
        const colWidth = drawW / groupCount;

        groupKeys.forEach((key, colIndex) => {
            const groupNodes = groups[key];
            const colX = startX + (colIndex * colWidth);
            const centerX = colX + colWidth / 2;

            // Stack vertically in each column (simple stack for now)
            // Or bubble pack? Let's do bubble pack like Beeswarm

            // Simple Vertical Stack for MVP
            const nodeHeight = 30;
            const totalHeight = groupNodes.length * (nodeHeight + 5);
            let currentY = startY + (drawH - totalHeight) / 2; // Center vertically

            groupNodes.forEach(node => {
                node.target.x = centerX - 15;
                node.target.y = currentY;
                node.target.width = 30;
                node.target.height = 30;
                node.target.shape = "circle";
                node.target.rotation = 0;
                node.target.opacity = 1;

                currentY += nodeHeight + 5;
            });
        });
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

            // "Spawn in place" logic: 
            // If node is invisible and has no dimensions, assume it's new and teleport
            if (node.opacity === 0 && node.width === 0) {
                node.x = node.target.x + barW / 2;
                node.y = node.target.y + h; // Start at bottom
            }
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

            // Spawn logic
            if (node.opacity === 0 && node.width === 0) {
                node.x = cx;
                node.y = cy;
            }
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
