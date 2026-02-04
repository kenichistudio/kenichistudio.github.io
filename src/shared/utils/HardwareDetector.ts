
export interface HardwareInfo {
    cores: number;
    memory: number; // GB
    renderer: string;
    tier: 'low' | 'medium' | 'high';
    score: number;
}

export class HardwareDetector {
    static getHardwareInfo(): HardwareInfo {
        const cores = navigator.hardwareConcurrency || 4;
        // @ts-ignore - deviceMemory is experimental
        const memory = navigator.deviceMemory || 4;

        let renderer = "Unknown";
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (gl) {
                // @ts-ignore
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                if (debugInfo) {
                    // @ts-ignore
                    renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
                }
            }
        } catch (e) {
            console.warn("Failed to detect GPU", e);
        }

        const score = this.calculateScore(cores, memory, renderer);
        let tier: 'low' | 'medium' | 'high' = 'medium';

        if (score > 80) tier = 'high';
        else if (score < 40) tier = 'low';

        return { cores, memory, renderer, tier, score };
    }

    private static calculateScore(cores: number, memory: number, renderer: string): number {
        let score = 0;

        // CPU Score (0-30)
        score += Math.min(cores, 16) * 2; // 8 cores = 16 pts

        // RAM Score (0-20)
        score += Math.min(memory, 32); // 16GB = 16 pts

        // GPU Score (0-50) using heuristics
        const lowerRenderer = renderer.toLowerCase();
        if (lowerRenderer.includes('nvidia') || lowerRenderer.includes('radeon')) {
            if (lowerRenderer.includes('rtx') || lowerRenderer.includes('gtx 1') || lowerRenderer.includes('rx 6') || lowerRenderer.includes('rx 7')) {
                score += 50;
            } else if (lowerRenderer.includes('gtx') || lowerRenderer.includes('rx')) {
                score += 30;
            } else {
                score += 20; // Older discrete
            }
        } else if (lowerRenderer.includes('apple')) {
            // M1/M2/M3 chips usually high performance
            score += 40;
        } else if (lowerRenderer.includes('intel') || lowerRenderer.includes('uhd') || lowerRenderer.includes('iris')) {
            score += 15; // Integrated
        } else {
            score += 10; // Fallback
        }

        return Math.min(score, 100);
    }
}
