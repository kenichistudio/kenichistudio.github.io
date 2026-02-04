import React, { useState } from "react";
import { Play, Pause, Maximize, Settings, Smartphone, RectangleHorizontal, Square, Check, Grid3x3, Ban, Crosshair, ScanLine, Baseline, SkipBack } from "lucide-react";

interface CanvasControlsProps {
    isPlaying: boolean;
    onPlayPause: () => void;
    onToggleFullscreen: () => void;
    aspectRatio: number;
    onChangeAspectRatio: (ratio: number) => void;
    onOpenCanvasSettings: () => void;
    currentTime: number;
    totalDuration: number;
    activeGuide: string;
    onGuideChange: (guide: string) => void;
    onSeek: (time: number) => void;
}

export const CanvasControls: React.FC<CanvasControlsProps> = ({
    isPlaying,
    onPlayPause,
    onToggleFullscreen,
    aspectRatio,
    onChangeAspectRatio,
    onOpenCanvasSettings,
    currentTime,
    totalDuration,
    activeGuide,
    onGuideChange,
    onSeek
}) => {
    const [showRatioMenu, setShowRatioMenu] = useState(false);
    const [showGuideMenu, setShowGuideMenu] = useState(false);

    const formatTime = (ms: number) => {
        const seconds = (ms / 1000).toFixed(2);
        return `${seconds}s`;
    };

    const ratios = [
        { label: "16:9", value: 16 / 9, icon: RectangleHorizontal },
        { label: "9:16", value: 9 / 16, icon: Smartphone },
        { label: "1:1", value: 1, icon: Square },
        { label: "4:5", value: 4 / 5, icon: Smartphone },
    ];

    const guides = [
        { id: "none", label: "None", icon: Ban },
        { id: "thirds", label: "Thirds", icon: Grid3x3 },
        { id: "center", label: "Center", icon: Crosshair },
        { id: "golden", label: "Golden", icon: Baseline }, // Using Baseline as proxy for Phi/Golden
        { id: "safe", label: "Safe Areas", icon: ScanLine },
    ];

    const currentRatioLabel = ratios.find(r => Math.abs(r.value - aspectRatio) < 0.01)?.label || "Custom";
    const currentGuide = guides.find(g => g.id === activeGuide) || guides[0];

    return (
        <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-app-surface lg:hidden user-select-none relative z-30">

            <div className="flex items-center gap-3">
                {/* Restart / Skip Back */}
                <button
                    onClick={() => onSeek(0)}
                    className="p-2 -ml-2 text-slate-500 active:text-slate-900 dark:active:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <SkipBack size={20} />
                </button>

                {/* Play/Pause - Redesigned */}
                <button
                    onClick={onPlayPause}
                    className="w-10 h-10 flex items-center justify-center bg-primary active:bg-primary-hover dark:bg-accent dark:active:bg-accent-hover text-white dark:text-slate-900 rounded-full shadow-lg transition-transform active:scale-95"
                >
                    {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                </button>

                {/* Time Display */}
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400 min-w-[70px]">
                    {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
            </div>

            <div className="h-6 w-px bg-app-light-border dark:bg-app-border mx-1" />

            {/* Middle Controls Group */}
            <div className="flex items-center gap-1">
                {/* Aspect Ratio Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowRatioMenu(!showRatioMenu)}
                        className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg hover:bg-app-light-surface-hover dark:hover:bg-app-surface-hover transition-colors text-xs font-medium text-slate-700 dark:text-slate-300"
                        title="Aspect Ratio"
                    >
                        <Smartphone size={16} />
                        <span className="hidden sm:inline">{currentRatioLabel}</span>
                    </button>

                    {showRatioMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowRatioMenu(false)} />
                            <div className="absolute bottom-full left-0 mb-2 w-32 bg-white dark:bg-app-surface rounded-lg shadow-xl border border-app-light-border dark:border-app-border z-50 py-1 flex flex-col">
                                {ratios.map((ratio) => (
                                    <button
                                        key={ratio.label}
                                        onClick={() => {
                                            onChangeAspectRatio(ratio.value);
                                            setShowRatioMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-app-light-surface-hover dark:hover:bg-app-surface-hover text-slate-700 dark:text-slate-200 text-left"
                                    >
                                        <ratio.icon size={14} />
                                        <span>{ratio.label}</span>
                                        {Math.abs(ratio.value - aspectRatio) < 0.01 && <Check size={12} className="ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Guides Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowGuideMenu(!showGuideMenu)}
                        className={`p-2 rounded-lg transition-colors ${activeGuide !== "none" ? "bg-accent-subtle/20 text-accent dark:text-accent-light" : "hover:bg-app-light-surface-hover dark:hover:bg-app-surface-hover text-slate-700 dark:text-slate-300"}`}
                        title="Guides"
                    >
                        <currentGuide.icon size={18} />
                    </button>

                    {showGuideMenu && (
                        <>
                            <div className="fixed inset-0 z-40" onClick={() => setShowGuideMenu(false)} />
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-36 bg-white dark:bg-app-surface rounded-lg shadow-xl border border-app-light-border dark:border-app-border z-50 py-1 flex flex-col">
                                {guides.map((guide) => (
                                    <button
                                        key={guide.id}
                                        onClick={() => {
                                            onGuideChange(guide.id);
                                            setShowGuideMenu(false);
                                        }}
                                        className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-app-light-surface-hover dark:hover:bg-app-surface-hover text-slate-700 dark:text-slate-200 text-left"
                                    >
                                        <guide.icon size={14} />
                                        <span>{guide.label}</span>
                                        {activeGuide === guide.id && <Check size={12} className="ml-auto" />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="flex-1" />

            {/* Fullscreen */}
            <button
                onClick={onToggleFullscreen}
                className="p-2 rounded-full hover:bg-app-light-surface-hover dark:hover:bg-app-surface-hover transition-colors text-slate-700 dark:text-slate-200"
            >
                <Maximize size={18} />
            </button>

        </div>
    );
};
