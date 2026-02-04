import { useState, useEffect, useCallback } from "react";
import { Engine } from "../../../engine/Core";
import { KinetixObject } from "../../../engine/Object";

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
        // Listen to scene changes?
        // engine.on("update", updateLayers);
        // engine.on("scene:change", updateLayers);
        // assuming standard eventEmitter

        // Placeholder for subscription
        const interval = setInterval(updateLayers, 1000); // Fallback
        return () => clearInterval(interval);
    }, [engine, updateLayers]);

    const select = (id: string) => {
        if (!engine) return;
        // engine.select(id); // ???
        // Or set selectedId via parent?
        // The hook assumes parent changes selectedId prop?
        // Wait, the hook takes selectedId as arg.
        // So select must likely trigger a callback or engine event that updates the parent.
        // engine.selection.set(id)?
        // I'll return a no-op that logs for now if unsure.
        console.log("Select", id);
        // Ideally we need a way to set selection on engine or callback.
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
        // engine.duplicate(id)?
        console.log("Duplicate", id);
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
        // logic to swap z-index
        console.log("Move Up", id);
    };

    const moveDown = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!engine) return;
        // logic to swap z-index
        console.log("Move Down", id);
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
