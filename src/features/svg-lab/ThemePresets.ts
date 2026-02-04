export interface ThemePreset {
    id: string;
    name: string;
    description: string;
    bgFill: string;
    logoFill: string;
    defs?: string;
    logoFilterId?: string;
    bgFilterId?: string; // Some backgrounds use filters like in v4
}

export const THEME_PRESETS: ThemePreset[] = [
    {
        id: "v1_kenichi_blue",
        name: "Kenichi Blue",
        description: "Standard primary brand identity.",
        bgFill: "url(#grad_blue)",
        logoFill: "white",
        defs: `<linearGradient id="grad_blue" x1="10%" y1="0%" x2="90%" y2="100%" gradientUnits="userSpaceOnUse"><stop stop-color="#3B82F6" /><stop offset="1" stop-color="#1D4ED8" /></linearGradient>`
    },
    {
        id: "v2_obsidian",
        name: "Obsidian",
        description: "Dark mode / Pro variant.",
        bgFill: "#09090b",
        logoFill: "url(#grad_logo)",
        defs: `<linearGradient id="grad_logo" x1="30%" y1="25%" x2="80%" y2="75%" gradientUnits="userSpaceOnUse"><stop stop-color="#60A5FA" /><stop offset="1" stop-color="#2563EB" /></linearGradient>`
    },
    {
        id: "v3_clean",
        name: "Clean",
        description: "Minimalist white on black.",
        bgFill: "#ffffff",
        logoFill: "#000000",
        logoFilterId: "shadow",
        defs: `<filter id="shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000000" flood-opacity="0.25"/></filter>`
    },
    {
        id: "v4_ember",
        name: "Ember Inset",
        description: "Pale red with inset shadow depth.",
        bgFill: "url(#grad_pale_red)",
        logoFill: "white",
        bgFilterId: "inset_shadow",
        defs: `
<linearGradient id="grad_pale_red" x1="10%" y1="0%" x2="90%" y2="100%" gradientUnits="userSpaceOnUse"><stop stop-color="#FECaca" /><stop offset="1" stop-color="#DC2626" /></linearGradient>
<filter id="inset_shadow" x="-50%" y="-50%" width="200%" height="200%">
  <feComponentTransfer in="SourceAlpha"><feFuncA type="table" tableValues="1 0" /></feComponentTransfer>
  <feGaussianBlur stdDeviation="15" /><feOffset dx="5" dy="10" result="shadow" /><feFlood flood-color="#7f1d1d" flood-opacity="0.5" />
  <feComposite in2="shadow" operator="in" /><feComposite in2="SourceAlpha" operator="in" />
  <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode /></feMerge>
</filter>`
    },
    {
        id: "v5_levitation",
        name: "High Levitation",
        description: "Floating blue mark on white.",
        bgFill: "#ffffff",
        logoFill: "#3B82F6",
        logoFilterId: "high_shadow",
        defs: `<filter id="high_shadow" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="25" stdDeviation="25" flood-color="#000000" flood-opacity="0.25"/><feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="#3B82F6" flood-opacity="0.2"/></filter>`
    },
    {
        id: "v6_midnight",
        name: "Midnight Levitation",
        description: "Floating black mark on white.",
        bgFill: "#ffffff",
        logoFill: "#000000",
        logoFilterId: "high_shadow_black",
        defs: `<filter id="high_shadow_black" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="25" stdDeviation="25" flood-color="#000000" flood-opacity="0.2"/><feDropShadow dx="0" dy="10" stdDeviation="8" flood-color="#000000" flood-opacity="0.3"/></filter>`
    }
];
