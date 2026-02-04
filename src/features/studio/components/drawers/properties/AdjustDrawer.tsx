import React, { useState, useEffect } from "react";
import { Engine } from "../../../../../engine/Core";
import { Slider } from "../../ui/InspectorUI";
import { BottomSheet } from "../../dock/BottomSheet";
import { RotateCw, RotateCcw, Layout, AlignHorizontalSpaceAround, AlignVerticalSpaceAround } from "lucide-react";

interface AdjustDrawerProps {
    engine: Engine | null;
    selectedId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

type AdjustProperty = 'rotation';

export const AdjustDrawerContent: React.FC<{ engine: Engine | null; selectedId: string | null; onClose: () => void }> = ({ engine, selectedId, onClose }) => {
    const [forceUpdate, setForceUpdate] = useState(0);
    const [activeProperty, setActiveProperty] = useState<AdjustProperty>('rotation');

    const obj = selectedId && engine ? engine.scene.get(selectedId) : null;

    if (!obj) return null;

    const handleChange = (key: string, value: any) => {
        (obj as any)[key] = value;
        engine?.render();
        setForceUpdate(n => n + 1);
    };

    const handleAlign = (type: 'horizontal' | 'vertical') => {
        if (!engine) return;
        const canvasWidth = engine.scene.width || 1920;
        const canvasHeight = engine.scene.height || 1080;

        if (type === 'horizontal') {
            const newX = (canvasWidth - obj.width) / 2;
            handleChange('x', newX);
        } else {
            const newY = (canvasHeight - obj.height) / 2;
            handleChange('y', newY);
        }
    };

    const properties = [
        { id: 'rotation', label: 'Rotation', icon: RotateCw, min: -180, max: 180, unit: '°' },
    ];

    const activeConfig = properties[0];
    const currentValue = (obj.rotation || 0);

    return (
        <div className="flex flex-col gap-6 p-6 min-h-[140px]">
            {/* Alignment */}
            {/* Alignment Row - Compact */}
            {/* Alignment Row - Slicker */}
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => handleAlign('horizontal')}
                    className="flex flex-col items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-app-surface rounded-xl hover:bg-slate-200 dark:hover:bg-app-surface-hover active:scale-95 transition-all text-slate-600 dark:text-slate-300 group"
                    title="Center Horizontally"
                >
                    <AlignHorizontalSpaceAround size={20} className="group-hover:text-accent transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 group-hover:opacity-100">Center X</span>
                </button>
                <button
                    onClick={() => handleAlign('vertical')}
                    className="flex flex-col items-center justify-center gap-2 py-3 bg-slate-100 dark:bg-app-surface rounded-xl hover:bg-slate-200 dark:hover:bg-app-surface-hover active:scale-95 transition-all text-slate-600 dark:text-slate-300 group"
                    title="Center Vertically"
                >
                    <AlignVerticalSpaceAround size={20} className="group-hover:text-accent transition-colors" />
                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-70 group-hover:opacity-100">Center Y</span>
                </button>
            </div>

            <div className="w-full h-px bg-slate-100 dark:bg-app-border" />

            {/* Slider Control (Rotation) */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                        <activeConfig.icon size={16} />
                        <span>{activeConfig.label}</span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold">
                        <span className="text-slate-900 dark:text-white">
                            {Math.round(currentValue)}{activeConfig.unit}
                        </span>
                        <button
                            onClick={() => handleChange('rotation', 0)}
                            className="text-slate-400 hover:text-indigo-600 dark:hover:text-white transition-colors"
                            title="Reset to default"
                        >
                            <RotateCcw size={12} />
                        </button>
                    </div>
                </div>

                <Slider
                    value={Math.round(currentValue)}
                    min={activeConfig.min}
                    max={activeConfig.max}
                    onChange={(v) => handleChange('rotation', v)}
                    compact={false}
                />
            </div>
        </div>
    );
};

export const AdjustDrawer: React.FC<AdjustDrawerProps> = ({ engine, selectedId, isOpen, onClose }) => {
    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Adjust"
            variant="dock"
        >
            <AdjustDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />
        </BottomSheet>
    );
};
