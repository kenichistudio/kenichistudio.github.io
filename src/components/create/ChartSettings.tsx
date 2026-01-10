import React from "react";
import { Engine } from "../../engine/Core";
import { ChartObject } from "../../engine/objects/ChartObject";
import { ControlRow, PropertySection, SliderInput, Toggle, IconGrid, SegmentedControl, ColorPicker, Slider } from "./InspectorUI";
import { BarChart, Square, PieChart, Activity } from "lucide-react"; // Using Activity as placeholder for Area/Scatter if needed

interface ChartSettingsProps {
    object: ChartObject;
    engine: Engine | null;
    variant: "desktop" | "mobile";
    onUpdate: () => void;
}

export const ChartSettings: React.FC<ChartSettingsProps> = ({ object: obj, engine, variant, onUpdate }) => {
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
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-2">Chart Config</span>
                <ControlRow label="Type">
                    <select
                        className="w-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg p-3 text-sm outline-none"
                        value={obj.chartType}
                        onChange={(e) => handleChange("chartType", e.target.value)}
                    >
                        <option value="bar">Bar</option>
                        <option value="line">Line</option>
                        <option value="pie">Pie</option>
                        <option value="donut">Donut</option>
                    </select>
                </ControlRow>

                {/* Simplified Mobile Controls */}
                {obj.chartType === "donut" && (
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase"><span>Hole Radius</span><span>{Math.round(obj.innerRadius * 100)}%</span></div>
                        <Slider
                            value={Math.round(obj.innerRadius * 100)}
                            min={10} max={90}
                            onChange={(v) => handleChange("innerRadius", v / 100)}
                            compact={false}
                        />
                    </div>
                )}

                <ControlRow label="Show Grid" layout="horizontal">
                    <Toggle value={obj.showGrid} onChange={(v) => handleChange("showGrid", v)} />
                </ControlRow>

                <ControlRow label="Color">
                    <ColorPicker value={obj.color} onChange={(v) => handleChange("color", v)} />
                </ControlRow>
            </div>
        );
    }

    // --- DESKTOP LAYOUT ---
    return (
        <>
            <PropertySection title="Chart Type">
                <IconGrid
                    value={obj.chartType}
                    onChange={(v) => handleChange("chartType", v)}
                    size="sm"
                    cols={2}
                    layout="horizontal"
                    options={[
                        { value: "bar", label: "Bar", icon: <BarChart size={16} /> },
                        { value: "line", label: "Line", icon: <Square size={16} /> }, // Placeholder
                        { value: "area", label: "Area", icon: <Square size={16} /> },
                        { value: "scatter", label: "Scatter", icon: <Square size={16} /> },
                        { value: "pie", label: "Pie", icon: <PieChart size={16} /> },
                        { value: "donut", label: "Donut", icon: <Square size={16} strokeWidth={2.5} /> }
                    ]}
                />
            </PropertySection>
            <PropertySection title="Chart Configuration">
                {obj.chartType === "donut" && (
                    <ControlRow label="Hole Radius">
                        <SliderInput
                            value={Math.round(obj.innerRadius * 100)}
                            min={10}
                            max={90}
                            onChange={(v) => handleChange("innerRadius", v / 100)}
                            formatValue={(v) => `${v}%`}
                        />
                    </ControlRow>
                )}
                <ControlRow label="Label Position">
                    <SegmentedControl
                        value={obj.labelPosition}
                        onChange={(v) => handleChange("labelPosition", v)}
                        options={[
                            { value: "axis", label: "Axis" },
                            { value: "top", label: "Top" },
                            { value: "center", label: "Center" },
                            { value: "none", label: "None" }
                        ]}
                    />
                </ControlRow>
                <ControlRow label="Show Grid" layout="horizontal">
                    <Toggle value={obj.showGrid} onChange={(v) => handleChange("showGrid", v)} />
                </ControlRow>
                <ControlRow label="Axis Color" layout="horizontal">
                    <ColorPicker
                        value={obj.axisColor}
                        onChange={(v) => handleChange("axisColor", v)}
                    />
                </ControlRow>
            </PropertySection>
            <PropertySection title="Data">
                <ControlRow label="Values (comma separated)">
                    <input
                        type="text"
                        className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-xs outline-none"
                        value={obj.data.join(", ")}
                        onChange={(e) => {
                            const val = e.target.value;
                            const data = val.split(",").map(s => parseFloat(s.trim())).filter(n => !isNaN(n));
                            if (data.length > 0 || val === "") handleChange("data", data);
                        }}
                    />
                </ControlRow>
                <ControlRow label="Labels (comma separated)">
                    <input
                        type="text"
                        className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-xs outline-none"
                        value={obj.labels.join(", ")}
                        onChange={(e) => handleChange("labels", e.target.value.split(",").map(s => s.trim()))}
                    />
                </ControlRow>
            </PropertySection>

            <PropertySection title="Colors">
                <ControlRow label="Color Mode" layout="horizontal">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 uppercase font-bold">Multi-color</span>
                        <Toggle value={obj.useMultiColor} onChange={(v) => handleChange("useMultiColor", v)} />
                    </div>
                </ControlRow>
                {!obj.useMultiColor ? (
                    <ControlRow label="Base Color" layout="horizontal">
                        <ColorPicker value={obj.color} onChange={(v) => handleChange("color", v)} />
                    </ControlRow>
                ) : (
                    <div className="grid grid-cols-5 gap-2">
                        {obj.colorPalette.map((color: string, i: number) => (
                            <div key={i} className="relative group">
                                <input
                                    type="color"
                                    className="w-6 h-6 rounded cursor-pointer"
                                    value={color}
                                    onChange={(e) => {
                                        const newPalette = [...obj.colorPalette];
                                        newPalette[i] = e.target.value;
                                        handleChange("colorPalette", newPalette);
                                    }}
                                />
                            </div>
                        ))}
                        <button
                            className="w-6 h-6 rounded border border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-indigo-500"
                            onClick={() => {
                                const newPalette = [...obj.colorPalette, "#888888"];
                                handleChange("colorPalette", newPalette);
                            }}
                        >
                            +
                        </button>
                    </div>
                )}
            </PropertySection>
        </>
    );
};
