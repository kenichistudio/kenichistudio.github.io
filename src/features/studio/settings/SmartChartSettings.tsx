import React from 'react';
import { SmartChartObject, type SmartChartType } from '@core/objects/SmartChartObject';
import { PropertySection, ControlRow, SliderInput, ColorPicker } from '@features/studio/components/ui/InspectorUI';

interface SmartChartSettingsProps {
    object: SmartChartObject;
    onUpdate: () => void;
}

export const SmartChartSettings: React.FC<SmartChartSettingsProps> = ({ object, onUpdate }) => {

    // Helper to trigger update
    const update = () => {
        // Trigger generic update (maybe re-render scene or just object properties)
        onUpdate();
        // Since SmartChart is "smart", changing properties usually requires re-layout
        // The object methods handle that state, but we need to tell React/Engine to redraw
    };

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
                    </select>
                </ControlRow>

                <ControlRow label="Data Points">
                    <div className="text-xs text-slate-500 mb-2">
                        {object.data.length} items loaded
                    </div>
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
                        className="w-full py-2 bg-accent/10 text-accent hover:bg-accent/20 rounded-lg text-xs font-bold transition-colors"
                    >
                        Randomize Values
                    </button>
                </ControlRow>
            </PropertySection>

            <PropertySection title="Appearance">
                <ControlRow label="Bar Gap (Bar Only)">
                    <SliderInput
                        value={object.barGap}
                        min={0} max={0.8} step={0.05}
                        onChange={(v) => {
                            object.barGap = v;
                            // Re-layout needed if gap changes
                            object.setChartType(object.chartType);
                            update();
                        }}
                    />
                </ControlRow>
            </PropertySection>
        </div>
    );
};
