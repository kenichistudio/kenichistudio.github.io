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

    async svgToPng(svgElement: SVGSVGElement, width: number, height: number): Promise<Blob> {
        return new Promise((resolve, reject) => {
            // 1. Serialize SVG to XML
            const serializer = new XMLSerializer();
            const source = serializer.serializeToString(svgElement);

            // 2. Wrap in proper Blob with namespace
            const svgBlob = new Blob([source], { type: "image/svg+xml;charset=utf-8" });
            const url = URL.createObjectURL(svgBlob);

            // 3. Draw to Canvas
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                if (!ctx) {
                    reject(new Error("Could not get canvas context"));
                    return;
                }
                ctx.drawImage(img, 0, 0, width, height);
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
