export interface ParsedSVG {
    bgPath: string;
    logoPath: string;
    viewBox: string;
    width: number;
    height: number;
}

export const SVGProcessor = {
    async parse(file: File): Promise<ParsedSVG> {
        const text = await file.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "image/svg+xml");

        // 1. Extract ViewBox / Dimensions
        const svg = doc.querySelector("svg");
        if (!svg) throw new Error("Invalid SVG: No <svg> tag found.");

        const viewBox = svg.getAttribute("viewBox") || "0 0 1024 1024";
        const width = parseFloat(svg.getAttribute("width") || "1024");
        const height = parseFloat(svg.getAttribute("height") || "1024");

        // 2. Extract Paths
        const paths = Array.from(doc.querySelectorAll("path"));
        if (paths.length === 0) throw new Error("No paths found in SVG.");

        let bgPath = "";
        let logoPath = "";

        // Heuristic: If we have exactly 2 paths, assume 0 is BG and 1 is Logo (common in our brand files)
        if (paths.length >= 2) {
            bgPath = paths[0].getAttribute("d") || "";
            // Combine all other paths as logo parts if multiple
            logoPath = paths.slice(1).map(p => p.getAttribute("d")).join(" ");
        } else {
            // Single path? Treat as logo, use full rect as BG placeholder
            logoPath = paths[0].getAttribute("d") || "";
            bgPath = `M0 0h${width}v${height}H0z`; // Full rect
        }

        return { bgPath, logoPath, viewBox, width, height };
    }
};
