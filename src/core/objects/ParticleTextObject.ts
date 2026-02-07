import { KinetixObject } from "../Object";
import { Scene } from "../Scene";

export type ParticleAnimationType = "none" | "explode" | "assemble" | "vortex" | "float";

export interface TextParticle {
    x: number;      // Current Position
    y: number;
    tx: number;     // Target Position (Home)
    ty: number;
    vx: number;     // Velocity
    vy: number;
    originX: number; // Starting pos for 'assemble'
    originY: number;

    // Vortex / Noise state
    angle?: number;
    radius?: number;
}

export class ParticleTextObject extends KinetixObject {
    text: string = "PARTICLES";
    fontFamily: string = "Inter";
    fontSize: number = 80;
    color: string = "#ffffff";

    particleSize: number = 2;
    gap: number = 3; // Step size for sampling

    animType: ParticleAnimationType = "explode";

    // Public State for Renderer
    public particles: TextParticle[] = [];
    public lastConfig: string = "";
    public sceneRef: Scene | null = null;

    // Interaction cache (updated by Renderer or System)
    public mx = 0;
    public my = 0;

    constructor(id: string) {
        super(id, "Particle Text");
        this.width = 600;
        this.height = 150;
    }

    onAdd(scene: any) {
        this.sceneRef = scene;
    }

    // Deprecated: Logic moved to ParticleTextRenderer
    draw(ctx: CanvasRenderingContext2D, time: number) {
        // No-op: handled by RenderSystem -> ParticleTextRenderer
    }

    clone(): ParticleTextObject {
        const c = new ParticleTextObject(`ptext-${Date.now()}`);
        c.x = this.x;
        c.y = this.y;
        c.text = this.text;
        c.fontSize = this.fontSize;
        c.fontFamily = this.fontFamily;
        c.animType = this.animType;
        c.particleSize = this.particleSize;
        c.color = this.color;

        // No need to copy runtime state (particles)
        return c;
    }
}
