import React from "react";
import { Engine } from "../../engine/Core";
import { BarChartRaceObject } from "../../engine/objects/BarChartRaceObject";
import { ControlRow, PropertySection, SliderInput, Slider } from "./InspectorUI";

interface BarChartRaceSettingsProps {
    object: BarChartRaceObject;
    engine: Engine | null;
    variant: "desktop" | "mobile";
    onUpdate: () => void;
}

export const BarChartRaceSettings: React.FC<BarChartRaceSettingsProps> = ({ object: obj, engine, variant, onUpdate }) => {
    if (!engine) return null;

    const handleChange = (key: string, value: any) => {
        (obj as any)[key] = value;
        engine.render();
        onUpdate();
    };

    // --- MOBILE LAYOUT ---
    if (variant === "mobile") {
        return (
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-4">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-2">Race Config</span>

                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase"><span>Duration</span><span>{(obj.duration / 1000).toFixed(1)}s</span></div>
                    <Slider
                        value={obj.duration}
                        min={1000} max={30000} step={500}
                        onChange={(v) => handleChange("duration", v)}
                        compact={false}
                    />
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase"><span>Bar Height</span><span>{obj.barHeight}px</span></div>
                    <Slider
                        value={obj.barHeight}
                        min={20} max={100}
                        onChange={(v) => handleChange("barHeight", v)}
                        compact={false}
                    />
                </div>
                <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase"><span>Gap</span><span>{obj.gap}px</span></div>
                    <Slider
                        value={obj.gap}
                        min={0} max={50}
                        onChange={(v) => handleChange("gap", v)}
                        compact={false}
                    />
                </div>
            </div>
        );
    }

    // --- DESKTOP LAYOUT ---
    return (
        <PropertySection title="Race Configuration">
            <ControlRow label="Duration (Speed)">
                <SliderInput
                    value={obj.duration}
                    min={1000}
                    max={30000}
                    step={500}
                    onChange={(v) => handleChange("duration", v)}
                    formatValue={(v) => `${(v / 1000).toFixed(1)}s`}
                />
                <div className="flex justify-between px-1 mt-1">
                    <span className="text-[10px] text-slate-400">Fast (1s)</span>
                    <span className="text-[10px] text-slate-400">Slow (30s)</span>
                </div>
            </ControlRow>
            <ControlRow label="Bar Height">
                <SliderInput
                    value={obj.barHeight}
                    min={20}
                    max={100}
                    onChange={(v) => handleChange("barHeight", v)}
                    formatValue={(v) => `${v}px`}
                />
            </ControlRow>
            <ControlRow label="Gap">
                <SliderInput
                    value={obj.gap}
                    min={0}
                    max={50}
                    onChange={(v) => handleChange("gap", v)}
                    formatValue={(v) => `${v}px`}
                />
            </ControlRow>
        </PropertySection>
    );
};
