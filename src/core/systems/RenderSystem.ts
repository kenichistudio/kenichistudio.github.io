import { Scene } from "../Scene";
import { KinetixObject } from "../Object";
import type { IRenderer } from "../renderers/IRenderer";

export class RenderSystem {
    private renderers: Map<string, IRenderer<any>> = new Map();

    registerAndGet<T extends KinetixObject>(type: string, renderer: IRenderer<T>) {
        this.renderers.set(type.toLowerCase(), renderer);
        return renderer;
    }

    register<T extends KinetixObject>(type: string, renderer: IRenderer<T>) {
        this.renderers.set(type.toLowerCase(), renderer);
    }

    render(ctx: CanvasRenderingContext2D, scene: Scene, time: number, totalDuration: number) {
        // Sort objects by z-index (handled by array order for now)
        // or any other render logic

        scene.objects.forEach(obj => {
            if (!obj.visible) return;

            // Should skipping if opacity is 0? Maybe let renderer decide (for exit animations)

            const renderer = this.renderers.get(obj.constructor.name.toLowerCase()) || this.renderers.get('default');

            if (renderer) {
                ctx.save();
                try {
                    renderer.render(ctx, obj, time, totalDuration);
                } catch (e) {
                    console.error(`Error rendering object ${obj.id}`, e);
                }
                ctx.restore();
            } else {
                // Fallback to legacy draw if available
                if (typeof obj.draw === 'function') {
                    obj.draw(ctx, time, totalDuration);
                }
            }
        });
    }
}

export const renderSystem = new RenderSystem();
