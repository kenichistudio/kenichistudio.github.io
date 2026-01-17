import React, { useState } from "react";
import { Engine } from "../../../engine/Core";
import { ControlRow, ColorPicker } from "../ui/InspectorUI";

interface CanvasSettingsProps {
    engine: Engine | null;
    onResize?: (width: number, height: number) => void;
    onUpdate?: () => void;
    variant?: 'desktop' | 'mobile';
}

const PRESET_COLORS = [
    { val: "#FACC15", label: "Yellow" },
    { val: "#EF4444", label: "Red" },
    { val: "#22C55E", label: "Green" },
    { val: "#3B82F6", label: "Blue" },
    { val: "#8B5CF6", label: "Purple" },
    { val: "#EC4899", label: "Pink" },
    { val: "#000000", label: "Black" },
    { val: "#FFFFFF", label: "White" },
];

const PRESET_RATIOS = [
    { label: "16:9", val: 16 / 9 },
    { label: "9:16", val: 9 / 16 },
    { label: "1:1", val: 1 },
    { label: "4:3", val: 4 / 3 },
    { label: "3:4", val: 3 / 4 },
    { label: "21:9", val: 21 / 9 },
    { label: "4:5", val: 4 / 5 },
];

const PRESET_RESOLUTIONS = [
    { label: "480p", base: 480 },
    { label: "720p", base: 720 },
    { label: "1080p", base: 1080 },
    { label: "4K", base: 2160 }
];

const PRESET_DURATIONS = [5, 10, 15, 30, 60];

const MobileCanvasSettings: React.FC<CanvasSettingsProps & { forceUpdate: any, setForceUpdate: any }> = ({ engine, onResize, onUpdate, setForceUpdate }) => {
    const [activeTab, setActiveTab] = useState<'ratio' | 'res' | 'bg' | 'duration'>('ratio');
    if (!engine) return null;

    return (
        <div className="flex flex-col h-full bg-white dark:bg-neutral-900">
            {/* Content Area */}
            <div className="flex-1 p-4 pb-2 overflow-y-auto">
                {/* Aspect Ratio Content */}
                {activeTab === 'ratio' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <span>Aspect Ratio</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {PRESET_RATIOS.map((ratio) => {
                                const currentRatio = engine.scene.width / engine.scene.height;
                                const isActive = Math.abs(currentRatio - ratio.val) < 0.05;
                                return (
                                    <button
                                        key={ratio.label}
                                        onClick={() => {
                                            const shortEdge = Math.min(engine.scene.width, engine.scene.height);
                                            let base = shortEdge;
                                            if (Math.abs(base - 1080) < 50) base = 1080;
                                            if (Math.abs(base - 720) < 50) base = 720;
                                            if (Math.abs(base - 2160) < 100) base = 2160;

                                            let w, h;
                                            if (ratio.val >= 1) { // Landscape
                                                h = base;
                                                w = Math.round(h * ratio.val);
                                            } else { // Portrait
                                                w = base;
                                                h = Math.round(w / ratio.val);
                                            }

                                            engine.resize(w, h);
                                            onResize?.(w, h);
                                            setForceUpdate((n: number) => n + 1);
                                            onUpdate?.();
                                        }}
                                        className={`px-3 py-2 rounded-lg text-xs font-bold transition-all border
                                            ${isActive
                                                ? "bg-accent/10 border-accent text-accent-hover dark:bg-accent/20 dark:border-accent dark:text-accent-light ring-1 ring-accent"
                                                : "bg-white dark:bg-app-surface border-slate-200 dark:border-app-border text-slate-600 dark:text-slate-400 hover:border-accent-light dark:hover:border-accent"}`}
                                    >
                                        {ratio.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Resolution Content */}
                {activeTab === 'res' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <span>Resolution</span>
                            <span className="font-mono text-[10px] opacity-70 bg-slate-100 dark:bg-app-surface px-2 py-0.5 rounded">{engine.scene.width} x {engine.scene.height}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {PRESET_RESOLUTIONS.map((qual) => {
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
                                            onResize?.(w, h);
                                            setForceUpdate((n: number) => n + 1);
                                            onUpdate?.();
                                        }}
                                        className={`py-3 text-xs font-bold rounded-lg transition-all border
                                            ${isActive
                                                ? "bg-accent/10 border-accent text-accent-hover dark:bg-accent/20 dark:border-accent dark:text-accent-light ring-1 ring-accent"
                                                : "bg-white dark:bg-app-surface border-slate-200 dark:border-app-border text-slate-500 dark:text-slate-400 hover:border-accent-light dark:hover:border-accent"}`}
                                    >
                                        {qual.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Background Content */}
                {activeTab === 'bg' && (
                    <div className="space-y-4 animate-in fade-in duration-200">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Background Color
                        </div>
                        <div className="flex flex-wrap gap-4">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color.val}
                                    onClick={() => {
                                        engine.scene.backgroundColor = color.val;
                                        engine.render();
                                        setForceUpdate((n: number) => n + 1);
                                        onUpdate?.();
                                    }}
                                    className={`w-10 h-10 rounded-full shadow-sm ring-2 transition-all ${engine.scene.backgroundColor.toLowerCase() === color.val.toLowerCase()
                                        ? "ring-accent scale-110 z-10"
                                        : "ring-slate-200 dark:ring-slate-700 hover:scale-105"
                                        }`}
                                    style={{ backgroundColor: color.val }}
                                    title={color.label}
                                />
                            ))}
                            <div className="w-px h-12 bg-slate-200 dark:bg-app-border mx-1" />
                            <div className="h-12 flex items-center">
                                <ColorPicker
                                    value={engine.scene.backgroundColor}
                                    onChange={(val) => {
                                        engine.scene.backgroundColor = val;
                                        engine.render();
                                        setForceUpdate((n: number) => n + 1);
                                        onUpdate?.();
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <div className="text-xs text-slate-400">Current Hex:</div>
                            <div className="font-mono text-xs font-bold bg-slate-100 dark:bg-app-surface px-2 py-1 rounded select-all">
                                {engine.scene.backgroundColor}
                            </div>
                        </div>
                    </div>
                )}

                {/* Duration Content */}
                {activeTab === 'duration' && (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Duration
                        </div>

                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                min={1}
                                max={300}
                                className="w-full text-center bg-slate-100 dark:bg-app-surface rounded-xl px-4 py-3 text-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-accent transition-all border border-transparent focus:border-accent"
                                value={Math.round(engine.totalDuration / 1000)}
                                onChange={(e) => {
                                    const val = Math.max(1, Number(e.target.value));
                                    engine.setTotalDuration(val * 1000);
                                    setForceUpdate((n: number) => n + 1);
                                    onUpdate?.();
                                }}
                            />
                            <span className="text-lg font-bold text-slate-400">seconds</span>
                        </div>

                        <div className="space-y-3">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Presets</div>
                            <div className="flex flex-wrap gap-2">
                                {PRESET_DURATIONS.map((sec) => (
                                    <button
                                        key={sec}
                                        onClick={() => {
                                            engine.setTotalDuration(sec * 1000);
                                            setForceUpdate((n: number) => n + 1);
                                            onUpdate?.();
                                        }}
                                        className={`flex-1 min-w-[50px] px-3 py-2 rounded-lg text-xs font-bold border transition-all ${Math.round(engine.totalDuration / 1000) === sec
                                            ? "bg-accent/10 border-accent text-accent-hover dark:bg-accent/20 dark:border-accent dark:text-accent-light ring-1 ring-accent"
                                            : "bg-white dark:bg-app-surface border-slate-200 dark:border-app-border text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-neutral-600"
                                            }`}
                                    >
                                        {sec}s
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Tab Bar at Bottom */}
            <div className="flex p-1 bg-white dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-800">
                <button
                    onClick={() => setActiveTab('ratio')}
                    className={`flex-1 py-1 flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === 'ratio'
                        ? "text-accent dark:text-accent-light"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                >
                    <Smartphone size={20} strokeWidth={activeTab === 'ratio' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium mt-1">Aspect</span>
                </button>
                <button
                    onClick={() => setActiveTab('res')}
                    className={`flex-1 py-1 flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === 'res'
                        ? "text-accent dark:text-accent-light"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                >
                    <Monitor size={20} strokeWidth={activeTab === 'res' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium mt-1">Size</span>
                </button>
                <button
                    onClick={() => setActiveTab('bg')}
                    className={`flex-1 py-1 flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === 'bg'
                        ? "text-accent dark:text-accent-light"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                >
                    <Palette size={20} strokeWidth={activeTab === 'bg' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium mt-1">Color</span>
                </button>
                <button
                    onClick={() => setActiveTab('duration')}
                    className={`flex-1 py-1 flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === 'duration'
                        ? "text-accent dark:text-accent-light"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"}`}
                >
                    <Clock size={20} strokeWidth={activeTab === 'duration' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium mt-1">Time</span>
                </button>
            </div>
        </div>
    );
};

import { Smartphone, Monitor, Palette, Clock, Check } from "lucide-react";

const DesktopCanvasSettings: React.FC<CanvasSettingsProps & { forceUpdate: any, setForceUpdate: any }> = ({ engine, onResize, onUpdate, setForceUpdate }) => {
    const [activeTab, setActiveTab] = useState<'ratio' | 'res' | 'bg' | 'duration'>('ratio');

    if (!engine) return null;

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Tab Bar */}
            <div className="flex p-1 bg-slate-100 dark:bg-app-surface rounded-xl">
                <button
                    onClick={() => setActiveTab('ratio')}
                    className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all ${activeTab === 'ratio'
                        ? "bg-white dark:bg-neutral-700 text-accent dark:text-accent-light shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
                    title="Aspect Ratio"
                >
                    <Smartphone size={16} />
                </button>
                <button
                    onClick={() => setActiveTab('res')}
                    className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all ${activeTab === 'res'
                        ? "bg-white dark:bg-neutral-700 text-accent dark:text-accent-light shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
                    title="Resolution"
                >
                    <Monitor size={16} />
                </button>
                <button
                    onClick={() => setActiveTab('bg')}
                    className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all ${activeTab === 'bg'
                        ? "bg-white dark:bg-neutral-700 text-accent dark:text-accent-light shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
                    title="Background"
                >
                    <Palette size={16} />
                </button>
                <button
                    onClick={() => setActiveTab('duration')}
                    className={`flex-1 py-1.5 flex items-center justify-center rounded-lg transition-all ${activeTab === 'duration'
                        ? "bg-white dark:bg-neutral-700 text-accent dark:text-accent-light shadow-sm"
                        : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
                    title="Duration"
                >
                    <Clock size={16} />
                </button>
            </div>

            {/* Content Area */}
            <div className="min-h-[160px]">
                {/* Aspect Ratio Content */}
                {activeTab === 'ratio' && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <span>Aspect Ratio</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {PRESET_RATIOS.map((ratio) => {
                                const currentRatio = engine.scene.width / engine.scene.height;
                                const isActive = Math.abs(currentRatio - ratio.val) < 0.05;
                                return (
                                    <button
                                        key={ratio.label}
                                        onClick={() => {
                                            const shortEdge = Math.min(engine.scene.width, engine.scene.height);
                                            let base = shortEdge;
                                            if (Math.abs(base - 1080) < 50) base = 1080;
                                            if (Math.abs(base - 720) < 50) base = 720;
                                            if (Math.abs(base - 2160) < 100) base = 2160;

                                            let w, h;
                                            if (ratio.val >= 1) { // Landscape
                                                h = base;
                                                w = Math.round(h * ratio.val);
                                            } else { // Portrait
                                                w = base;
                                                h = Math.round(w / ratio.val);
                                            }

                                            engine.resize(w, h);
                                            onResize?.(w, h);
                                            setForceUpdate((n: number) => n + 1);
                                            onUpdate?.();
                                        }}
                                        className={`px-2 py-3 rounded-xl text-xs font-bold transition-all border
                                            ${isActive
                                                ? "bg-accent/10 border-accent text-accent-hover dark:bg-accent/20 dark:border-accent dark:text-accent-light ring-1 ring-accent"
                                                : "bg-white dark:bg-app-surface border-slate-200 dark:border-app-border text-slate-600 dark:text-slate-400 hover:border-accent-light dark:hover:border-accent"}`}
                                    >
                                        {ratio.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Resolution Content */}
                {activeTab === 'res' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            <span>Resolution</span>
                            <span className="font-mono text-[10px] opacity-70 bg-slate-100 dark:bg-app-surface px-2 py-0.5 rounded">{engine.scene.width} x {engine.scene.height}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            {PRESET_RESOLUTIONS.map((qual) => {
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
                                            onResize?.(w, h);
                                            setForceUpdate((n: number) => n + 1);
                                            onUpdate?.();
                                        }}
                                        className={`py-4 text-sm font-bold rounded-xl transition-all border
                                            ${isActive
                                                ? "bg-accent/10 border-accent text-accent-hover dark:bg-accent/20 dark:border-accent dark:text-accent-light ring-1 ring-accent"
                                                : "bg-white dark:bg-app-surface border-slate-200 dark:border-app-border text-slate-500 dark:text-slate-400 hover:border-accent-light dark:hover:border-accent"}`}
                                    >
                                        {qual.label}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Background Content */}
                {activeTab === 'bg' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Background Color
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {PRESET_COLORS.map((color) => (
                                <button
                                    key={color.val}
                                    onClick={() => {
                                        engine.scene.backgroundColor = color.val;
                                        engine.render();
                                        setForceUpdate((n: number) => n + 1);
                                        onUpdate?.();
                                    }}
                                    className={`w-10 h-10 rounded-full shadow-sm ring-2 transition-all ${engine.scene.backgroundColor.toLowerCase() === color.val.toLowerCase()
                                        ? "ring-accent scale-110 z-10"
                                        : "ring-slate-200 dark:ring-slate-700 hover:scale-105"
                                        }`}
                                    style={{ backgroundColor: color.val }}
                                    title={color.label}
                                />
                            ))}
                            <div className="w-px h-10 bg-slate-200 dark:bg-app-border mx-1" />
                            <div className="h-10 flex items-center">
                                <ColorPicker
                                    value={engine.scene.backgroundColor}
                                    onChange={(val) => {
                                        engine.scene.backgroundColor = val;
                                        engine.render();
                                        setForceUpdate((n: number) => n + 1);
                                        onUpdate?.();
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 pt-2">
                            <div className="text-xs text-slate-400">Current Hex:</div>
                            <div className="font-mono text-xs font-bold bg-slate-100 dark:bg-app-surface px-2 py-1 rounded select-all">
                                {engine.scene.backgroundColor}
                            </div>
                        </div>
                    </div>
                )}

                {/* Duration Content */}
                {activeTab === 'duration' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-200">
                        <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Duration
                        </div>

                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                min={1}
                                max={300}
                                className="w-24 text-center bg-slate-100 dark:bg-app-surface rounded-xl px-4 py-3 text-xl font-bold text-slate-900 dark:text-white outline-none focus:ring-2 ring-accent transition-all border border-transparent focus:border-accent"
                                value={Math.round(engine.totalDuration / 1000)}
                                onChange={(e) => {
                                    const val = Math.max(1, Number(e.target.value));
                                    engine.setTotalDuration(val * 1000);
                                    setForceUpdate((n: number) => n + 1);
                                    onUpdate?.();
                                }}
                            />
                            <span className="text-sm font-bold text-slate-400">seconds</span>
                        </div>

                        <div className="space-y-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase">Presets</div>
                            <div className="flex flex-wrap gap-2">
                                {PRESET_DURATIONS.map((sec) => (
                                    <button
                                        key={sec}
                                        onClick={() => {
                                            engine.setTotalDuration(sec * 1000);
                                            setForceUpdate((n: number) => n + 1);
                                            onUpdate?.();
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition-all ${Math.round(engine.totalDuration / 1000) === sec
                                            ? "bg-accent/10 border-accent text-accent-hover dark:bg-accent/20 dark:border-accent dark:text-accent-light ring-1 ring-accent"
                                            : "bg-white dark:bg-app-surface border-slate-200 dark:border-app-border text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-neutral-600"
                                            }`}
                                    >
                                        {sec}s
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


export const CanvasSettings: React.FC<CanvasSettingsProps> = (props) => {
    const [forceUpdate, setForceUpdate] = useState(0);

    if (props.variant === 'mobile') {
        return <MobileCanvasSettings {...props} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} />;
    }

    return <DesktopCanvasSettings {...props} forceUpdate={forceUpdate} setForceUpdate={setForceUpdate} />;
};
