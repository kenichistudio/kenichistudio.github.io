export const ExportUtils = {
    downloadBlob(blob: Blob, filename: string) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    async svgToPng(svgElement: SVGSVGElement, width: number, height: number, scale = 1): Promise<Blob> {
        return new Promise((resolve, reject) => {
            const scaledWidth = width * scale;
            const scaledHeight = height * scale;

            // 1. Clone & Enforce Dimensions (Fixes "Squashed" bugs)
            // We clone so we don't mess up the visible UI
            const clone = svgElement.cloneNode(true) as SVGSVGElement;
            clone.setAttribute("width", scaledWidth.toString());
            clone.setAttribute("height", scaledHeight.toString());
            clone.style.width = ""; // Reset CSS interference
            clone.style.height = "";
            clone.style.transform = "";

            // 2. Serialize
            const serializer = new XMLSerializer();
            const source = serializer.serializeToString(clone);

            // 3. Blob & URL
            const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);

            // 4. Draw to Canvas
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = scaledWidth;
                canvas.height = scaledHeight;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }
                // High-quality scaling
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = "high";

                ctx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
                URL.revokeObjectURL(url);

                canvas.toBlob(blob => {
                    if (blob) resolve(blob);
                    else reject(new Error("Canvas to Blob failed"));
                }, "image/png");
            };
            img.onerror = (e) => reject(e);
            img.src = url;
        });
    }
};
