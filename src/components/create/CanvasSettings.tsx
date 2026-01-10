import React, { useState } from "react";
import { Engine } from "../../engine/Core";
import { ControlRow, ColorPicker } from "./InspectorUI";

interface CanvasSettingsProps {
    engine: Engine | null;
    onResize?: (width: number, height: number) => void;
    onUpdate?: () => void;
    variant?: 'desktop' | 'mobile';
}

export const CanvasSettings: React.FC<CanvasSettingsProps> = ({ engine, onResize, onUpdate, variant = 'desktop' }) => {
    const [forceUpdate, setForceUpdate] = useState(0);

    if (!engine) return null;

    const isMobile = variant === 'mobile';
    const containerClasses = isMobile ? "flex flex-col gap-6" : "flex flex-col gap-4";
    const buttonBaseClasses = isMobile
        ? "py-3 px-2 rounded-lg text-xs font-bold border transition-all"
        : "py-1.5 px-1 rounded-md text-[10px] font-bold border transition-all";

    const gridClasses = isMobile ? "grid grid-cols-4 gap-3" : "grid grid-cols-4 gap-2";

    return (
        <div className={containerClasses}>
            <ControlRow label="Canvas Color" layout="horizontal">
                <div className="flex justify-end">
                    <ColorPicker
                        value={engine.scene.backgroundColor}
                        onChange={(val) => {
                            engine.scene.backgroundColor = val;
                            engine.render();
                            setForceUpdate(n => n + 1);
                            onUpdate?.();
                        }}
                    />
                </div>
            </ControlRow>

            <ControlRow label="Duration" layout="horizontal">
                <div className="flex items-center gap-2 justify-end">
                    <input
                        type="number"
                        min={1}
                        max={300}
                        className={`inspector-input-number text-right ${isMobile ? "w-20 p-2 text-sm" : "w-16 text-[10px]"}`}
                        value={Math.round(engine.totalDuration / 1000)}
                        onChange={(e) => {
                            const val = Math.max(1, Number(e.target.value));
                            engine.setTotalDuration(val * 1000);
                            setForceUpdate(n => n + 1);
                            onUpdate?.();
                        }}
                    />
                    <span className="text-xs text-slate-500">sec</span>
                </div>
            </ControlRow>

            <ControlRow label="Aspect Ratio">
                <div className={gridClasses}>
                    {[
                        { label: "16:9", val: 16 / 9 },
                        { label: "9:16", val: 9 / 16 },
                        { label: "1:1", val: 1 },
                        { label: "4:3", val: 4 / 3 },
                        { label: "3:4", val: 3 / 4 },
                        { label: "21:9", val: 21 / 9 },
                        { label: "4:5", val: 4 / 5 },
                    ].map((ratio) => {
                        const currentRatio = engine.scene.width / engine.scene.height;
                        const isActive = Math.abs(currentRatio - ratio.val) < 0.05;
                        return (
                            <button
                                key={ratio.label}
                                onClick={() => {
                                    // Logic: Try to maintain "quality" (short edge)
                                    // 1080p is standard "short edge" for HD
                                    // But if we are already 4k, stay 4k?
                                    // Heuristic: Use current short edge as base
                                    const shortEdge = Math.min(engine.scene.width, engine.scene.height);
                                    let base = shortEdge;
                                    // Snap to common bases if close?
                                    if (Math.abs(base - 1080) < 50) base = 1080;
                                    if (Math.abs(base - 720) < 50) base = 720;
                                    if (Math.abs(base - 2160) < 100) base = 2160;

                                    let w, h;
                                    if (ratio.val >= 1) { // Landscape or Square
                                        h = base;
                                        w = Math.round(h * ratio.val);
                                    } else { // Portrait
                                        w = base;
                                        h = Math.round(w / ratio.val);
                                    }

                                    engine.resize(w, h);
                                    onResize?.(w, h); // Sync Parent State
                                    setForceUpdate(n => n + 1);
                                    onUpdate?.();
                                }}
                                className={`${buttonBaseClasses} ${isActive ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300 ring-1 ring-indigo-500" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"}`}
                            >
                                {ratio.label}
                            </button>
                        )
                    })}
                </div>
            </ControlRow>

            <ControlRow label="Resolution (Quality)">
                <div className={gridClasses}>
                    {[
                        { label: "480p", base: 480 },
                        { label: "720p", base: 720 },
                        { label: "1080p", base: 1080 },
                        { label: "4K", base: 2160 }
                    ].map((qual) => {
                        const shortEdge = Math.min(engine.scene.width, engine.scene.height);
                        const isActive = Math.abs(shortEdge - qual.base) < 10;

                        return (
                            <button
                                key={qual.label}
                                onClick={() => {
                                    const currentRatio = engine.scene.width / engine.scene.height;
                                    let w, h;
                                    if (currentRatio >= 1) {
                                        h = qual.base;
                                        w = Math.round(h * currentRatio);
                                    } else {
                                        w = qual.base;
                                        h = Math.round(w / currentRatio);
                                    }

                                    engine.resize(w, h);
                                    onResize?.(w, h); // Sync Parent State
                                    setForceUpdate(n => n + 1);
                                    onUpdate?.();
                                }}
                                className={`${buttonBaseClasses} ${isActive ? "bg-indigo-50 border-indigo-500 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-500 dark:text-indigo-300 ring-1 ring-indigo-500" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"}`}
                            >
                                {qual.label}
                            </button>
                        )
                    })}
                </div>
                <div className="mt-2 text-[10px] text-slate-400 text-right font-mono">
                    {engine.scene.width} x {engine.scene.height} px
                </div>
            </ControlRow>
        </div>
    );
};
