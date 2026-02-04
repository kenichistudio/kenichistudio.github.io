import React, { useState, useEffect } from "react";
import { Engine } from "@core/Core";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw, Move } from "lucide-react";
import { BottomSheet } from "../../dock/BottomSheet";

interface PositionDrawerProps {
    engine: Engine | null;
    selectedId: string | null;
    onClose: () => void;
}

export const PositionDrawerContent: React.FC<PositionDrawerProps> = ({ engine, selectedId, onClose }) => {
    const [forceUpdate, setForceUpdate] = useState(0);

    const obj = selectedId && engine ? engine.scene.get(selectedId) : null;

    if (!obj) return null;

    const handleChange = (key: string, value: any) => {
        (obj as any)[key] = value;
        engine?.render();
        setForceUpdate(n => n + 1);
    };

    const handleNudge = (axis: 'x' | 'y', delta: number) => {
        const current = (obj as any)[axis] || 0;
        handleChange(axis, current + delta);
    };

    return (
        <div className="flex flex-col gap-6 p-6 min-h-[200px]">
            {/* Header / Info */}
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                <Move size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Position</span>
            </div>

            {/* X / Y Coordinates - Slicker */}
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-100 dark:bg-app-surface p-3 rounded-xl flex items-center justify-between group hover:ring-1 hover:ring-indigo-500/50 transition-all">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors">X</span>
                    <input
                        type="number"
                        value={Math.round(obj.x)}
                        onChange={(e) => handleChange('x', Number(e.target.value))}
                        className="w-20 bg-transparent text-right font-mono font-bold text-slate-900 dark:text-white outline-none"
                    />
                </div>
                <div className="bg-slate-100 dark:bg-app-surface p-3 rounded-xl flex items-center justify-between group hover:ring-1 hover:ring-indigo-500/50 transition-all">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-500 transition-colors">Y</span>
                    <input
                        type="number"
                        value={Math.round(obj.y)}
                        onChange={(e) => handleChange('y', Number(e.target.value))}
                        className="w-20 bg-transparent text-right font-mono font-bold text-slate-900 dark:text-white outline-none"
                    />
                </div>
            </div>

            {/* Nudge Controls - D-Pad Style */}
            <div className="flex flex-col items-center gap-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Nudge</span>

                <div className="bg-slate-50 dark:bg-app-surface/50 p-2 rounded-full border border-slate-100 dark:border-app-border">
                    <div className="grid grid-cols-3 gap-1">
                        {/* Top Row */}
                        <div className="col-start-2">
                            <button
                                onClick={() => handleNudge('y', -10)}
                                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-app-surface rounded-xl shadow-sm hover:shadow-md hover:scale-105 hover:bg-indigo-50 dark:hover:bg-neutral-700 hover:text-indigo-600 transition-all text-slate-600 dark:text-slate-300"
                            >
                                <ArrowUp size={20} />
                            </button>
                        </div>

                        {/* Middle Row */}
                        <div className="col-start-1 row-start-2">
                            <button
                                onClick={() => handleNudge('x', -10)}
                                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-app-surface rounded-xl shadow-sm hover:shadow-md hover:scale-105 hover:bg-indigo-50 dark:hover:bg-neutral-700 hover:text-indigo-600 transition-all text-slate-600 dark:text-slate-300"
                            >
                                <ArrowLeft size={20} />
                            </button>
                        </div>

                        <div className="col-start-2 row-start-2 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-indigo-500/20" />
                        </div>

                        <div className="col-start-3 row-start-2">
                            <button
                                onClick={() => handleNudge('x', 10)}
                                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-app-surface rounded-xl shadow-sm hover:shadow-md hover:scale-105 hover:bg-indigo-50 dark:hover:bg-neutral-700 hover:text-indigo-600 transition-all text-slate-600 dark:text-slate-300"
                            >
                                <ArrowRight size={20} />
                            </button>
                        </div>

                        {/* Bottom Row */}
                        <div className="col-start-2 row-start-3">
                            <button
                                onClick={() => handleNudge('y', 10)}
                                className="w-12 h-12 flex items-center justify-center bg-white dark:bg-app-surface rounded-xl shadow-sm hover:shadow-md hover:scale-105 hover:bg-indigo-50 dark:hover:bg-neutral-700 hover:text-indigo-600 transition-all text-slate-600 dark:text-slate-300"
                            >
                                <ArrowDown size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
