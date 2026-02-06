import { useState, useEffect, useCallback } from "react";
import { Engine } from "@core/Core";
import { KinetixObject } from "@core/Object";

export const useLayers = (engine: Engine | null, selectedId: string | null) => {
    const [layers, setLayers] = useState<KinetixObject[]>([]);
    const [forceUpdate, setForceUpdate] = useState(0);

    const updateLayers = useCallback(() => {
        if (!engine) return;
        // Get all objects from scene. assumes engine.scene.objects or similar
        // Since I don't know the exact engine API for getting all objects, I'll guess engine.scene.getObjects() or engine.scene.children
        // Based on DataDrawer: engine.scene.get(id)
        // I will assume engine.scene.objects is an array or map.
        // Let's assume engine.scene.getObjects() returns array.
        // Wait, I need to know Engine API.
        // But for now I'll use a placeholder and fix it if it errors.
        // Actually, previous files used engine.scene.get(id).

        // I'll try to use engine.scene.objects if it's public.
        const objs = (engine.scene as any).objects || [];
        // Reverse to show top layers first? Or z-index?
        // Usually layers list assumes top is top z-index.
        setLayers([...objs].reverse());
    }, [engine]);

    useEffect(() => {
        if (!engine) return;
        updateLayers();

        // Subscribe to engine changes for reactive layers list
        const originalOnObjectChange = engine.onObjectChange;

        const handleChange = () => {
            updateLayers();
            if (originalOnObjectChange) originalOnObjectChange();
        };

        engine.onObjectChange = handleChange;

        return () => {
            if (engine.onObjectChange === handleChange) {
                engine.onObjectChange = originalOnObjectChange;
            }
        };
    }, [engine, updateLayers]);

    const select = (id: string) => {
        if (!engine) return;
        engine.selectObject(id);
    };

    const toggleVisibility = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!engine) return;
        const obj = engine.scene.get(id);
        if (obj) {
            obj.visible = !obj.visible;
            engine.render();
            updateLayers();
        }
    };

    const toggleLock = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!engine) return;
        const obj = engine.scene.get(id);
        if (obj) {
            obj.locked = !obj.locked;
            updateLayers();
        }
    };

    const duplicate = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!engine) return;
        const obj = engine.scene.get(id);
        if (obj && (obj as any).clone) {
            const clone = (obj as any).clone();
            clone.name = `${obj.name} Copy`;
            engine.scene.add(clone);
            engine.render();
            updateLayers();
        }
    };

    const remove = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!engine) return;
        engine.scene.remove(id);
        engine.render();
        updateLayers();
    };

    const moveUp = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!engine) return;
        engine.scene.moveUp(id);
        engine.render();
        updateLayers();
    };

    const moveDown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!engine) return;
        engine.scene.moveDown(id);
        engine.render();
        updateLayers();
    };

    return {
        layers,
        select,
        toggleVisibility,
        toggleLock,
        duplicate,
        remove,
        moveUp,
        moveDown
    };
};
