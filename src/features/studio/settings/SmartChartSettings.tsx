import React, { useState } from 'react';
import { SmartChartObject, type SmartChartType, type DataPoint } from '@core/objects/SmartChartObject';
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
                <ControlRow label="Chart Type">
                    <select
                        className="w-full bg-app-light-surface-hover dark:bg-app-surface rounded-lg p-2 text-xs outline-none"
                        value={object.chartType}
                        onChange={(e) => {
                            object.setChartType(e.target.value as SmartChartType);
                            update();
                        }}
                    >
                        <option value="bar">Bar Chart</option>
                        <option value="scatter">Scatter Plot</option>
                        <option value="race">Bar Chart Race</option>
                        <option value="split">Split Clusters</option>
                    </select>
                </ControlRow>

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
