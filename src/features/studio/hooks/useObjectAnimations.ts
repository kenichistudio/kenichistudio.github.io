import { useState, useCallback } from 'react';
import { Engine } from '@core/Core';
import { Ban, Zap, ArrowUp, ArrowDown, Maximize, Minimize, Keyboard, ArrowLeft, ArrowRight } from 'lucide-react';
import { TextObject } from '@core/objects/TextObject';

export type AnimationType = 'enter' | 'exit';

export interface AnimationDefinition {
    id: string;
    label: string;
    icon: any;
}

export const ENTER_ANIMATIONS: AnimationDefinition[] = [
    { id: 'none', label: 'None', icon: Ban },
    { id: 'fadeIn', label: 'Fade In', icon: Zap },
    { id: 'slideUp', label: 'Slide Up', icon: ArrowUp },
    { id: 'slideLeft', label: 'Slide Left', icon: ArrowLeft },
    { id: 'slideRight', label: 'Slide Right', icon: ArrowRight },
    { id: 'scaleIn', label: 'Pop In', icon: Maximize },
    { id: 'typewriter', label: 'Typewriter', icon: Keyboard },
];

export const EXIT_ANIMATIONS: AnimationDefinition[] = [
    { id: 'none', label: 'None', icon: Ban },
    { id: 'fadeOut', label: 'Fade Out', icon: Zap },
    { id: 'slideDown', label: 'Slide Down', icon: ArrowDown },
    { id: 'scaleOut', label: 'Pop Out', icon: Minimize },
];

export const useObjectAnimations = (engine: Engine | null, selectedId: string | null) => {
    const [forceUpdate, setForceUpdate] = useState(0);

    const object = selectedId && engine ? engine.scene.get(selectedId) : null;

    const updateAnimation = useCallback((type: AnimationType, updates: Partial<any>) => {
        if (!object || !engine) return;

        const targetProp = type === 'enter' ? 'enterAnimation' : 'exitAnimation';

        // Ensure animation object exists with defaults
        if (!object[targetProp]) {
            object[targetProp] = { type: 'none', duration: 1000, delay: 0 };
        }

        Object.assign(object[targetProp], updates);
        engine.render();
        setForceUpdate(n => n + 1);
    }, [object, engine]);

    const getAnimation = useCallback((type: AnimationType) => {
        if (!object) return null;
        return type === 'enter' ? object.enterAnimation : object.exitAnimation;
    }, [object]);

    // Derived helpers
    const availableEnterAnimations = (object instanceof TextObject)
        ? ENTER_ANIMATIONS
        : ENTER_ANIMATIONS.filter(a => a.id !== 'typewriter');

    return {
        object,
        updateAnimation,
        getAnimation,
        availableEnterAnimations,
        availableExitAnimations: EXIT_ANIMATIONS,
        // Helper to force re-render if needed
        renderTrigger: forceUpdate
    };
};
