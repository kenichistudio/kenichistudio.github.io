import { useState, useEffect, useRef, useCallback } from "react";
import { Engine } from "@core/Core";
import { useStudio } from "../context/StudioContext";
import { TextObject } from "@core/objects/TextObject";
import { CodeBlockObject } from "@core/objects/CodeBlockObject";
import { ChartObject } from "@core/objects/ChartObject";
import { BarChartRaceObject } from "@core/objects/BarChartRaceObject";
import { CharacterObject } from "@core/objects/CharacterObject";
import { LogoCharacterObject } from "@core/objects/LogoCharacterObject";
import { ParticleTextObject } from "@core/objects/ParticleTextObject";

export const useObjectProperties = () => {
    const { engine, selectedId } = useStudio();
    const [forceUpdate, setForceUpdate] = useState(0);
    const [isRatioLocked, setIsRatioLocked] = useState(true);

    // Subscribe to engine updates
    useEffect(() => {
        if (!engine) return;
        const onUpdate = () => setForceUpdate(n => n + 1);
        const unsub = engine.on('objectChange', onUpdate);
        return unsub;
    }, [engine]);

    const object = selectedId && engine ? engine.scene.get(selectedId) : null;

    const updateProperty = useCallback((key: string, value: any) => {
        if (!object || !engine) return;

        // Specialized logic for dimensions with ratio lock
        if (isRatioLocked && (key === 'width' || key === 'height') && 'width' in object && 'height' in object) {
            const aspect = object.width / object.height;
            if (key === 'width') {
                (object as any).width = value;
                (object as any).height = value / aspect;
            } else {
                (object as any).height = value;
                (object as any).width = value * aspect;
            }
        } else {
            (object as any)[key] = value;
        }

        engine.render();
        setForceUpdate(n => n + 1);
    }, [object, engine, isRatioLocked]);

    const duplicateObject = useCallback(() => {
        if (!object || !engine || !object.clone) return;
        const clone = object.clone();
        clone.name = `${object.name} Copy`;
        // Offset slightly
        clone.x += 20;
        clone.y += 20;
        engine.scene.add(clone);
        engine.selectObject(clone.id);
        engine.render();
        setForceUpdate(n => n + 1);
    }, [object, engine]);

    const deleteObject = useCallback(() => {
        if (!object || !engine) return;
        engine.scene.remove(object.id);
        engine.selectObject(null);
        engine.render();
        setForceUpdate(n => n + 1);
    }, [object, engine]);

    const moveLayer = useCallback((direction: 'up' | 'down' | 'top' | 'bottom') => {
        if (!object || !engine) return;
        if (direction === 'up') engine.scene.moveUp(object.id);
        else if (direction === 'down') engine.scene.moveDown(object.id);
        // Implement top/bottom if engine supports it, else loop
        engine.render();
        setForceUpdate(n => n + 1);
    }, [object, engine]);

    return {
        object,
        updateProperty,
        duplicateObject,
        deleteObject,
        moveLayer,
        isRatioLocked,
        setIsRatioLocked,
        renderTrigger: forceUpdate // Useful if components need to react to deep changes
    };
};
