export interface ThemeState {
    background: {
        type: 'solid' | 'gradient';
        color: string;
        gradientStart: string;
        gradientEnd: string;
        filterId?: string;
    };
    mark: {
        type: 'solid' | 'gradient';
        color: string;
        gradientStart: string;
        gradientEnd: string;
        filterId?: string;
    };
    defs: string; // Generated defs string based on state
}

export const ThemeEngine = {
    // Generate the <defs> SVG string based on current state
    generateDefs(state: ThemeState): string {
        let defs = "";

        // Background Gradient
        if (state.background.type === 'gradient') {
            defs += `<linearGradient id="bg_grad" x1="10%" y1="0%" x2="90%" y2="100%" gradientUnits="userSpaceOnUse">
            <stop stop-color="${state.background.gradientStart}" />
            <stop offset="1" stop-color="${state.background.gradientEnd}" />
        </linearGradient>`;
        }

        // Mark Gradient
        if (state.mark.type === 'gradient') {
            defs += `<linearGradient id="mark_grad" x1="30%" y1="25%" x2="80%" y2="75%" gradientUnits="userSpaceOnUse">
            <stop stop-color="${state.mark.gradientStart}" />
            <stop offset="1" stop-color="${state.mark.gradientEnd}" />
        </linearGradient>`;
        }

        // Filters (Hardcoded standard filters for now, toggled by ID)

        // 1. Drop Shadow (Video style)
        if (state.mark.filterId === 'shadow' || state.background.filterId === 'shadow') {
            defs += `<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000000" flood-opacity="0.25"/></filter>`;
        }

        // 2. Inset Shadow (Ember style)
        if (state.background.filterId === 'inset_shadow') {
            defs += `<filter id="inset_shadow" x="-50%" y="-50%" width="200%" height="200%">
  <feComponentTransfer in="SourceAlpha"><feFuncA type="table" tableValues="1 0" /></feComponentTransfer>
  <feGaussianBlur stdDeviation="15" /><feOffset dx="5" dy="10" result="shadow" /><feFlood flood-color="#7f1d1d" flood-opacity="0.5" />
  <feComposite in2="shadow" operator="in" /><feComposite in2="SourceAlpha" operator="in" />
  <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode /></feMerge>
</filter>`;
        }

        // 3. High Levitation (Blue/Black)
        if (state.mark.filterId?.includes('high_shadow')) {
            const shadowColor = state.mark.type === 'solid' && state.mark.color === '#000000' ? '#000000' : '#3B82F6';
            const opacity = shadowColor === '#000000' ? '0.3' : '0.2';
            defs += `<filter id="${state.mark.filterId}" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="25" stdDeviation="25" flood-color="#000000" flood-opacity="0.25"/><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="${shadowColor}" flood-opacity="${opacity}"/></filter>`;
        }

        return defs;
    },

    // Convert legacy ID-based preset to full state object
    hydrateFromPreset(presetId: string): ThemeState {
        // Defaults
        const base: ThemeState = {
            background: { type: 'solid', color: '#ffffff', gradientStart: '#3B82F6', gradientEnd: '#1D4ED8' },
            mark: { type: 'solid', color: '#000000', gradientStart: '#60A5FA', gradientEnd: '#2563EB' },
            defs: ''
        };

        if (presetId === 'v1_kenichi_blue') {
            base.background.type = 'gradient';
            base.mark.color = '#ffffff';
        } else if (presetId === 'v2_obsidian') {
            base.background.color = '#09090b';
            base.mark.type = 'gradient';
        } else if (presetId === 'v3_clean') {
            base.mark.filterId = 'shadow';
        } else if (presetId === 'v4_ember') {
            base.background.type = 'gradient';
            base.background.gradientStart = '#FECaca';
            base.background.gradientEnd = '#DC2626';
            base.background.filterId = 'inset_shadow';
            base.mark.color = '#ffffff';
        } else if (presetId === 'v5_levitation') {
            base.mark.color = '#3B82F6';
            base.mark.filterId = 'high_shadow';
        } else if (presetId === 'v6_midnight') {
            base.mark.filterId = 'high_shadow_black';
        }

        return base;
    }
};
