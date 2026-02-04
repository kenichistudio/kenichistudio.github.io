import React, { useState, useEffect, useRef } from 'react';
import { useAnimatorStore } from '../../store';
import { Player, type PlayerRef } from '@remotion/player';
import { toBlob } from 'html-to-image';
import download from 'downloadjs';
import { FileVideo, Film, Check, X, Download, Smartphone, Monitor } from 'lucide-react';

interface ExportDialogProps {
    playerRef: React.RefObject<PlayerRef | null>;
    wrapperRef: React.RefObject<HTMLDivElement | null>;
    durationInFrames: number;
    component: React.ComponentType<any>;
    inputProps: any;
    width: number;
    height: number;
}

const ExportDialog: React.FC<ExportDialogProps> = ({ durationInFrames, component, inputProps, width, height }) => {
    const { isExportOpen, setIsExportOpen } = useAnimatorStore();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState<'idle' | 'rendering' | 'encoding' | 'complete' | 'error'>('idle');
    const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
    const [exportLogs, setExportLogs] = useState<string[]>([]);

    // Configuration State
    const [isMp4, setIsMp4] = useState(true);
    const [qualityScale, setQualityScale] = useState(1); // 1 = Original, 0.66 = ~720p if 1080p source

    const workerRef = useRef<Worker | null>(null);

    // Dedicated ref for the off-screen export player
    const exportPlayerRef = useRef<PlayerRef>(null);
    const exportContainerRef = useRef<HTMLDivElement>(null);

    // Initial worker setup
    useEffect(() => {
        if (!workerRef.current) {
            workerRef.current = new Worker(new URL('../../../../core/workers/export.worker.ts', import.meta.url), { type: 'module' });
            workerRef.current.onmessage = (e) => {
                const { type, data, error, message } = e.data;
                if (type === 'LOG') {
                    setExportLogs(prev => [...prev, `[Worker] ${message}`].slice(-20));
                } else if (type === 'COMPLETE') {
                    const blob = new Blob([data], { type: isMp4 ? 'video/mp4' : 'video/webm' });
                    setVideoBlob(blob);
                    setStatus('complete');
                    setProgress(100);
                } else if (type === 'ERROR') {
                    console.error("Worker Error:", error);
                    setExportLogs(prev => [...prev, `[Error] ${error}`]);
                    setStatus('error');
                }
            };
        }
    }, [isMp4]);

    const startExport = async () => {
        if (!exportPlayerRef.current || !exportContainerRef.current) {
            console.error("Export player not ready");
            setExportLogs(prev => [...prev, "[Error] Export player not ready"]);
            return;
        }

        setStatus('rendering');
        setProgress(0);

        const fps = 30;
        const durationInMs = (durationInFrames / fps) * 1000;

        // Calculate Output Resolution based on Quality Scale
        // Ensure even numbers for encoders usually
        const outWidth = Math.round((width * qualityScale) / 2) * 2;
        const outHeight = Math.round((height * qualityScale) / 2) * 2;

        // 1. Configure Worker
        setExportLogs(['Starting Export...', `Resolution: ${outWidth}x${outHeight}`]);

        const format = isMp4 ? 'mp4' : 'webm';
        workerRef.current?.postMessage({
            type: 'CONFIG',
            data: {
                width: outWidth,
                height: outHeight,
                fps,
                bitrate: outHeight >= 1080 ? 8_000_000 : 4_000_000,
                duration: durationInMs,
                format // 'mp4' or 'webm'
            }
        });

        // Semaphore System
        let credits = 3;
        const creditListener = (e: MessageEvent) => {
            if (e.data.type === 'FRAME_DONE') {
                credits++;
            }
        };
        workerRef.current?.addEventListener('message', creditListener);

        // 2. Capture Loop
        try {
            for (let i = 0; i < durationInFrames; i++) {
                if (status === 'error') break;

                // Backpressure
                while (credits <= 0) {
                    await new Promise(r => setTimeout(r, 10));
                }
                credits--;

                // Seek the EXPORT player
                exportPlayerRef.current.seekTo(i);

                // Wait for paint (Double RAF)
                await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));

                // Capture the off-screen container
                const containerToCapture = exportContainerRef.current;

                if (containerToCapture) {
                    const blob = await toBlob(containerToCapture, {
                        // html-to-image is better at capturing exact size.
                        // But if we resize the container, layout might break.
                        // Approach: Capture at FULL logical resolution, but draw to bitmap at OUTPUT resolution.
                        // Actually, simpler to just capture at intended size. Video encoders handle size.
                        // But html-to-image needs to render the pixels.
                        // Let's rely on the player scaling.
                        width: width, // Capture full res
                        height: height,
                        skipFonts: true,
                        style: {
                            visibility: 'visible',
                            transform: 'none',
                            margin: '0',
                            padding: '0'
                        }
                    });

                    if (blob) {
                        const bitmap = await createImageBitmap(blob, {
                            resizeWidth: outWidth,
                            resizeHeight: outHeight,
                            resizeQuality: 'high'
                        });

                        workerRef.current?.postMessage({
                            type: 'ENCODE_FRAME',
                            data: {
                                bitmap,
                                timestamp: (i * 1000000) / fps,
                                keyFrame: i % 30 === 0,
                                duration: 1000000 / fps
                            }
                        }, [bitmap]);
                    }
                }
                setProgress(Math.round((i / durationInFrames) * 90));
            }

            setStatus('encoding'); // Finalizing
            workerRef.current?.postMessage({ type: 'FINALIZE' });
        } catch (e) {
            console.error(e);
            setStatus('error');
        } finally {
            workerRef.current?.removeEventListener('message', creditListener);
        }
    };

    const handleDownload = () => {
        if (videoBlob) {
            download(videoBlob, `kinetix-export.${isMp4 ? 'mp4' : 'webm'}`, isMp4 ? 'video/mp4' : 'video/webm');
        }
    };

    if (!isExportOpen) return null;

    // Helper for Option Cards
    const OptionCard = ({ selected, onClick, icon: Icon, title, desc }: any) => (
        <button
            onClick={onClick}
            className={`flex-1 flex flex-col items-center p-3 sm:p-4 rounded-xl border-2 transition-all ${selected
                ? "bg-app-light-surface-hover dark:bg-app-surface-hover border-black dark:border-white text-black dark:text-white"
                : "bg-app-light-surface dark:bg-app-surface-hover border-transparent hover:bg-app-light-surface-hover dark:hover:bg-app-border text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
        >
            <Icon size={24} className="mb-2" strokeWidth={2} />
            <span className="font-bold text-xs sm:text-sm">{title}</span>
            <span className="text-[10px] opacity-70">{desc}</span>
        </button>
    );

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center pointer-events-none">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto"
                onClick={() => setIsExportOpen(false)}
            />

            {/* Off-Screen Player for Rendering */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: '200vw',
                    width: `${width}px`,
                    height: `${height}px`,
                    zIndex: -9999,
                    visibility: 'visible',
                    background: 'black',
                    pointerEvents: 'none'
                }}
            >
                <div ref={exportContainerRef} style={{ width: '100%', height: '100%' }}>
                    <Player
                        ref={exportPlayerRef}
                        component={component}
                        durationInFrames={durationInFrames}
                        fps={30}
                        compositionWidth={width}
                        compositionHeight={height}
                        style={{ width: '100%', height: '100%' }}
                        inputProps={inputProps}
                        controls={false}
                        autoPlay={false} // Manual seeking
                    />
                </div>
            </div>

            {/* Panel */}
            <div className={`
                relative w-full sm:max-w-md bg-white dark:bg-app-surface 
                border-t sm:border border-app-light-border dark:border-app-border 
                rounded-t-2xl sm:rounded-2xl 
                p-6 shadow-2xl z-10 pointer-events-auto 
                max-h-[90vh] overflow-y-auto
                animate-in slide-in-from-bottom-10 fade-in duration-300
            `}>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Export Video</h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Save your animation to device
                        </p>
                    </div>
                    <button
                        onClick={() => setIsExportOpen(false)}
                        className="p-2 rounded-full hover:bg-app-light-surface-hover dark:hover:bg-app-surface-hover text-slate-500 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {status === 'idle' && (
                    <div className="space-y-6">

                        {/* Format Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Format</label>
                            <div className="flex gap-3">
                                <OptionCard
                                    selected={isMp4}
                                    onClick={() => setIsMp4(true)}
                                    icon={Film}
                                    title="MP4"
                                    desc="Best Quality"
                                />
                                <OptionCard
                                    selected={!isMp4}
                                    onClick={() => setIsMp4(false)}
                                    icon={FileVideo}
                                    title="WebM"
                                    desc="Web Optimized"
                                />
                            </div>
                        </div>

                        {/* Quality Section */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resolution</label>
                            <div className="flex gap-3">
                                <OptionCard
                                    selected={qualityScale === 1}
                                    onClick={() => setQualityScale(1)}
                                    icon={Monitor}
                                    title="Original"
                                    desc={`${width}x${height}`}
                                />
                                <OptionCard
                                    selected={qualityScale === 0.5}
                                    onClick={() => setQualityScale(0.5)}
                                    icon={Smartphone}
                                    title="Data Saver"
                                    desc={`${Math.round(width / 2)}x${Math.round(height / 2)}`}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={startExport}
                                className="w-full bg-black dark:bg-white hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-black font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
                            >
                                <span>Start Export</span>
                                <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                            </button>
                        </div>
                    </div>
                )}

                {(status === 'rendering' || status === 'encoding') && (
                    <div className="space-y-6 py-4">
                        <div className="relative pt-1">
                            <div className="flex mb-2 items-center justify-between">
                                <div>
                                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-accent bg-accent-subtle/20">
                                        {status === 'rendering' ? 'Rendering' : 'Encoding'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-semibold inline-block text-accent">
                                        {progress}%
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-accent-subtle/20">
                                <div style={{ width: `${progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-accent transition-all duration-300"></div>
                            </div>
                        </div>

                        <p className="text-center text-sm text-slate-500 dark:text-slate-400 animate-pulse font-mono">
                            This relies on your browser performance.<br />Please keep this tab open.
                        </p>

                        {/* Console logs */}
                        <div className="bg-black/80 rounded-lg p-3 h-32 overflow-y-auto font-mono text-[10px] text-green-400 border border-slate-700/50 shadow-inner">
                            {exportLogs.map((log, i) => (
                                <div key={i} className="whitespace-nowrap">{log}</div>
                            ))}
                            <div ref={el => el?.scrollIntoView({ behavior: "smooth" })} />
                        </div>
                    </div>
                )}

                {status === 'complete' && (
                    <div className="space-y-6 text-center py-4">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-2 animate-in zoom-in duration-300">
                            <Check size={40} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Export Complete!</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Your video is ready to download.</p>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                        >
                            <Download size={20} />
                            <span>Save to Device</span>
                        </button>
                    </div>
                )}

                {status === 'error' && (
                    <div className="space-y-6 text-center py-4">
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mx-auto mb-2">
                            <X size={40} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Export Failed</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Something went wrong during rendering.</p>
                        </div>

                        <button
                            onClick={() => setStatus('idle')}
                            className="text-slate-500 hover:text-slate-900 dark:hover:text-white underline"
                        >
                            Try Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExportDialog;
