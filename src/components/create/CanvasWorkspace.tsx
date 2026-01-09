import React, { forwardRef } from "react";
import { Play, Pause, Maximize, Minimize } from "lucide-react";

interface CanvasWorkspaceProps {
    aspectRatio?: number;
    isPlaying?: boolean;
    onPlayPause?: () => void;
    onToggleFullscreen?: () => void;
    isFullscreen?: boolean;
}

export const CanvasWorkspace = forwardRef<HTMLCanvasElement, CanvasWorkspaceProps>((props, ref) => {
    return (
        <div className="flex-1 flex items-center justify-center overflow-hidden min-w-0 min-h-0 bg-slate-50 dark:bg-neutral-950 p-2 md:p-8">
            <div
                style={{ aspectRatio: props.aspectRatio || 16 / 9 }}
                className="shadow-2xl shadow-slate-300 dark:shadow-neutral-950 border border-slate-200 dark:border-neutral-800 ring-4 ring-slate-100 dark:ring-neutral-900 rounded-sm overflow-hidden w-auto h-auto max-w-full max-h-full block relative group"
            >
                <canvas
                    ref={ref}
                    width={1920}
                    height={1080}
                    className="w-full h-full bg-white dark:bg-slate-900 block cursor-crosshair"
                />

                {/* Control Overlay */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-2 bg-slate-900/80 backdrop-blur text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 transform translate-y-2 group-hover:translate-y-0 z-50">
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onPlayPause?.();
                        }}
                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        title={props.isPlaying ? "Pause" : "Play"}
                    >
                        {props.isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                    </button>

                    <div className="w-px h-4 bg-white/20 mx-1" />

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            props.onToggleFullscreen?.();
                        }}
                        className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                        title={props.isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                        {props.isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
                    </button>
                </div>
            </div>
        </div>
    );
});

CanvasWorkspace.displayName = "CanvasWorkspace";
