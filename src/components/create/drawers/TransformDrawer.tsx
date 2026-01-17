import React, { useState } from "react";
import { Engine } from "../../../engine/Core";
import { Slider, SegmentedControl } from "../ui/InspectorUI";
import { BottomSheet } from "../panels/BottomSheet";
import { MoveHorizontal, MoveVertical, RotateCcw, Scaling, RotateCw, Move, AlignHorizontalSpaceAround, AlignVerticalSpaceAround, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { DimensionsDrawerContent } from "./DimensionsDrawer";
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

    // Reset tab when opening
    React.useEffect(() => {
        if (isOpen) {
            setActiveTab('size');
        }
    }, [isOpen]);

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Transform"
            variant="dock"
        >
            <div className="flex flex-col h-full">

                {/* Tab Navigation */}
                <div className="px-6 pt-2 pb-4">
                    <div className="bg-slate-100 dark:bg-app-bg p-1 rounded-xl flex">
                        <button
                            onClick={() => setActiveTab('size')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'size'
                                    ? "bg-white dark:bg-neutral-700 shadow-sm text-slate-900 dark:text-white"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                }`}
                        >
                            <Scaling size={14} />
                            <span>Size</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('rotate')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'rotate'
                                    ? "bg-white dark:bg-neutral-700 shadow-sm text-slate-900 dark:text-white"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                }`}
                        >
                            <RotateCw size={14} />
                            <span>Rotate</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('position')}
                            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'position'
                                    ? "bg-white dark:bg-neutral-700 shadow-sm text-slate-900 dark:text-white"
                                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                }`}
                        >
                            <Move size={14} />
                            <span>Position</span>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'size' && (
                        <DimensionsDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />
                    )}
                    {activeTab === 'rotate' && (
                        <AdjustDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />
                    )}
                    {activeTab === 'position' && (
                        <PositionDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />
                    )}
                </div>
            </div>
        </BottomSheet>
    );
};
