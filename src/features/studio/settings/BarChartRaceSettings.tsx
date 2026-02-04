import React from "react";
import { Engine } from "@core/Core";
import { BarChartRaceObject } from "@core/objects/BarChartRaceObject";
import { ControlRow, PropertySection, SliderInput, Slider } from "../components/ui/InspectorUI";

interface BarChartRaceSettingsProps {
    object: BarChartRaceObject;
    engine: Engine | null;
    onUpdate: () => void;
}

export const BarChartRaceSettings: React.FC<BarChartRaceSettingsProps> = ({ object: obj, engine, onUpdate }) => {
    if (!engine) return null;

    const handleChange = (key: string, value: any) => {
        (obj as any)[key] = value;
        engine.render();
        onUpdate();
    };

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
