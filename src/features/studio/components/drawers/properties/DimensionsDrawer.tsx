import React, { useState } from "react";
import { Engine } from "@core/Core";
import { Slider } from "../../ui/InspectorUI";
import { BottomSheet } from "../../dock/BottomSheet";
import { MoveHorizontal, MoveVertical, RotateCcw, Scaling } from "lucide-react";

interface DimensionsDrawerProps {
    engine: Engine | null;
    selectedId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

type DimensionsProperty = 'width' | 'height';

export const DimensionsDrawerContent: React.FC<{ engine: Engine | null; selectedId: string | null; onClose: () => void }> = ({ engine, selectedId, onClose }) => {
    const [forceUpdate, setForceUpdate] = useState(0);
    const [activeProperty, setActiveProperty] = useState<DimensionsProperty>('width');

    const obj = selectedId && engine ? engine.scene.get(selectedId) : null;

    if (!obj) return null;

    const handleChange = (key: string, value: any) => {
        (obj as any)[key] = value;
        engine?.render();
        setForceUpdate(n => n + 1);
    };

    const properties = [
        { id: 'width', label: 'Width', icon: MoveHorizontal, min: 10, max: 1920, unit: 'px' },
        { id: 'height', label: 'Height', icon: MoveVertical, min: 10, max: 1080, unit: 'px' },
    ];

    const activeConfig = properties.find(p => p.id === activeProperty) || properties[0];
    const currentValue = (obj as any)[activeProperty];

    return (
        <div className="flex flex-col gap-6 p-6 min-h-[140px]">

            {/* 1. Compact Property Selector */}
            <div className="flex bg-slate-100 dark:bg-app-surface p-1 rounded-xl">
                {properties.map((prop) => (
                    <button
                        key={prop.id}
                        onClick={() => setActiveProperty(prop.id as DimensionsProperty)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeProperty === prop.id
                            ? "bg-white dark:bg-neutral-700 text-slate-900 dark:text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}
                    >
                        <prop.icon size={14} />
                        <span>{prop.label}</span>
                    </button>
                ))}
            </div>

            {/* 2. Slider Control */}
            <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Value</span>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-900 dark:text-white">
                            {Math.round(currentValue)}{activeConfig.unit}
                        </span>
                        <button
                            onClick={() => {
                                const defaults: Record<string, number> = { width: 200, height: 200 };
                                handleChange(activeProperty, defaults[activeProperty]);
                            }}
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
                    onChange={(v) => handleChange(activeProperty, v)}
                    compact={false}
                />
            </div>

        </div>
    );
};

export const DimensionsDrawer: React.FC<DimensionsDrawerProps> = ({ engine, selectedId, isOpen, onClose }) => {
    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Dimensions"
            variant="dock"
        >
            <DimensionsDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />
        </BottomSheet>
    );
};
