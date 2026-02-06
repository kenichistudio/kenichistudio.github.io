import React from "react";
import { Engine } from "@core/Core";
import { BarChartRaceObject } from "@core/objects/BarChartRaceObject";
import { ControlRow, PropertySection, SliderInput, Slider, ColorPicker } from "../components/ui/InspectorUI";

import { useStudio } from "../context/StudioContext";

interface BarChartRaceSettingsProps {
    object: BarChartRaceObject;
    onUpdate: () => void;
}

export const BarChartRaceSettings: React.FC<BarChartRaceSettingsProps> = ({ object: obj, onUpdate }) => {
    const { engine } = useStudio();
    const [_, setForceUpdate] = React.useState(0);

    if (!engine) return null;

    const handleChange = (key: string, value: any) => {
        (obj as any)[key] = value;
        engine.render();
        setForceUpdate(n => n + 1);
        onUpdate();
    };

    return (
        <>
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

            <PropertySection title="Typography & Colors">
                <ControlRow label="Font Family">
                    <select
                        className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-xs outline-none"
                        value={obj.fontFamily}
                        onChange={(e) => handleChange("fontFamily", e.target.value)}
                    >
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Impact">Impact</option>
                        <option value="Times New Roman">Times New Roman</option>
                    </select>
                </ControlRow>
                <ControlRow label="Base Font Size">
                    <SliderInput
                        value={obj.fontSize}
                        min={8}
                        max={48}
                        onChange={(v) => handleChange("fontSize", v)}
                        formatValue={(v) => `${v}px`}
                    />
                </ControlRow>
                <ControlRow label="Label Color" layout="horizontal">
                    <ColorPicker
                        value={obj.labelColor}
                        onChange={(v) => handleChange("labelColor", v)}
                    />
                </ControlRow>
                <ControlRow label="Value Color" layout="horizontal">
                    <ColorPicker
                        value={obj.valueColor}
                        onChange={(v) => handleChange("valueColor", v)}
                    />
                </ControlRow>
            </PropertySection>

            <PropertySection title="Data & Palette">
                <div className="space-y-4">
                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Dataset (JSON)</div>
                    <textarea
                        className="w-full h-32 bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-[10px] font-mono outline-none resize-y"
                        value={JSON.stringify(obj.data, null, 2)}
                        onChange={(e) => {
                            try {
                                const parsed = JSON.parse(e.target.value);
                                handleChange("data", parsed);
                            } catch (err) {
                                // Invalid JSON, ignore or show error state
                            }
                        }}
                    />

                    <div className="text-[10px] text-slate-500 font-bold uppercase mb-2">Entity Colors</div>
                    <div className="grid grid-cols-2 gap-2">
                        {Array.from(new Set(obj.data.flatMap(d => Object.keys(d.values)))).map((key) => (
                            <div key={key} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-lg">
                                <span className="text-[10px] truncate max-w-[80px]" title={key}>{key}</span>
                                <ColorPicker
                                    value={obj.colors[key] || "#999999"}
                                    onChange={(v) => {
                                        const newColors = { ...obj.colors, [key]: v };
                                        handleChange("colors", newColors);
                                    }}
                                    size="sm"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </PropertySection>
        </>
    );
};
