import { SmartChartObject } from "./SmartChartObject";
import type { SmartChartType } from "./SmartChartObject";

export interface ChartTemplate {
    id: string;
    label: string;
    description: string;
    thumbnail?: string; // path to image
    config: {
        chartType: SmartChartType;
        showGrid?: boolean;
        showTicker?: boolean;
        padding?: { top: number, right: number, bottom: number, left: number };
        barHeight?: number;
        gap?: number;
        fontFamily?: string;
        axisColor?: string;
        sorted?: boolean;
    }
}

export const SMART_CHART_TEMPLATES: ChartTemplate[] = [
    {
        id: "vertical-bar",
        label: "Vertical Bar",
        description: "Classic vertical bar chart for comparison.",
        config: {
            chartType: "bar",
            showGrid: true,
            sorted: false,
            padding: { top: 40, right: 40, bottom: 40, left: 60 }
        }
    },
    {
        id: "bar-race",
        label: "Bar Chart Race",
        description: "Animated competition with moving ranks.",
        config: {
            chartType: "race",
            showGrid: true,
            showTicker: true,
            sorted: true,
            padding: { top: 40, right: 120, bottom: 40, left: 120 }
        }
    },
    {
        id: "parliament",
        label: "Parliament",
        description: "Semi-circle distribution for seats or groups.",
        config: {
            chartType: "parliament",
            showGrid: false,
            showTicker: false,
            sorted: false,
            padding: { top: 60, right: 40, bottom: 40, left: 40 }
        }
    },
    {
        id: "dot-plot",
        label: "Dot Plot",
        description: "Distribution of individual units.",
        config: {
            chartType: "dotplot",
            showGrid: true,
            showTicker: false,
            sorted: true,
            padding: { top: 40, right: 40, bottom: 60, left: 40 }
        }
    },
    {
        id: "scatter",
        label: "Scatter Plot",
        description: "2D correlation with X/Y axes.",
        config: {
            chartType: "scatter",
            showGrid: true,
            showTicker: false,
            sorted: false,
            padding: { top: 40, right: 40, bottom: 40, left: 60 }
        }
    },
    {
        id: "split-bubbles",
        label: "Split Bubbles",
        description: "Force-directed clusters of bubbles.",
        config: {
            chartType: "split",
            showGrid: false,
            showTicker: false,
            sorted: false,
            padding: { top: 40, right: 40, bottom: 40, left: 40 }
        }
    }
];
