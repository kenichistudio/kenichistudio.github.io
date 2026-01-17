import React from "react";
import { Engine } from "../../../engine/Core";
import { BottomSheet } from "../panels/BottomSheet";
import { useLayers } from "../../../hooks/useLayers";
import { Copy, Trash2, Eye, EyeOff, Type, PieChart, Square, ArrowUp, ArrowDown, ChevronUp, ChevronDown } from "lucide-react";
import { TextObject } from "../../../engine/objects/TextObject";
import { ChartObject } from "../../../engine/objects/ChartObject";

interface LayersDrawerProps {
    engine: Engine | null;
    selectedId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const LayersDrawer: React.FC<LayersDrawerProps> = ({ engine, selectedId, isOpen, onClose }) => {
    const { layers, select, toggleVisibility, duplicate, remove, moveUp, moveDown } = useLayers(engine, selectedId);
    const [snap, setSnap] = React.useState<number>(0.5);

    if (!engine) return null;

    const toggleSnap = () => {
        setSnap(prev => prev === 0.5 ? 0.9 : 0.5);
    };

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            initialSnap={0.5}
            snaps={[0.5, 0.9]}
            zIndex={110}
            manualSnap={snap}
        >
            <div
                className="flex flex-col bg-white dark:bg-app-surface relative transition-[height] duration-300 ease-in-out"
                style={{ height: `${snap * 100}%` }}
            >

                {/* Custom Header (Matches ChartsDrawer style) */}
                <div className="relative flex items-center justify-center py-2 shrink-0">
                    {/* Toggle Icon (Absolute Right) */}
                    <button
                        onClick={toggleSnap}
                        className="absolute right-4 top-2 p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        {snap > 0.6 ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>

                    {/* Title (Optional, keeping it minimal) */}
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400 opacity-0">Layers</span>
                </div>


                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pb-4 px-4 custom-scrollbar">

                    {/* List Header Row (Matches ChartDataDrawer) */}
                    <div className="flex px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 mt-2">
                        <div className="w-8 shrink-0 text-center">Icon</div>
                        <div className="flex-1 px-2">Name</div>
                        <div className="w-8 text-center">Vis</div>
                    </div>

                    {layers.length === 0 && (
                        <div className="flex flex-col items-center justify-center p-12 text-slate-300 dark:text-slate-700">
                            <Square size={48} className="mb-4 opacity-20" />
                            <p className="text-sm font-medium">No layers yet</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        {layers.map((layer) => {
                            const isSelected = layer.id === selectedId;
                            return (
                                <div
                                    key={layer.id}
                                    onClick={() => select(layer.id)}
                                    className={`
                                    flex items-center gap-2 p-2 rounded-xl border transition-all touch-manipulation relative overflow-hidden group
                                    ${isSelected
                                            ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500/50"
                                            : "bg-slate-50 dark:bg-app-bg border-slate-100 dark:border-app-border hover:border-slate-300 dark:hover:border-slate-600"
                                        }
                                `}
                                >
                                    {/* Selection Indicator */}
                                    {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500" />}

                                    {/* Icon Column */}
                                    <div className={`
                                    w-8 h-8 flex items-center justify-center rounded-lg shrink-0 transition-colors
                                    ${isSelected ? "bg-white dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" : "bg-white dark:bg-app-surface text-slate-400 dark:text-slate-500"}
                                `}>
                                        {layer instanceof TextObject ? <Type size={16} /> :
                                            layer instanceof ChartObject ? <PieChart size={16} /> :
                                                <Square size={16} />}
                                    </div>

                                    {/* Name Column */}
                                    <div className="flex-1 min-w-0 px-2">
                                        <h4 className={`text-sm font-bold truncate ${isSelected ? "text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-300"}`}>
                                            {layer.name}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{(layer as any).type}</span>
                                        </div>
                                    </div>

                                    {/* Visibility Column */}
                                    <button
                                        onClick={(e) => toggleVisibility(layer.id, e)}
                                        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-colors ${!layer.visible ? "text-slate-300" : "text-slate-300 hover:text-slate-500 dark:hover:text-slate-200"}`}
                                    >
                                        {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Actions Bar (Sticky) */}
                <div className="sticky bottom-0 z-10 flex p-1 bg-white dark:bg-app-surface border-t border-slate-100 dark:border-app-border shrink-0">
                    <button
                        onClick={(e) => selectedId && moveUp(selectedId, e)}
                        disabled={!selectedId}
                        className={`flex-1 py-2 flex flex-col items-center justify-center rounded-xl transition-all ${selectedId
                            ? "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white active:scale-95 hover:bg-slate-50 dark:hover:bg-white/5"
                            : "text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed"}`}
                    >
                        <ArrowUp size={18} />
                        <span className="text-[9px] font-bold mt-1 uppercase tracking-wide">Up</span>
                    </button>

                    <button
                        onClick={(e) => selectedId && moveDown(selectedId, e)}
                        disabled={!selectedId}
                        className={`flex-1 py-2 flex flex-col items-center justify-center rounded-xl transition-all ${selectedId
                            ? "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white active:scale-95 hover:bg-slate-50 dark:hover:bg-white/5"
                            : "text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed"}`}
                    >
                        <ArrowDown size={18} />
                        <span className="text-[9px] font-bold mt-1 uppercase tracking-wide">Down</span>
                    </button>

                    <button
                        onClick={(e) => selectedId && duplicate(selectedId, e)}
                        disabled={!selectedId}
                        className={`flex-1 py-2 flex flex-col items-center justify-center rounded-xl transition-all ${selectedId
                            ? "text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 active:scale-95 hover:bg-indigo-50 dark:hover:bg-indigo-500/10"
                            : "text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed"}`}
                    >
                        <Copy size={18} />
                        <span className="text-[9px] font-bold mt-1 uppercase tracking-wide">Clone</span>
                    </button>

                    <button
                        onClick={(e) => selectedId && remove(selectedId, e)}
                        disabled={!selectedId}
                        className={`flex-1 py-2 flex flex-col items-center justify-center rounded-xl transition-all ${selectedId
                            ? "text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 active:scale-95 hover:bg-red-50 dark:hover:bg-red-500/10"
                            : "text-slate-300 dark:text-slate-700 opacity-50 cursor-not-allowed"}`}
                    >
                        <Trash2 size={18} />
                        <span className="text-[9px] font-bold mt-1 uppercase tracking-wide">Delete</span>
                    </button>
                </div>

            </div>
        </BottomSheet>
    );
};
