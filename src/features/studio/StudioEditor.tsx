import { Settings, Grid3x3, Coffee, Heart, RotateCcw, X, SlidersHorizontal, Camera, Download, FileVideo, Film, Monitor, Smartphone, Check, AlertCircle, ChevronDown, ChevronUp, Clapperboard } from "lucide-react";
import { LeftSidebar, type Tab } from "./components/panels/LeftSidebar";
import { Header } from "./components/header/Header";
import { VerticalAd } from "@/shared/ads/VerticalAd";
import { SquareAd } from "@/shared/ads/SquareAd";
import { CanvasWorkspace } from "./components/canvas/CanvasWorkspace";
import { RightSidebar } from "./components/panels/RightSidebar";
import { TimelineDesktop } from "./components/timeline/TimelineDesktop";
import { TimelineMobile } from "./components/timeline/TimelineMobile";
import { Engine } from "@/core/Core";
import { Exporter } from "@/core/Export";
import { HardwareDetector, type HardwareInfo } from "@shared/utils/HardwareDetector";
import { BrowserDetector } from "@shared/utils/BrowserDetector";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { BottomSheet } from "./components/dock/BottomSheet";
import { BottomDock, type BottomDockTab, type ObjectType } from "./components/dock/BottomDock";
import { CanvasControls } from "./components/canvas/CanvasControls";
import { TextObject } from "@/core/objects/TextObject";
import { ChartObject } from "@/core/objects/ChartObject";
import { CharacterObject } from "@/core/objects/CharacterObject";
import { CodeBlockObject } from "@/core/objects/CodeBlockObject";
import { ParticleTextObject } from "@/core/objects/ParticleTextObject";
import { BarChartRaceObject } from "@/core/objects/BarChartRaceObject";
import { ToolsDrawer } from "./components/drawers/editing/ToolsDrawer";
import { ThemeDrawer } from "./components/drawers/editing/ThemeDrawer";
import { AssetsDrawer } from "./components/drawers/creation/AssetsDrawer";
import { DataDrawer } from "./components/drawers/creation/DataDrawer";
import { ChartDataDrawer } from "./components/drawers/editing/ChartDataDrawer";
import { ChartStyleDrawer } from "./components/drawers/editing/ChartStyleDrawer";
import { LayersDrawer } from "./components/drawers/properties/LayersDrawer";
import { ChartsDrawer } from "./components/drawers/creation/ChartsDrawer";
import { TextDrawer } from "./components/drawers/creation/TextDrawer";
import { ElementsDrawer } from "./components/drawers/creation/ElementsDrawer";
import { TransformDrawer } from "./components/drawers/properties/TransformDrawer";
import { StudioProvider, useStudio } from "./context/StudioContext";

interface StudioEditorProps {
    allowedTabs?: Tab[];
}

const StudioEditorContent = ({ allowedTabs }: StudioEditorProps) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mainCanvasContainerRef = useRef<HTMLDivElement>(null);

    const {
        engine, setEngine,
        selectedId, selectObject,
        currentTime, isPlaying, togglePlay,
        resolution, setResolution,
        totalDuration, activeGuide: contextGuide, setGuide: setContextGuide,
        isFullscreen, toggleFullscreen,
        aspectRatio, setAspectRatio
    } = useStudio();

    // local canvasAspectRatio removed
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
    const [isRightSidebarExpanded, setIsRightSidebarExpanded] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [exportMode, setExportMode] = useState<'realtime' | 'offline'>('offline');
    const [exportProgress, setExportProgress] = useState(0);
    // local isFullscreen removed
    // local activeGuide removed

    const [activeBottomTab, setActiveBottomTab] = useState<BottomDockTab>(null);
    const [selectedObjectType, setSelectedObjectType] = useState<ObjectType>(null);
    const [showExportAdvanced, setShowExportAdvanced] = useState(false);

    useEffect(() => {
        if (selectedId && engine) {
            const obj = engine.scene.get(selectedId);
            if (obj instanceof TextObject) setSelectedObjectType("text");
            else if (obj instanceof ChartObject) setSelectedObjectType("chart");
            else if (obj instanceof CharacterObject) setSelectedObjectType("character");
            else if (obj instanceof CodeBlockObject) setSelectedObjectType("code");
            else if (obj instanceof ParticleTextObject) setSelectedObjectType("particle");
            else if (obj instanceof BarChartRaceObject) setSelectedObjectType("bar-race");
            else setSelectedObjectType("shape");
        } else {
            setSelectedObjectType(null);
            if (['font', 'style', 'motion', 'transform', 'settings', 'charts', 'text', 'elements', 'config'].includes(activeBottomTab || '')) {
                setActiveBottomTab(null);
            }
        }
    }, [selectedId, engine]);

    useLayoutEffect(() => {
        const removeInjectedHeight = () => {
            if (rootRef.current && rootRef.current.style.height === 'auto') {
                rootRef.current.style.removeProperty('height');
            }
        };
        removeInjectedHeight();
        const observer = new MutationObserver(() => removeInjectedHeight());
        if (rootRef.current) {
            observer.observe(rootRef.current, { attributes: true, attributeFilter: ["style"] });
        }
        return () => observer.disconnect();
    }, []);

    // Fullscreen is now handled in context, but we still need to listen for changes if we want local state.
    // Actually, StudioEditorContent uses useStudio() so it can just get it from there.

    useEffect(() => {
        if (!canvasRef.current || engine) return;
        const newEngine = new Engine(canvasRef.current);
        newEngine.resize(1920, 1080);
        setEngine(newEngine);
        return () => newEngine.dispose();
    }, [engine, setEngine]);

    // toggleFullscreen logic moved to context

    const handleExportImage = () => {
        if (!engine) return;
        Exporter.exportImage(engine, "png");
    };

    const [showExportDialog, setShowExportDialog] = useState(false);
    const [exportConfig, setExportConfig] = useState<{
        filename: string;
        format: 'webm' | 'mp4' | 'mov';
        duration: number;
        useFullDuration: boolean;
        fps: number;
    }>({
        filename: "my-animation",
        format: 'webm',
        duration: 5,
        useFullDuration: true,
        fps: 30
    });

    const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);
    const [exportLogs, setExportLogs] = useState<string[]>([]);
    const abortController = useRef<AbortController | null>(null);

    useEffect(() => {
        if (showExportDialog && !hardwareInfo) {
            setHardwareInfo(HardwareDetector.getHardwareInfo());
        }
    }, [showExportDialog, hardwareInfo]);

    const handleGuideChange = (type: "none" | "center" | "thirds" | "golden") => {
        if (!engine) return;
        engine.scene.guideType = type;
        engine.render();
    };

    const handleExport = async () => {
        if (!engine) return;
        setIsExporting(true);
        setExportProgress(0);

        try {
            const duration = exportConfig.useFullDuration ? engine.totalDuration : (exportConfig.duration * 1000);
            abortController.current = new AbortController();
            const engineType = (exportConfig.format === 'mp4' || exportConfig.format === 'mov') ? 'mediabunny' : 'legacy';

            const blob = await engine.exportVideo(
                duration,
                exportConfig.fps || 30,
                exportMode,
                (p) => setExportProgress(p),
                abortController.current.signal,
                engineType,
                exportConfig.format,
                (msg) => setExportLogs(prev => [...prev, msg].slice(-50))
            );

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${exportConfig.filename}.${exportConfig.format}`;
            a.click();
            URL.revokeObjectURL(url);
            setShowExportDialog(false);
        } catch (e: any) {
            if (e.message !== "Export cancelled") {
                console.error("Export failed", e);
                alert("Export failed. Check console for details.");
            }
        } finally {
            setIsExporting(false);
            setExportProgress(0);
            abortController.current = null;
        }
    };

    return (
        <div ref={rootRef} className="flex flex-col h-screen overflow-hidden bg-app-light-surface dark:bg-app-bg relative font-sans text-app-light-text-primary dark:text-app-text-primary selection:bg-indigo-500/30">
            <Header
                onExport={() => setShowExportDialog(true)}
                onSnapshot={handleExportImage}
                onSettings={() => {
                    selectObject(null);
                    setRightSidebarOpen(true);
                }}
            />

            <div className="flex-1 flex overflow-hidden relative min-h-0">
                <div className="hidden lg:flex h-full">
                    <LeftSidebar allowedTabs={allowedTabs} />
                </div>

                <div className="flex-1 flex flex-col min-w-0 lg:min-w-0 bg-app-light-surface dark:bg-app-bg relative overflow-y-auto lg:overflow-hidden pb-32 lg:pb-0">
                    <div ref={mainCanvasContainerRef} className="relative z-40 lg:relative flex flex-col w-full min-w-0 min-h-0 bg-app-light-surface dark:bg-app-bg border-b border-app-light-border dark:border-app-border lg:border-none lg:flex-1">
                        <div className="w-full h-auto max-h-[55vh] lg:max-h-none lg:flex-1 lg:min-h-0 flex items-center justify-center bg-slate-900/5 dark:bg-black/20 p-0 mt-8 mb-4">
                            <CanvasWorkspace
                                ref={canvasRef}
                                hideOverlayControls={true}
                            />
                        </div>

                        <CanvasControls
                            aspectRatio={aspectRatio}
                            onChangeAspectRatio={setAspectRatio}
                            onOpenCanvasSettings={() => {
                                selectObject(null);
                                setActiveBottomTab("canvas");
                            }}
                            activeGuide={contextGuide}
                            onGuideChange={setContextGuide}
                        />

                        <div className="hidden lg:block shrink-0 p-2 lg:p-4 z-10 bg-app-light-surface dark:bg-app-bg border-app-light-border dark:border-app-border">
                            <div className="h-auto lg:h-32">
                                <TimelineDesktop />
                            </div>
                        </div>

                        <div className="lg:hidden z-10 bg-app-light-bg dark:bg-app-bg border-t border-app-light-border dark:border-app-border">
                            <TimelineMobile />
                        </div>

                        <BottomDock
                            activeTab={activeBottomTab}
                            onTabChange={(tab) => tab === 'export' ? setShowExportDialog(true) : setActiveBottomTab(tab)}
                            hasSelection={!!selectedId}
                            selectedObjectType={selectedObjectType}
                            isFullscreen={isFullscreen}
                            onCloseContext={() => selectObject(null)}
                        />

                        <BottomSheet
                            isOpen={['assets'].includes(activeBottomTab || '')}
                            onClose={() => setActiveBottomTab(null)}
                            title="Templates"
                            initialSnap={0.5}
                            snaps={[0.5, 0.9]}
                        >
                            <div className="h-full">
                                <LeftSidebar isMobileSheet mobileActiveTab="templates" allowedTabs={allowedTabs} />
                            </div>
                        </BottomSheet>

                        <LayersDrawer isOpen={activeBottomTab === 'layers'} onClose={() => setActiveBottomTab(null)} />
                        <TextDrawer isOpen={activeBottomTab === 'text'} onClose={() => setActiveBottomTab(null)} />
                        <ChartsDrawer isOpen={activeBottomTab === 'charts'} onClose={() => setActiveBottomTab(null)} />
                        <ElementsDrawer isOpen={activeBottomTab === 'elements'} onClose={() => setActiveBottomTab(null)} />
                        <DataDrawer isOpen={activeBottomTab === 'config'} onClose={() => setActiveBottomTab(null)} />
                        <ChartDataDrawer isOpen={activeBottomTab === 'data'} onClose={() => setActiveBottomTab(null)} />
                        <ChartStyleDrawer isOpen={activeBottomTab === 'style' && (selectedObjectType === 'chart')} onClose={() => setActiveBottomTab(null)} />

                        <ToolsDrawer
                            activeTab={(selectedObjectType === 'chart' && activeBottomTab === 'style') ? null : activeBottomTab}
                            onClose={() => setActiveBottomTab(null)}
                        />
                        <TransformDrawer isOpen={activeBottomTab === 'transform'} onClose={() => setActiveBottomTab(null)} />
                        <ThemeDrawer isOpen={activeBottomTab === 'theme'} onClose={() => setActiveBottomTab(null)} />
                        <AssetsDrawer activeTab={activeBottomTab} onClose={() => setActiveBottomTab(null)} />
                    </div>
                </div>

                <div className={`hidden lg:flex ${isRightSidebarExpanded ? 'w-[450px]' : 'w-80'} border-l border-app-light-border dark:border-app-border bg-app-light-bg dark:bg-app-bg shrink-0 flex-col overflow-hidden transition-[width,transform] duration-300 ease-in-out ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full !w-0 border-none'}`}>
                    <RightSidebar
                        onResize={(w, h) => setAspectRatio(w / h)}
                        isExpanded={isRightSidebarExpanded}
                        onToggleExpand={() => setIsRightSidebarExpanded(!isRightSidebarExpanded)}
                    />
                </div>

                {(showExportDialog || isExporting) && (
                    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center pointer-events-none">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200" onClick={() => !isExporting && setShowExportDialog(false)} />
                        <div className="pointer-events-auto relative w-full lg:max-w-md bg-app-light-bg dark:bg-app-surface rounded-t-2xl lg:rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden max-h-[90vh] animate-in slide-in-from-bottom-10 lg:zoom-in-95 duration-300">
                            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-app-light-border dark:border-app-border">
                                <div>
                                    <h3 className="text-lg lg:text-xl font-bold text-app-light-text-primary dark:text-app-text-primary">{isExporting ? 'Exporting...' : 'Export Video'}</h3>
                                    {!isExporting && <p className="text-xs lg:text-sm text-app-light-text-secondary dark:text-app-text-secondary">Save to your device</p>}
                                </div>
                                {!isExporting && (
                                    <button onClick={() => setShowExportDialog(false)} className="p-2 -mr-2 text-app-light-text-secondary hover:text-app-light-text-primary dark:hover:text-app-text-primary rounded-full hover:bg-app-light-surface dark:hover:bg-app-surface transition-colors"><X size={20} /></button>
                                )}
                            </div>
                            <div className="p-4 lg:p-6 overflow-y-auto custom-scrollbar">
                                {isExporting ? (
                                    <div className="py-4 space-y-6 text-center">
                                        <div className="relative w-20 h-20 mx-auto">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                <path className="text-slate-100 dark:text-slate-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                                <path className="text-blue-500 transition-all duration-300 ease-out" strokeDasharray={`${exportProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-blue-500">{Math.round(exportProgress)}%</div>
                                        </div>
                                        <p className="text-sm text-app-light-text-secondary dark:text-app-text-secondary">Rendering your masterpiece.<br /><span className="text-xs text-app-light-text-secondary/70">Please keep this tab open.</span></p>
                                        <div className="w-full max-w-[300px] mx-auto rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800"><SquareAd /></div>
                                        <details className="w-full text-left">
                                            <summary className="text-xs text-app-light-text-secondary cursor-pointer hover:text-app-light-text-primary dark:hover:text-app-text-primary mb-2 list-none text-center">Show Details</summary>
                                            <div className="w-full bg-app-light-surface dark:bg-app-surface/50 rounded-lg p-3 h-24 overflow-y-auto font-mono text-[10px] text-app-light-text-secondary">
                                                {exportLogs.length === 0 ? <div className="italic opacity-50">Initializing...</div> : exportLogs.map((log, i) => <div key={i} className="whitespace-nowrap">{log}</div>)}
                                            </div>
                                        </details>
                                        <button onClick={() => abortController.current?.abort()} className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 hover:underline">Cancel Export</button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-app-light-text-secondary">Filename</label>
                                            <div className="flex bg-app-light-surface dark:bg-app-surface rounded-xl border border-transparent focus-within:border-accent transition-colors">
                                                <input type="text" value={exportConfig.filename} onChange={(e) => setExportConfig({ ...exportConfig, filename: e.target.value })} className="flex-1 bg-transparent border-none px-4 py-3 text-sm font-medium text-app-light-text-primary dark:text-app-text-primary placeholder:text-app-light-text-secondary/50 focus:ring-0" placeholder="my-video" />
                                                <div className="px-4 py-3 text-sm text-app-light-text-secondary bg-app-light-surface-hover/50 dark:bg-app-surface-hover/50">.{exportConfig.format}</div>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-app-light-text-secondary">Format</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                {['mp4', 'webm', 'mov'].map((fmt) => (
                                                    <button key={fmt} onClick={() => setExportConfig({ ...exportConfig, format: fmt as any })} className={`relative p-3 rounded-xl border-2 text-center transition-all group ${exportConfig.format === fmt ? 'bg-app-light-surface-hover dark:bg-app-surface-hover border-black dark:border-white text-black dark:text-white' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                                        {fmt === 'mp4' ? <Film size={20} className="mx-auto mb-1.5" /> : fmt === 'webm' ? <FileVideo size={20} className="mx-auto mb-1.5" /> : <Clapperboard size={20} className="mx-auto mb-1.5" />}
                                                        <div className="font-bold text-xs uppercase">{fmt}</div>
                                                        {exportConfig.format === fmt && <div className="absolute top-1 right-1 text-app-light-text-primary dark:text-app-text-primary"><Check size={12} /></div>}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-app-light-text-secondary">Process</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button onClick={() => { setExportMode('offline'); setExportConfig({ ...exportConfig, fps: 60 }); }} className={`relative p-4 rounded-xl border-2 text-left transition-all group ${exportMode === 'offline' ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-500 text-purple-700 dark:text-purple-400' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                                    <Monitor size={24} className="mb-2" />
                                                    <div className="font-bold text-sm">Render</div><div className="text-[10px] opacity-70">High Quality (Slow)</div>
                                                    {exportMode === 'offline' && <div className="absolute top-3 right-3 text-purple-500"><Check size={16} /></div>}
                                                </button>
                                                <button onClick={() => { setExportMode('realtime'); setExportConfig({ ...exportConfig, fps: 30 }); }} className={`relative p-4 rounded-xl border-2 text-left transition-all group ${exportMode === 'realtime' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-500 text-orange-700 dark:text-orange-400' : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'}`}>
                                                    <Smartphone size={24} className="mb-2" />
                                                    <div className="font-bold text-sm">Record</div><div className="text-[10px] opacity-70">Realtime (Fast)</div>
                                                    {exportMode === 'realtime' && <div className="absolute top-3 right-3 text-orange-500"><Check size={16} /></div>}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="pt-2">
                                            <button onClick={() => setShowExportAdvanced(!showExportAdvanced)} className="flex items-center gap-2 text-xs font-bold text-app-light-text-secondary hover:text-app-light-text-primary dark:hover:text-app-text-primary transition-colors">{showExportAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}<span>Advanced Options</span></button>
                                            {showExportAdvanced && (
                                                <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-app-light-text-secondary">Frame Rate</label>
                                                        <div className="grid grid-cols-3 gap-2">{[24, 30, 60].map(fps => <button key={fps} onClick={() => setExportConfig({ ...exportConfig, fps })} className={`py-2 px-3 rounded-lg text-sm font-bold border transition-colors ${exportConfig.fps === fps ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"}`}>{fps} FPS</button>)}</div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        <button onClick={handleExport} className="w-full py-4 mt-2 bg-app-light-text-primary dark:bg-app-text-primary hover:bg-app-light-text-primary/90 dark:hover:bg-app-text-primary/90 text-app-light-bg dark:text-app-bg rounded-xl font-bold text-base shadow-lg shadow-black/10 dark:shadow-white/10 active:scale-95 transition-all flex items-center justify-center gap-2"><span>Export Video</span><Download size={18} /></button>
                                        <div className="text-center"><p className="text-[10px] text-app-light-text-secondary/70">By continuing, you likely agree to our <a href="#" className="underline">Terms</a>.</p></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export const StudioEditor = (props: StudioEditorProps) => (
    <StudioProvider>
        <StudioEditorContent {...props} />
    </StudioProvider>
);
