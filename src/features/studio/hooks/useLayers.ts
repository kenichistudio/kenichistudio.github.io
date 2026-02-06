import { useState, useEffect, useCallback } from "react";
import { Engine } from "@core/Core";
import { useStudio } from "../context/StudioContext";
import { KinetixObject } from "@core/Object";

export const useLayers = () => {
    const { engine, selectedId } = useStudio();
    const [layers, setLayers] = useState<KinetixObject[]>([]);

    const updateLayers = useCallback(() => {
        if (!engine) return;
        const objs = (engine.scene as any).objects || [];
        setLayers([...objs].reverse());
    }, [engine]);

    useEffect(() => {
        if (!engine) return;
        updateLayers();

        // Subscribe to engine changes for reactive layers list
        const unsub = engine.on('objectChange', updateLayers);
        return unsub;
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
