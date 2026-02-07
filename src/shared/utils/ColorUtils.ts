/**
 * Linearly interpolates between two hex colors.
 * @param startHex Start color in hex (e.g., "#000000" or "#000")
 * @param endHex End color in hex
 * @param factor Interpolation factor (0-1)
 * @returns Interpolated hex color
 */
export function lerpColor(startHex: string, endHex: string, factor: number): string {
    const c1 = parseHex(startHex);
    const c2 = parseHex(endHex);

    const r = Math.round(c1.r + (c2.r - c1.r) * factor);
    const g = Math.round(c1.g + (c2.g - c1.g) * factor);
    const b = Math.round(c1.b + (c2.b - c1.b) * factor);

    return rgbToHex(r, g, b);
}

function parseHex(hex: string) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    const num = parseInt(hex, 16);
    return {
        r: (num >> 16) & 255,
        g: (num >> 8) & 255,
        b: num & 255
    };
}

function rgbToHex(r: number, g: number, b: number): string {
    // Clamp values
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
