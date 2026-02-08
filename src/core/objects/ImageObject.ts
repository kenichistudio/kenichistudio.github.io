import { KinetixObject } from "../Object";

export class ImageObject extends KinetixObject {
    src: string;
    public image: HTMLImageElement | null = null;
    public loaded = false;

    constructor(id: string, src: string) {
        super(id, "Image", "ImageObject");
        this.src = src;
        this.loadImage();
    }

    loadImage() {
        if (typeof window === 'undefined') return;
        this.image = new Image();
        this.image.src = this.src;
        this.image.onload = () => {
            this.loaded = true;
            // Auto size if new?
            if (this.width === 100 && this.height === 100) {
                // Standardize roughly
            }
        };
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        // Deprecated: Rendering handled by ImageRenderer via RenderSystem.
        console.warn("ImageObject.draw() called directly. This method is deprecated. Use RenderSystem.");
    }

    clone(): ImageObject {
        const clone = new ImageObject(`img-${Date.now()}`, this.src);
        clone.x = this.x + 20;
        clone.y = this.y + 20;
        clone.width = this.width;
        clone.height = this.height;
        return clone;
    }
}
