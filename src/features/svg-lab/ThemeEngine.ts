export interface EffectLayer {
    id: 'drop_shadow' | 'inner_shadow' | 'levitation' | 'texturize';
    enabled: boolean;
    settings: {
        intensity: number;  // 0-1 (Opacity)
        elevation: number;  // 0-100 (Offset + Blur)
        color: string;
    }
}

export interface ThemeState {
    background: {
        type: 'solid' | 'gradient';
        color: string;
        gradientStart: string;
        gradientEnd: string;
        borderRadius: number; // 0 = sharp, 1 = fully rounded (relative)
        effects: EffectLayer[];
    };
    mark: {
        type: 'solid' | 'gradient';
        color: string;
        gradientStart: string;
        gradientEnd: string;
        effects: EffectLayer[];
    };
    defs: string;
}

export const ThemeEngine = {
    // Generate unique ID based on effect configuration
    getFilterId(target: 'bg' | 'mark', effects: EffectLayer[]): string {
        const active = effects.filter(e => e.enabled);
        if (active.length === 0) return '';
        // Create a signature based on settings to allow caching/uniqueness
        const sig = active.map(e => `${e.id}_${e.settings.intensity}_${e.settings.elevation}_${e.settings.color.replace('#', '')}`).join('-');
        return `filter_${target}_${sig}`;
    },

    generateDefs(state: ThemeState): string {
        let defs = "";

        // -- Gradients --
        if (state.background.type === 'gradient') {
            defs += `<linearGradient id="bg_grad" x1="10%" y1="0%" x2="90%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop stop-color="${state.background.gradientStart}" />
            <stop offset="1" stop-color="${state.background.gradientEnd}" />
        </linearGradient>`;
        }

        if (state.mark.type === 'gradient') {
            defs += `<linearGradient id="mark_grad" x1="30%" y1="25%" x2="80%" y2="75%" gradientUnits="userSpaceOnUse">
            <stop stop-color="${state.mark.gradientStart}" />
            <stop offset="1" stop-color="${state.mark.gradientEnd}" />
        </linearGradient>`;
        }

        // -- Filters --
        defs += this.generateCompositeFilter('bg', state.background.effects);
        defs += this.generateCompositeFilter('mark', state.mark.effects);

        // -- Clip Paths (Rounded Corners) --
        if (state.background.borderRadius > 0) {
            // Assuming 1024x1024 default viewbox. 
            // 512px radius = Circle.
            const r = state.background.borderRadius * 512;
            defs += `<clipPath id="bg_clip"><rect x="0" y="0" width="1024" height="1024" rx="${r}" ry="${r}" /></clipPath>`;
        }

        return defs;
    },

    // merging SVG primitive strings
    generateCompositeFilter(target: 'bg' | 'mark', effects: EffectLayer[]): string {
        const active = effects.filter(e => e.enabled);
        if (active.length === 0) return '';

        const filterId = this.getFilterId(target, effects);
        let primitives = "";
        let inputSource = "SourceGraphic";

        active.forEach((effect, index) => {
            const resultName = `layer_${index}`;
            const { intensity, elevation, color } = effect.settings;

            if (effect.id === 'drop_shadow') {
                // Grounding shadow
                const blur = elevation * 0.5;
                const dy = elevation * 0.6;
                primitives += `<feDropShadow dx="0" dy="${dy}" stdDeviation="${blur}" flood-color="${color}" flood-opacity="${intensity}" result="${resultName}"/>`;
                // Drop shadow primitives output themselves, but if we chain, we might need merge. 
                // Basic feDropShadow preserves source, so subsequent filters apply to Source+Shadow? 
                // Actually feDropShadow output includes source. So input for next is resultName.
                inputSource = resultName;
            }

            else if (effect.id === 'levitation') {
                // High soft shadow
                const blur = elevation * 1.5;
                const dy = elevation;
                primitives += `<feDropShadow dx="0" dy="${dy}" stdDeviation="${blur}" flood-color="${color}" flood-opacity="${intensity * 0.6}" result="${resultName}_soft"/>`;
                inputSource = `${resultName}_soft`;
            }

            else if (effect.id === 'inner_shadow') {
                // Complex inner shadow composition from 'custom.svg' logic
                // Using feComponentTransfer + feGaussianBlur + feOffset + feComposite
                // Note: Filter primitives are tricky to chain blindly.
                // We append this Logic block.
                primitives += `
                    <feComponentTransfer in="${inputSource}" result="${resultName}_alpha">
                        <feFuncA type="table" tableValues="1 0" />
                    </feComponentTransfer>
                    <feGaussianBlur in="${resultName}_alpha" stdDeviation="${elevation * 0.5}" result="${resultName}_blur" />
                    <feOffset in="${resultName}_blur" dx="${elevation * 0.2}" dy="${elevation * 0.4}" result="${resultName}_offset" />
                    <feFlood flood-color="${color}" flood-opacity="${intensity}" result="${resultName}_flood" />
                    <feComposite in="${resultName}_flood" in2="${resultName}_offset" operator="in" result="${resultName}_shadow" />
                    <feComposite in="${resultName}_shadow" in2="SourceAlpha" operator="in" result="${resultName}_final" />
                    <feMerge result="${resultName}">
                        <feMergeNode in="${inputSource}" />
                        <feMergeNode in="${resultName}_final" />
                    </feMerge>
                `;
                inputSource = resultName;
            }
        });

        return `<filter id="${filterId}" x="-100%" y="-100%" width="300%" height="300%">${primitives}</filter>`;
    },

    createEffect(id: EffectLayer['id'], defaults: Partial<EffectLayer['settings']> = {}): EffectLayer {
        return {
            id,
            enabled: false,
            settings: { intensity: 0.5, elevation: 10, color: '#000000', ...defaults }
        };
    },

    // Updated Hydrator
    hydrateFromPreset(presetId: string): ThemeState {
        const base: ThemeState = {
            background: { type: 'solid', color: '#ffffff', gradientStart: '#3B82F6', gradientEnd: '#1D4ED8', borderRadius: 0.2, effects: [] },
            mark: { type: 'solid', color: '#000000', gradientStart: '#60A5FA', gradientEnd: '#2563EB', effects: [] },
            defs: ''
        };

        // Populate base effects list (disabled by default)
        const standardEffects = () => [
            ThemeEngine.createEffect('drop_shadow', { elevation: 15, intensity: 0.3 }),
            ThemeEngine.createEffect('inner_shadow', { elevation: 20, intensity: 0.5, color: '#7f1d1d' }),
            ThemeEngine.createEffect('levitation', { elevation: 40, intensity: 0.3, color: '#3B82F6' })
        ];

        base.background.effects = standardEffects();
        base.mark.effects = standardEffects();

        // Apply logic
        if (presetId === 'v1_kenichi_blue') {
            base.background.type = 'gradient';
            base.mark.color = '#ffffff';
        } else if (presetId === 'v3_clean') {
            base.mark.effects[0].enabled = true; // drop_shadow
        } else if (presetId === 'v4_ember') {
            base.background.type = 'gradient';
            base.background.gradientStart = '#FECaca';
            base.background.gradientEnd = '#DC2626';
            base.background.effects[1].enabled = true; // inner_shadow
            base.mark.color = '#ffffff';
        } else if (presetId === 'v5_levitation') {
            base.mark.color = '#3B82F6';
            base.mark.effects[2].enabled = true; // levitation
        } else if (presetId === 'v6_midnight') {
            base.mark.effects[2].enabled = true;
            base.mark.effects[2].settings.color = '#000000';
            base.mark.effects[2].settings.intensity = 0.8;
            base.background.color = '#000000';
        }

        return base;
    }
};
