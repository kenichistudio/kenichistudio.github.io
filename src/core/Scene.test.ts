import { describe, it, expect, vi } from 'vitest';
import { Scene } from './Scene';
import { TextObject } from './objects/TextObject';

// Mock Canvas context
const mockCtx = {
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 100 })),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
} as unknown as CanvasRenderingContext2D;

describe('Scene', () => {
    it('should initialize with default values', () => {
        const scene = new Scene();
        expect(scene.objects).toHaveLength(0);
        expect(scene.width).toBe(1920);
        expect(scene.height).toBe(1080);
    });

    it('should add an object', () => {
        const scene = new Scene();
        const textObj = new TextObject('text-1', { text: 'Hello' });

        // Mock onAdd call
        const onAddSpy = vi.spyOn(textObj, 'onAdd');

        scene.add(textObj);

        expect(scene.objects).toHaveLength(1);
        expect(scene.get('text-1')).toBe(textObj);
        expect(onAddSpy).toHaveBeenCalledWith(scene);
    });

    it('should remove an object', () => {
        const scene = new Scene();
        const textObj = new TextObject('text-1');
        scene.add(textObj);

        const onRemoveSpy = vi.spyOn(textObj, 'onRemove');

        scene.remove('text-1');

        expect(scene.objects).toHaveLength(0);
        expect(onRemoveSpy).toHaveBeenCalledWith(scene);
    });

    it('should move objects up (bring forward)', () => {
        const scene = new Scene();
        const obj1 = new TextObject('obj-1');
        const obj2 = new TextObject('obj-2');

        scene.add(obj1);
        scene.add(obj2); // obj2 is on top (index 1)

        // Try to move obj1 up
        scene.moveUp('obj-1');

        expect(scene.objects[0]).toBe(obj2);
        expect(scene.objects[1]).toBe(obj1);
    });

    it('should move objects down (send backward)', () => {
        const scene = new Scene();
        const obj1 = new TextObject('obj-1');
        const obj2 = new TextObject('obj-2');

        scene.add(obj1);
        scene.add(obj2);

        // Try to move obj2 down
        scene.moveDown('obj-2');

        expect(scene.objects[0]).toBe(obj2);
        expect(scene.objects[1]).toBe(obj1);
    });
});
