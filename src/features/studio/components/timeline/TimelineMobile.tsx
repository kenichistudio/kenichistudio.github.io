import React from "react";
import { Play, Pause, SkipBack } from "lucide-react";
import { useTimelineInteraction } from "../../hooks/useTimelineInteraction";

interface TimelineProps {
    currentTime: number;
    totalDuration: number;
    isPlaying: boolean;
    onPlayPause: () => void;
    onSeek: (time: number) => void;
}

export const TimelineMobile = ({
    currentTime,
    totalDuration,
    isPlaying,
    onPlayPause,
    onSeek
}: TimelineProps) => {
    const {
        trackRef,
        isDragging,
        setIsDragging,
        handleSeek,
        formatTime,
        progress
    } = useTimelineInteraction({ currentTime, totalDuration, onSeek });

    return (
        <div className="w-full bg-white dark:bg-app-bg border-t border-slate-200 dark:border-app-border flex flex-col select-none pb-safe">

            {/* Scrubber Area */}
            <div
                className="h-12 relative w-full bg-slate-100 dark:bg-app-surface border-b border-slate-200 dark:border-app-border overflow-hidden touch-none"
                ref={trackRef}
                onTouchStart={(e) => {
                    setIsDragging(true);
                    handleSeek(e);
                }}
                onMouseDown={(e) => {
                    setIsDragging(true);
                    handleSeek(e);
                }}
            >
                {/* Progress Bar */}
                <div
                    className="absolute top-0 bottom-0 left-0 bg-accent/10 dark:bg-accent/20 pointer-events-none"
                    style={{ width: `${progress}%` }}
                />

                {/* Scrubber Handle/Line */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-indigo-500 z-10 pointer-events-none transition-transform duration-75"
                    style={{ left: `${progress}%` }}
                >
                    <div className="absolute top-0 -translate-x-1/2 w-4 h-4 bg-indigo-500 rounded-b-md shadow-sm flex items-center justify-center">
                        <div className="w-0.5 h-2 bg-white/50 rounded-full" />
                    </div>
                </div>

                {/* Ticks (Visual only) */}
                <div className="absolute inset-0 flex items-end pointer-events-none opacity-20">
                    {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="flex-1 border-r border-slate-900 h-2" />
                    ))}
                </div>

                {/* Time Display centered */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-xs font-mono font-bold text-accent-hover dark:text-accent-light bg-white/80 dark:bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                        {formatTime(currentTime)}
                    </div>
                </div>
            </div>

            {/* Mobile Controls */}
        </div>
    );
};
