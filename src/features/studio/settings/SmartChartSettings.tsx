import React, { useState } from 'react';
import { SmartChartObject, type SmartChartType, type DataPoint, type Annotation } from "../../../core/objects/SmartChartObject";
import { SMART_CHART_TEMPLATES } from "../../../core/objects/SmartChartTemplates";
import { SMART_CHART_PALETTES, SMART_CHART_FONTS, type ColorPalette } from "../../../core/objects/SmartChartDesignSystem";
import { generateMockRaceData, MOCK_RACE_COLORS, MOCK_RACE_GROUPS } from '../../../shared/utils/SmartChartUtils';
import { PropertySection, ControlRow, SliderInput, ColorPicker } from '@features/studio/components/ui/InspectorUI';
import { SmartChartDataModal } from '@features/studio/components/modals/SmartChartDataModal';

interface SmartChartSettingsProps {
    object: SmartChartObject;
    onUpdate: () => void;
}

export const SmartChartSettings: React.FC<SmartChartSettingsProps> = ({ object, onUpdate }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [, forceUpdate] = useState(0);

    // Helper to trigger update
    const update = () => {
        onUpdate();
        forceUpdate(n => n + 1);
    };

    // Auto-animate on transition
    React.useEffect(() => {
        object.onTransition = () => {
            // Run a loop for 1 second to play the transition
            let start = performance.now();
            const duration = 1000;

            const loop = (now: number) => {
                if (now - start > duration) return;
                update(); // Force engine render
                requestAnimationFrame(loop);
            };
            requestAnimationFrame(loop);
        };
        return () => { object.onTransition = undefined; };
    }, [object]);

    return (
        <div className="space-y-1">
            <PropertySection title="Smart Chart Data" defaultOpen={true}>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {SMART_CHART_TEMPLATES.map(template => (
                        <button
                            key={template.id}
                            onClick={() => {
                                // Apply Template Config
                                object.setChartType(template.config.chartType);
                                if (template.config.padding) object.padding = { ...object.padding, ...template.config.padding };
                                if (template.config.showGrid !== undefined) object.showGrid = template.config.showGrid;
                                if (template.config.showTicker !== undefined) object.showTicker = template.config.showTicker;
                                if (template.config.sorted !== undefined) object.sorted = template.config.sorted;
                                update();
                            }}
                            className={`
                                flex flex-col items-start p-2 rounded border text-xs text-left transition-all
                                ${object.chartType === template.config.chartType
                                    ? 'bg-blue-500/20 border-blue-500 text-blue-100'
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:border-white/20'}
                            `}
                        >
                            <span className="font-semibold">{template.label}</span>
                            <span className="text-[10px] opacity-70 leading-tight mt-1">{template.description}</span>
                        </button>
                    ))}
                </div>

                <ControlRow label="Data Source">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full py-2 bg-blue-600 text-white hover:bg-blue-500 rounded-lg text-xs font-bold transition-colors shadow-sm"
                    >
                        ✎ Edit Data (Spreadsheet)
                    </button>
                    <div className="text-[10px] text-slate-500 mt-1 text-center">
                        {object.data.length} items loaded
                    </div>
                </ControlRow>

                <ControlRow label="Demo Data">
                    <button
                        onClick={() => {
                            // Mock: Randomize Data
                            const newData = object.data.map(d => ({
                                ...d,
                                value: Math.floor(Math.random() * 50) + 5
                            }));
                            object.setData(newData);
                            update();
                        }}
                        className="w-full py-2 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-xs font-bold transition-colors mb-2"
                    >
                        Randomize Values
                    </button>

                    <button
                        onClick={() => {
                            // Load Mock Data with Groups
                            const raceData = generateMockRaceData();
                            const firstYear = raceData[0];
                            const newData: DataPoint[] = Object.keys(firstYear.values).map(key => ({
                                id: key,
                                label: key,
                                value: firstYear.values[key],
                                color: MOCK_RACE_COLORS[key] || "#888",
                                group: MOCK_RACE_GROUPS[key] || "Other"
                            }));

                            object.setData(newData);
                            object.setChartType("split");
                            update();
                        }}
                        className="w-full py-2 mt-2 bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 rounded-lg text-xs font-bold transition-colors"
                    >
                        Load Split/Group Demo
                    </button>

                    <button
                        onClick={() => {
                            // Load Mock Race Data
                            const raceData = generateMockRaceData();
                            object.raceData = raceData;

                            // Init with first year
                            const firstYear = raceData[0];
                            // Map Record<string, number> to DataPoint[]
                            const newData: DataPoint[] = Object.keys(firstYear.values).map(key => ({
                                id: key,
                                label: key,
                                value: firstYear.values[key],
                                color: MOCK_RACE_COLORS[key] || "#888"
                            }));

                            object.setData(newData);
                            object.setChartType("race");
                            update();
                        }}
                        className="w-full py-2 mt-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg text-xs font-bold transition-colors"
                    >
                        Load Race Demo
                    </button>
                </ControlRow>
            </PropertySection>

            <PropertySection title="Appearance" defaultOpen={true}>
                <ControlRow label="Corner Radius">
                    <SliderInput
                        value={object.cornerRadius || 0}
                        min={0} max={20} step={1}
                        onChange={(v) => {
                            object.cornerRadius = v;
                            update();
                        }}
                    />
                </ControlRow>
                <ControlRow label="Bar Gap (Bar Only)">
                    <SliderInput
                        value={object.barGap}
                        min={0} max={0.8} step={0.05}
                        onChange={(v) => {
                            object.barGap = v;
                            object.updateLayout();
                            update();
                        }}
                    />
                </ControlRow>
            </PropertySection>

            <PropertySection title="Axes & Labels" defaultOpen={true}>
                <ControlRow label="Show Grid">
                    <input
                        type="checkbox"
                        checked={object.showGrid}
                        onChange={(e) => { object.showGrid = e.target.checked; update(); }}
                    />
                </ControlRow>
                <ControlRow label="Show Axes">
                    <input
                        type="checkbox"
                        checked={object.showAxes}
                        onChange={(e) => { object.showAxes = e.target.checked; update(); }}
                    />
                </ControlRow>
                <ControlRow label="Show Labels">
                    <input
                        type="checkbox"
                        checked={object.showLabels}
                        onChange={(e) => { object.showLabels = e.target.checked; update(); }}
                    />
                </ControlRow>
                <ControlRow label="Show Values">
                    <input
                        type="checkbox"
                        checked={object.showValues}
                        onChange={(e) => { object.showValues = e.target.checked; update(); }}
                    />
                </ControlRow>
                <ControlRow label="Label Position">
                    <select
                        className="w-full bg-app-light-surface-hover dark:bg-app-surface rounded-lg p-2 text-xs outline-none"
                        value={object.labelPosition}
                        onChange={(e) => {
                            object.labelPosition = e.target.value as any;
                            update();
                        }}
                    >
                        <option value="axis">Axis (Below)</option>
                        <option value="inside">Inside Bar</option>
                        <option value="outside">Outside / Top</option>
                    </select>
                </ControlRow>
            </PropertySection>

            <PropertySection title="Design & Style" defaultOpen={false}>
                <ControlRow label="Color Palette">
                    <div className="grid grid-cols-4 gap-2">
                        {SMART_CHART_PALETTES.map((palette: ColorPalette) => (
                            <button
                                key={palette.id}
                                onClick={() => {
                                    object.applyPalette(palette.id);
                                    update();
                                }}
                                className={`
                                    h-6 rounded flex overflow-hidden border transition-all
                                    ${object.colorPaletteId === palette.id ? 'ring-2 ring-blue-500 border-transparent' : 'border-white/20 opacity-70 hover:opacity-100'}
                                `}
                                title={palette.label}
                            >
                                {palette.colors.slice(0, 4).map(c => (
                                    <div key={c} style={{ backgroundColor: c }} className="flex-1 h-full" />
                                ))}
                            </button>
                        ))}
                    </div>
                </ControlRow>
                <ControlRow label="Font Family">
                    <select
                        className="w-full bg-app-light-surface-hover dark:bg-app-surface rounded-lg p-2 text-xs outline-none"
                        value={object.fontFamily}
                        onChange={(e) => {
                            object.fontFamily = e.target.value;
                            update();
                        }}
                    >
                        {SMART_CHART_FONTS.map((f: { id: string, label: string }) => (
                            <option key={f.id} value={f.id}>{f.label}</option>
                        ))}
                    </select>
                </ControlRow>
                <ControlRow label="Grid & Axes">
                    <div className="flex gap-2 text-[10px] text-slate-400">
                        <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                            <input
                                type="checkbox"
                                checked={object.showGrid}
                                onChange={e => { object.showGrid = e.target.checked; update(); }}
                            /> Grid
                        </label>
                        <label className="flex items-center gap-1 cursor-pointer hover:text-white">
                            <input
                                type="checkbox"
                                checked={object.showAxes}
                                onChange={e => { object.showAxes = e.target.checked; update(); }}
                            /> Axes
                        </label>
                    </div>
                </ControlRow>
            </PropertySection>

            <PropertySection title="Annotations" defaultOpen={false}>
                <div className="space-y-2">
                    {object.annotations.map((note: Annotation, index) => (
                        <div key={note.id || index} className="flex gap-2 items-center bg-white/5 p-2 rounded">
                            <input
                                className="flex-1 bg-transparent border-b border-white/20 text-xs focus:outline-none focus:border-blue-500"
                                value={note.text}
                                onChange={(e) => {
                                    note.text = e.target.value;
                                    update();
                                }}
                                placeholder="Annotation text..."
                            />
                            {/* Target Selector (Simple ID match) */}
                            <select
                                className="w-16 bg-white/10 text-[10px] rounded p-1 outline-none"
                                value={note.targetNodeId || ""}
                                onChange={(e) => {
                                    note.targetNodeId = e.target.value || undefined;
                                    update();
                                }}
                            >
                                <option value="">(None)</option>
                                {object.data.map((d: DataPoint) => (
                                    <option key={d.id} value={d.id}>{d.label || d.id}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => {
                                    object.annotations = object.annotations.filter((a: Annotation) => a !== note);
                                    update();
                                }}
                                className="text-red-400 hover:text-red-300 px-1"
                            >
                                ×
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={() => {
                            object.annotations.push({
                                id: `note-${Date.now()}`,
                                text: "New Note",
                                x: 100,
                                y: 100
                            });
                            update();
                        }}
                        className="w-full py-1.5 dashed border border-white/20 text-xs hover:bg-white/5 rounded text-center text-slate-400 hover:text-slate-200 transition-colors"
                    >
                        + Add Annotation
                    </button>
                </div>
            </PropertySection>

            <PropertySection title="Motion & Export" defaultOpen={false}>
                <ControlRow label="Anim Duration (ms)">
                    <SliderInput
                        value={object.animationDuration}
                        min={0}
                        max={3000}
                        step={50}
                        onChange={(val) => { object.animationDuration = val; update(); }}
                    />
                </ControlRow>
                <ControlRow label="Stagger Delay (ms)">
                    <SliderInput
                        value={object.animationStagger}
                        min={0}
                        max={100}
                        step={1}
                        onChange={(val) => { object.animationStagger = val; update(); }}
                    />
                </ControlRow>
                <ControlRow label="Easing Style">
                    <select
                        className="w-full bg-app-light-surface-hover dark:bg-app-surface rounded-lg p-2 text-xs outline-none"
                        value={object.animationEasing}
                        onChange={(e) => {
                            object.animationEasing = e.target.value as any;
                            update();
                        }}
                    >
                        <option value="cubic">Smooth (Cubic)</option>
                        <option value="elastic">Bouncy (Elastic)</option>
                        <option value="linear">Linear</option>
                    </select>
                </ControlRow>

                <div className="pt-4 border-t border-white/10 mt-2">
                    <button
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded py-2 text-xs font-semibold flex justify-center items-center gap-2"
                        onClick={() => {
                            // Placeholder for export
                            alert("Export Feature Coming Soon! (Check Roadmap)");
                        }}
                    >
                        <span>🎬</span> Export Animation
                    </button>
                    <p className="text-[10px] text-slate-500 text-center mt-2">
                        Exports the current chart animation as MP4/WebM.
                    </p>
                </div>
            </PropertySection>

            <SmartChartDataModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    update(); // Update on close to reflect changes
                }}
                object={object}
            />
        </div >
    );
};
