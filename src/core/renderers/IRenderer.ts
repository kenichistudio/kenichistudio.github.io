import { KinetixObject } from "../Object";

export interface IRenderer<T extends KinetixObject> {
    render(ctx: CanvasRenderingContext2D, object: T, time: number, totalDuration?: number): void;
}
