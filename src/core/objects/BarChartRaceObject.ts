import { KinetixObject } from "../Object";

interface DataPoint {
    year: number;
    values: Record<string, number>;
}

// Mock Data: Popular Social Networks (Simplified)
const MOCK_DATA: DataPoint[] = [
    { year: 2004, values: { "Facebook": 1, "MySpace": 5, "Friendster": 3, "Orkut": 2, "LinkedIn": 0.5 } },
    { year: 2005, values: { "Facebook": 5, "MySpace": 20, "Friendster": 5, "Orkut": 8, "LinkedIn": 2 } },
    { year: 2006, values: { "Facebook": 12, "MySpace": 50, "Friendster": 4, "Orkut": 15, "LinkedIn": 5, "Twitter": 0.1 } },
    { year: 2007, values: { "Facebook": 50, "MySpace": 80, "Friendster": 3, "Orkut": 25, "LinkedIn": 10, "Twitter": 5 } },
    { year: 2008, values: { "Facebook": 100, "MySpace": 75, "Friendster": 2, "Orkut": 40, "LinkedIn": 25, "Twitter": 20 } },
    { year: 2009, values: { "Facebook": 300, "MySpace": 60, "Friendster": 1, "Orkut": 50, "LinkedIn": 40, "Twitter": 50 } },
    { year: 2010, values: { "Facebook": 500, "MySpace": 40, "Instagram": 1, "Orkut": 45, "LinkedIn": 70, "Twitter": 100 } },
    { year: 2012, values: { "Facebook": 1000, "Instagram": 50, "Twitter": 200, "LinkedIn": 150, "Pinterest": 20 } },
    { year: 2015, values: { "Facebook": 1500, "Instagram": 400, "Twitter": 300, "LinkedIn": 300, "Pinterest": 100, "Snapchat": 100 } },
    { year: 2018, values: { "Facebook": 2200, "Instagram": 1000, "Twitter": 350, "LinkedIn": 500, "TikTok": 200, "Snapchat": 300 } },
    { year: 2020, values: { "Facebook": 2700, "Instagram": 1200, "TikTok": 700, "Twitter": 400, "LinkedIn": 700, "Snapchat": 400 } },
    { year: 2023, values: { "Facebook": 3000, "Instagram": 2000, "TikTok": 1600, "Twitter": 500, "LinkedIn": 900, "Snapchat": 750 } },
];

const COLORS: Record<string, string> = {
    "Facebook": "#1877F2",
    "MySpace": "#003399",
    "Friendster": "#CCCCCC",
    "Orkut": "#D6006D",
    "LinkedIn": "#0077B5",
    "Twitter": "#1DA1F2",
    "Instagram": "#E1306C",
    "Pinterest": "#BD081C",
    "Snapchat": "#FFFC00",
    "TikTok": "#000000"
};

export class BarChartRaceObject extends KinetixObject {
    maxBars: number = 8;
    data: DataPoint[] = MOCK_DATA;

    // Layout
    barHeight: number = 40;
    gap: number = 10;
    labelColor: string = "#333";
    valueColor: string = "#666";
    fontFamily: string = "Inter";
    fontSize: number = 14; // Base font size
    duration: number = 10000; // Total duration in ms

    // Dynamic Colors
    colors: Record<string, string> = {
        "Facebook": "#1877F2",
        "MySpace": "#003399",
        "Friendster": "#CCCCCC",
        "Orkut": "#D6006D",
        "LinkedIn": "#0077B5",
        "Twitter": "#1DA1F2",
        "Instagram": "#E1306C",
        "Pinterest": "#BD081C",
        "Snapchat": "#FFFC00",
        "TikTok": "#000000"
    };

    public yPositions: Record<string, number> = {};
    public lastDrawTime: number = 0;

    constructor(id: string) {
        super(id, "BarChartRace", "BarChartRaceObject");
        this.width = 600;
        this.height = 400;
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        // Deprecated: Rendering handled by BarChartRaceRenderer via RenderSystem.
        console.warn("BarChartRaceObject.draw() called directly. This method is deprecated. Use RenderSystem.");
    }

    clone(): BarChartRaceObject {
        const clone = new BarChartRaceObject(`race-${Date.now()}`);
        clone.x = this.x + 20;
        clone.y = this.y + 20;
        clone.width = this.width;
        clone.height = this.height;
        return clone;
    }
}
