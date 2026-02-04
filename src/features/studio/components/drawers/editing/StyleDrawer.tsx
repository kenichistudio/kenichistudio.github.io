import React, { useState } from "react";
import { Engine } from "../../../../../engine/Core";
import { TextObject } from "../../../../../engine/objects/TextObject";
import { ColorPicker, Slider, SegmentedControl } from "../../ui/InspectorUI";
import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";

interface StyleDrawerProps {
    engine: Engine | null;
    selectedId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const StyleDrawerContent: React.FC<{ engine: Engine | null; selectedId: string | null; onClose: () => void }> = ({ engine, selectedId, onClose }) => {
    const [forceUpdate, setForceUpdate] = useState(0);

    const obj = selectedId && engine ? engine.scene.get(selectedId) : null;

    if (!obj) return null;

    const handleChange = (key: string, value: any) => {
        (obj as any)[key] = value;
        engine?.render();
        setForceUpdate(n => n + 1);
    };

    const renderTextStyles = (textObj: TextObject) => (
        <div className="space-y-5">
            {/* Alignment & Colors Row */}
            <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Alignment</span>
                    <div className="flex bg-slate-100 dark:bg-app-bg rounded-lg p-1">
                        {[
                            { value: 'left', icon: AlignLeft },
                            { value: 'center', icon: AlignCenter },
                            { value: 'right', icon: AlignRight }
                        ].map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => handleChange('align', opt.value)}
                                className={`flex-1 py-1.5 rounded-md flex justify-center transition-all ${textObj.align === opt.value
                                    ? "bg-white dark:bg-neutral-700 shadow-sm text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                    }`}
                            >
                                <opt.icon size={18} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Color</span>
                    <ColorPicker
                        value={textObj.color}
                        onChange={(v) => handleChange("color", v)}
                        size="md"
                    />
                </div>
            </div>

            {/* Letter Spacing */}
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                    <span>Spacing</span>
                    <span>{Math.round(textObj.letterSpacing || 0)}px</span>
                </div>
                <Slider
                    value={textObj.letterSpacing || 0}
                    min={-5} max={50} step={1}
                    onChange={(v) => handleChange("letterSpacing", v)}
                    compact={false}
                />
            </div>

            {/* Opacity */}
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                    <span>Opacity</span>
                    <span>{Math.round((obj.opacity ?? 1) * 100)}%</span>
                </div>
                <Slider
                    value={obj.opacity ?? 1}
                    min={0} max={1} step={0.01}
                    onChange={(v) => handleChange("opacity", v)}
                    compact={false}
                />
            </div>
        </div>
    );

    const renderGenericStyles = () => (
        <div className="space-y-5">
            {/* Opacity */}
            <div className="space-y-2">
                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                    <span>Opacity</span>
                    <span>{Math.round((obj.opacity ?? 1) * 100)}%</span>
                </div>
                <Slider
                    value={obj.opacity ?? 1}
                    min={0} max={1} step={0.01}
                    onChange={(v) => handleChange("opacity", v)}
                    compact={false}
                />
            </div>

            {/* Basic Color if available */}
            {'color' in obj && (
                <div className="space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold uppercase block">Color</span>
                    <ColorPicker
                        value={(obj as any).color}
                        onChange={(v) => handleChange("color", v)}
                        size="md"
                    />
                </div>
            )}
        </div>
    );

    return (
        <div className="p-6">
            {obj instanceof TextObject ? renderTextStyles(obj) : renderGenericStyles()}
        </div>
    );
};

export const StyleDrawer: React.FC<StyleDrawerProps> = ({ engine, selectedId, isOpen, onClose }) => {

    // Preserve old behavior
    const obj = selectedId && engine ? engine.scene.get(selectedId) : null;
    if (!isOpen || !obj) return null;

    return (
        <div className="fixed bottom-16 left-0 right-0 z-[90] bg-white/95 dark:bg-app-surface/95 backdrop-blur-xl border-t border-slate-200 dark:border-app-border animate-in slide-in-from-bottom-full duration-300 shadow-xl pb-safe">
            <StyleDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />
        </div>
    );
};
