import React, { useState } from "react";
import { Engine } from "@core/Core";
import { Slider } from "../../ui/InspectorUI";
import { BottomSheet } from "../../dock/BottomSheet";
import { MoveHorizontal, MoveVertical, Scaling, RotateCw, Move } from "lucide-react";
import { AdjustDrawerContent } from "./AdjustDrawer";
import { PositionDrawerContent } from "./PositionDrawer";

interface TransformDrawerProps {
    engine: Engine | null;
    selectedId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

type TransformTab = 'size' | 'rotate' | 'position';

export const TransformDrawer: React.FC<TransformDrawerProps> = ({ engine, selectedId, isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<TransformTab>('size');
    const [forceUpdate, setForceUpdate] = useState(0);

    // Reset tab when opening
    React.useEffect(() => {
        if (isOpen) {
            setActiveTab('size');
        }
    }, [isOpen]);

    const obj = selectedId && engine ? engine.scene.get(selectedId) : null;
    if (!isOpen || !obj) return null;

    const handleSizeChange = (key: 'width' | 'height', value: number) => {
        if (!obj) return;
        (obj as any)[key] = value;
        engine?.render();
        setForceUpdate(n => n + 1);
    };

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Transform"
            variant="dock"
        >
            <div className="flex flex-col h-full">

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto">
                    {activeTab === 'size' && (
                        <div className="flex flex-col gap-6 px-6 pt-4 pb-6 animate-in fade-in duration-200">
                            {/* Width Slider */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <MoveHorizontal size={14} />
                                        <span>Width</span>
                                    </div>
                                    <span className="text-slate-900 dark:text-white">{Math.round(obj.width)}px</span>
                                </div>
                                <Slider
                                    value={Math.round(obj.width)}
                                    min={10} max={1920}
                                    onChange={(v) => handleSizeChange('width', v)}
                                    compact={false}
                                />
                            </div>

                            {/* Height Slider */}
                            <div className="space-y-3">
                                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
                                    <div className="flex items-center gap-2">
                                        <MoveVertical size={14} />
                                        <span>Height</span>
                                    </div>
                                    <span className="text-slate-900 dark:text-white">{Math.round(obj.height)}px</span>
                                </div>
                                <Slider
                                    value={Math.round(obj.height)}
                                    min={10} max={1080}
                                    onChange={(v) => handleSizeChange('height', v)}
                                    compact={false}
                                />
                            </div>
                        </div>
                    )}
                    {activeTab === 'rotate' && (
                        <div className="animate-in fade-in duration-200">
                            <AdjustDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />
                        </div>
                    )}
                    {activeTab === 'position' && (
                        <div className="animate-in fade-in duration-200">
                            <PositionDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />
                        </div>
                    )}
                </div>

                {/* Bottom Tab Navigation */}
                <div className="flex p-1 bg-white dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-800 shrink-0">
                    <button
                        onClick={() => setActiveTab('size')}
                        className={`flex-1 py-1 flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === 'size'
                            ? "text-accent dark:text-accent-light"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}
                    >
                        <Scaling size={20} strokeWidth={activeTab === 'size' ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-1">Size</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('rotate')}
                        className={`flex-1 py-1 flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === 'rotate'
                            ? "text-accent dark:text-accent-light"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}
                    >
                        <RotateCw size={20} strokeWidth={activeTab === 'rotate' ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-1">Rotate</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('position')}
                        className={`flex-1 py-1 flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === 'position'
                            ? "text-accent dark:text-accent-light"
                            : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                            }`}
                    >
                        <Move size={20} strokeWidth={activeTab === 'position' ? 2.5 : 2} />
                        <span className="text-[10px] font-medium mt-1">Position</span>
                    </button>
                </div>
            </div>
        </BottomSheet>
    );
};
