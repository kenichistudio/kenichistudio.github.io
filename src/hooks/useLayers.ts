import { useState, useEffect } from "react";
import { Engine } from "../engine/Core";

export const useLayers = (engine: Engine | null, selectedId: string | null) => {
    const [forceUpdate, setForceUpdate] = useState(0);

    // Subscribe to engine changes
    useEffect(() => {
        if (!engine) return;
        const onUpdate = () => setForceUpdate(n => n + 1);

        // Ensure we subscribe to object changes
        // Note: Engine might need a specific listener for list order changes if onObjectChange isn't enough,
        // but typically onObjectChange fires on scene graph modifications in this engine.
        // We might want to hook into a more general render or scene update event if available.
        // For now, reusing the existing pattern found in PropertiesPanel.
        const originalOnChange = engine.onObjectChange;

        // Chain if something else is listening (though typically one listener per component in this simple app)
        // Ideally Engine should support multiple listeners or we use a global subscription.
        // For now, we'll just set it, but be aware of overwrites. 
        // Better pattern: Engine should emit events. 
        // Assuming the engine implementation allows us to hook in.
        // Looking at PropertiesPanel, it sets engine.onObjectChange. 
        // We should probably rely on the parent (EditorLayout) passing down updates or 
        // use a more robust event system. 
        // HOWEVER, to avoid breaking changes to Engine right now, let's rely on the fact that
        // React re-renders will propagate if EditorLayout updates.
        // But for local actions (toggle visibility), we need to force update.

        // Just exposing a refresh method might be safer if we don't want to mess with engine callbacks.
        // But let's try to be reactive.

        return () => {
            // Cleanup? 
        }
    }, [engine]);

    const layers = engine ? engine.scene.objects.slice().reverse() : [];

    const toggleVisibility = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!engine) return;
        const obj = engine.scene.get(id);
        if (obj) {
            obj.visible = !obj.visible;
            engine.render();
            setForceUpdate(n => n + 1);
        }
    };

    const toggleLock = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!engine) return;
        const obj = engine.scene.get(id);
        if (obj) {
            obj.locked = !obj.locked;
            // Deselect if locked? Maybe optionally.
            // if (obj.locked && selectedId === id) engine.deselect();
            setForceUpdate(n => n + 1);
        }
    };

    const select = (id: string) => {
        engine?.selectObject(id);
    };

    const duplicate = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!engine) return;
        const original = engine.scene.get(id);
        if (original && original.clone) {
            const clone = original.clone();
            clone.name = `${original.name} Copy`;
            engine.scene.add(clone);
            engine.render();
            setForceUpdate(n => n + 1);
        }
    };

    const remove = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (!engine) return;
        engine.scene.remove(id);
        engine.render();
        setForceUpdate(n => n + 1);
    };

    const moveUp = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        engine?.scene.moveUp(id);
        setForceUpdate(n => n + 1);
    }

    const moveDown = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        engine?.scene.moveDown(id);
        setForceUpdate(n => n + 1);
    }

    return {
        layers,
        toggleVisibility,
        toggleLock,
        select,
        duplicate,
        remove,
        moveUp,
        moveDown,
        refresh: () => setForceUpdate(n => n + 1)
    };
};
