import type { IRenderer } from "./IRenderer";
import { ImageObject } from "../objects/ImageObject";

export class ImageRenderer implements IRenderer<ImageObject> {
    render(ctx: CanvasRenderingContext2D, object: ImageObject, time: number) {
        if (object.loaded && object.image) {
            ctx.drawImage(object.image, object.x, object.y, object.width, object.height);
        } else {
            // Placeholder
            ctx.fillStyle = "#334155";
            ctx.fillRect(object.x, object.y, object.width, object.height);
            ctx.fillStyle = "#94a3b8";
            ctx.fillText("Loading...", object.x + 10, object.y + 20);
        }
    }
}
