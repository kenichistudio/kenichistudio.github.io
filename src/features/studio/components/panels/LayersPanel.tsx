import React from "react";
import { Engine } from "@core/Core";
import { useLayers } from "../../hooks/useLayers";
import {
    Copy,
    Trash2,
    Eye,
    EyeOff,
    Type,
    PieChart,
    Square,
    ArrowUp,
    ArrowDown,
    Lock,
    Unlock
} from "lucide-react";
import { TextObject } from "@core/objects/TextObject";
import { ChartObject } from "@core/objects/ChartObject";

import { useStudio } from "../../context/StudioContext";

interface LayersPanelProps {
}

export const LayersPanel: React.FC<LayersPanelProps> = () => {
    const { engine, selectedId } = useStudio();
    const { layers, select, toggleVisibility, toggleLock, duplicate, remove, moveUp, moveDown } = useLayers();

    if (!engine) return null;

    return (
        <div className="flex flex-col h-full relative">
            {/* Layers List */}
            <div className="flex-1 space-y-1 overflow-y-auto pb-16 custom-scrollbar">
                {layers.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                        <Square size={32} className="mb-2 opacity-20" />
                        <span className="text-xs">No layers found</span>
                    </div>
                )}

                {layers.map((layer) => {
                    const isSelected = layer.id === selectedId;
                    return (
                        <div
                            key={layer.id}
                            onClick={() => select(layer.id)}
                            className={`
                                flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border
                                ${isSelected
                                    ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-500/30 text-indigo-900 dark:text-indigo-100"
                                    : "bg-white dark:bg-app-surface border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400"
                                }
                                ${layer.locked ? "opacity-75" : ""}
                            `}
                        >
                            {/* Icon */}
                            <div className={`
                                p-1.5 rounded-md shadow-sm text-xs shrink-0 transition-colors
                                ${isSelected ? "bg-white dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}
                            `}>
                                {layer instanceof TextObject ? <Type size={14} /> :
                                    layer instanceof ChartObject ? <PieChart size={14} /> :
                                        <Square size={14} />}
                            </div>

                            {/* Name */}
                            <div className="flex-1 min-w-0 flex flex-col">
                                <span className="text-xs font-bold truncate">{layer.name}</span>
                                <span className="text-[9px] uppercase text-slate-400 tracking-wider">{(layer as any).type || 'Object'}</span>
                            </div>

                            {/* Inline Actions (Lock & Visibility) */}
                            <div className="flex items-center gap-0.5">
                                <button
                                    onClick={(e) => toggleLock(layer.id, e)}
                                    className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${layer.locked ? "text-amber-500" : "text-slate-300 hover:text-slate-500 dark:hover:text-slate-200"}`}
                                    title={layer.locked ? "Unlock" : "Lock"}
                                >
                                    {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
                                </button>

                                <button
                                    onClick={(e) => toggleVisibility(layer.id, e)}
                                    className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ${!layer.visible ? "text-slate-400" : "text-slate-300 hover:text-slate-500 dark:hover:text-slate-200"}`}
                                    title="Toggle Visibility"
                                >
                                    {layer.visible ? <Eye size={12} /> : <EyeOff size={12} />}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Bottom Actions Toolbar (Sticky) */}
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-white/90 dark:bg-app-bg/90 backdrop-blur-sm border-t border-slate-100 dark:border-app-border grid grid-cols-4 gap-2">
                <button
                    onClick={(e) => selectedId && moveUp(selectedId, e)}
                    disabled={!selectedId}
                    className="flex flex-col items-center justify-center py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-400"
                    title="Move Layer Up"
                >
                    <ArrowUp size={16} />
                </button>
                <button
                    onClick={(e) => selectedId && moveDown(selectedId, e)}
                    disabled={!selectedId}
                    className="flex flex-col items-center justify-center py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-400"
                    title="Move Layer Down"
                >
                    <ArrowDown size={16} />
                </button>
                <button
                    onClick={(e) => selectedId && duplicate(selectedId, e)}
                    disabled={!selectedId}
                    className="flex flex-col items-center justify-center py-2 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:text-indigo-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-400"
                    title="Duplicate Layer"
                >
                    <Copy size={16} />
                </button>
                <button
                    onClick={(e) => selectedId && remove(selectedId, e)}
                    disabled={!selectedId}
                    className="flex flex-col items-center justify-center py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-slate-600 dark:text-slate-400"
                    title="Delete Layer"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};
