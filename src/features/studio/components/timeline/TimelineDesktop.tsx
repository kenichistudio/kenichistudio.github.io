import React, { useState } from "react";
import { Play, Pause, SkipBack, Layers, Music, Type, ZoomIn, ZoomOut, Scissors } from "lucide-react";
import { useTimelineInteraction } from "../../hooks/useTimelineInteraction";

import { useStudio } from "../../context/StudioContext";
import { useStudioStore } from "../../store/useStudioStore";

interface TimelineProps {
}

export const TimelineDesktop = () => {
    const { togglePlay, engine } = useStudio();
    const currentTime = useStudioStore(s => s.currentTime);
    const totalDuration = useStudioStore(s => s.totalDuration);
    const isPlaying = useStudioStore(s => s.isPlaying);
    const onSeek = (time: number) => engine?.seek(time);
    const {
        trackRef,
        isDragging,
        setIsDragging,
        handleSeek,
        formatTime,
        progress
    } = useTimelineInteraction();

    const [zoom, setZoom] = useState(1); // 1 = 100%

    return (
        <div className="w-full h-full bg-white dark:bg-app-bg border-t border-slate-200 dark:border-app-border flex flex-col select-none">

            {/* Toolbar */}
            <div className="h-10 border-b border-slate-200 dark:border-app-border flex items-center justify-between px-4 bg-slate-50 dark:bg-app-surface">
                <div className="flex items-center gap-2">
                    <button
                        onClick={togglePlay}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-app-surface-hover rounded-md transition-colors text-slate-700 dark:text-slate-300"
                    >
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                    </button>
                    <button
                        onClick={() => onSeek(0)}
                        className="p-1.5 hover:bg-slate-200 dark:hover:bg-app-surface-hover rounded-md transition-colors text-slate-700 dark:text-slate-300"
                    >
                        <SkipBack size={16} />
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-app-border mx-1" />
                    <div className="font-mono text-xs font-medium text-slate-600 dark:text-slate-400">
                        {formatTime(currentTime)} <span className="opacity-50">/</span> {formatTime(totalDuration)}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-app-surface-hover rounded-md transition-colors text-slate-500">
                        <Scissors size={14} />
                    </button>
                    <div className="w-px h-4 bg-slate-300 dark:bg-app-border mx-1" />
                    <button onClick={() => setZoom(Math.max(0.5, zoom - 0.25))} className="p-1.5 hover:bg-slate-200 dark:hover:bg-app-surface-hover rounded-md transition-colors text-slate-500">
                        <ZoomOut size={14} />
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono w-8 text-center">{Math.round(zoom * 100)}%</span>
                    <button onClick={() => setZoom(Math.min(2, zoom + 0.25))} className="p-1.5 hover:bg-slate-200 dark:hover:bg-app-surface-hover rounded-md transition-colors text-slate-500">
                        <ZoomIn size={14} />
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Track Headers */}
                <div className="w-48 border-r border-slate-200 dark:border-app-border bg-slate-50 dark:bg-app-bg flex flex-col pt-6">
                    {/* Track 1 */}
                    <div className="h-10 px-3 flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50/50 dark:bg-blue-900/10 border-l-2 border-blue-500 mb-1">
                        <Type size={14} /> <span>Text Layer 1</span>
                    </div>
                    {/* Track 2 */}
                    <div className="h-10 px-3 flex items-center gap-2 text-xs font-semibold text-accent-hover bg-accent/10 dark:bg-accent/10 border-l-2 border-accent mb-1">
                        <Layers size={14} /> <span>Chart Animation</span>
                    </div>
                    {/* Track 3 */}
                    <div className="h-10 px-3 flex items-center gap-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 dark:hover:bg-app-surface-hover transition-colors cursor-pointer border-l-2 border-transparent">
                        <Music size={14} /> <span>Background Music</span>
                    </div>
                </div>

                {/* Timeline Grid */}
                <div className="flex-1 relative bg-slate-100 dark:bg-black/20 overflow-hidden" ref={trackRef}
                    onMouseDown={(e) => {
                        // Only seek if clicking header, otherwise let tracks handle clicks
                        const rect = e.currentTarget.getBoundingClientRect();
                        if (e.clientY - rect.top < 24) {
                            setIsDragging(true);
                            handleSeek(e);
                        }
                    }}
                >
                    {/* Time Ruler */}
                    <div className="h-6 border-b border-slate-200 dark:border-app-border bg-white dark:bg-app-bg flex items-end">
                        {/* Simple ticks */}
                        {Array.from({ length: 20 }).map((_, i) => (
                            <div key={i} className="flex-1 border-r border-slate-200 dark:border-app-border h-2 relative">
                                <span className="absolute -top-3 left-1 text-[9px] text-slate-400 font-mono">0:0{i}</span>
                            </div>
                        ))}
                    </div>

                    {/* Playhead Line */}
                    <div
                        className="absolute top-0 bottom-0 w-px bg-red-500 z-30 pointer-events-none"
                        style={{ left: `${progress}%` }}
                    >
                        <div className="absolute top-0 -translate-x-1/2 w-3 h-3 bg-red-500 rotate-45 rounded-sm shadow-sm"></div>
                    </div>

                    {/* Tracks Content */}
                    <div className="pt-0"> {/* Adjusted to align with headers */}
                        {/* Track 1 Clip */}
                        <div className="h-10 mb-1 relative w-full">
                            <div className="absolute top-1 bottom-1 left-[0%] width-[40%] bg-blue-500/20 border border-blue-500/50 rounded-md overflow-hidden group">
                                <div className="absolute inset-0 flex items-center px-2 text-[10px] font-bold text-blue-700 dark:text-blue-300">
                                    Main Headline
                                </div>
                                {/* Handles */}
                                <div className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/50"></div>
                                <div className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize hover:bg-blue-500/50"></div>
                            </div>
                        </div>

                        {/* Track 2 Clip */}
                        <div className="h-10 mb-1 relative w-full">
                            <div className="absolute top-1 bottom-1 left-[20%] w-[30%] bg-accent/20 border border-accent/50 rounded-md overflow-hidden">
                                <div className="absolute inset-0 flex items-center px-2 text-[10px] font-bold text-accent-hover dark:text-accent-light">
                                    Pie Chart Build
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Scrubber overlay for seeking */}
                    <div
                        className="absolute inset-0 z-20 cursor-crosshair opacity-0"
                        onMouseDown={(e) => {
                            setIsDragging(true);
                            handleSeek(e);
                        }}
                    ></div>

                </div>
            </div>
        </div>
    );
};
