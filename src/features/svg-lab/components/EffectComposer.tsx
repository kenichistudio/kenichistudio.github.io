import React from "react";
import { ThemeEngine, type EffectLayer } from "../ThemeEngine";
import { Settings2 } from "lucide-react";

interface EffectComposerProps {
    label: string;
    effects: EffectLayer[];
    onChange: (newEffects: EffectLayer[]) => void;
}

export const EffectComposer: React.FC<EffectComposerProps> = ({ label, effects, onChange }) => {

    const toggleEffect = (index: number) => {
        const next = [...effects];
        next[index] = { ...next[index], enabled: !next[index].enabled };
        onChange(next);
    };

    const updateSetting = (index: number, key: keyof EffectLayer['settings'], val: any) => {
        const next = [...effects];
        next[index] = { ...next[index], settings: { ...next[index].settings, [key]: val } };
        onChange(next);
    };

    return (
        <div className="space-y-3">
            <span className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                <Settings2 size={12} /> {label}
            </span>

            <div className="space-y-2">
                {effects.map((effect, idx) => (
                    <div key={effect.id} className={`rounded-lg border transition-all ${effect.enabled ? "bg-white dark:bg-slate-800 border-accent/50 shadow-sm" : "border-transparent bg-slate-50 dark:bg-transparent hover:bg-slate-100 dark:hover:bg-slate-900"}`}>

                        {/* Header / Toggle */}
                        <div
                            className="flex items-center gap-3 p-3 cursor-pointer"
                            onClick={() => toggleEffect(idx)}
                        >
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${effect.enabled ? "bg-accent border-accent" : "border-slate-300 dark:border-slate-600"}`}>
                                {effect.enabled && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </div>
                            <span className={`text-xs font-bold uppercase flex-1 ${effect.enabled ? "text-slate-900 dark:text-white" : "text-slate-500"}`}>
                                {effect.id.replace('_', ' ')}
                            </span>
                        </div>

                        {/* Controls (Only if enabled) */}
                        {effect.enabled && (
                            <div className="px-3 pb-3 pt-0 space-y-3 animate-in slide-in-from-top-2 duration-200">
                                <div className="border-t border-slate-100 dark:border-slate-700 my-2"></div>

                                {/* Sliders Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Intensity */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <label className="text-[10px] text-slate-400 font-bold uppercase">Opacity</label>
                                            <span className="text-[10px] font-mono opacity-50">{Math.round(effect.settings.intensity * 100)}%</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="1" step="0.05"
                                            value={effect.settings.intensity}
                                            onChange={(e) => updateSetting(idx, 'intensity', parseFloat(e.target.value))}
                                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
                                        />
                                    </div>

                                    {/* Elevation (Offset/Blur) */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between">
                                            <label className="text-[10px] text-slate-400 font-bold uppercase">Size</label>
                                            <span className="text-[10px] font-mono opacity-50">{Math.round(effect.settings.elevation)}px</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="50" step="1"
                                            value={effect.settings.elevation}
                                            onChange={(e) => updateSetting(idx, 'elevation', parseFloat(e.target.value))}
                                            className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-accent"
                                        />
                                    </div>
                                </div>

                                {/* Tint Color */}
                                <div className="flex items-center gap-2 pt-1">
                                    <label className="text-[10px] text-slate-400 font-bold uppercase">Tint</label>
                                    <div className="flex-1 flex items-center gap-2 bg-slate-50 dark:bg-black/20 rounded p-1">
                                        <input
                                            type="color"
                                            value={effect.settings.color}
                                            onChange={(e) => updateSetting(idx, 'color', e.target.value)}
                                            className="w-4 h-4 rounded cursor-pointer border-0 p-0 bg-transparent"
                                        />
                                        <span className="text-[10px] font-mono opacity-50 uppercase">{effect.settings.color}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
