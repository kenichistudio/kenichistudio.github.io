import { Settings, Grid3x3, Coffee, Heart, RotateCcw, X, SlidersHorizontal, Camera, Download, FileVideo, Film, Monitor, Smartphone, Check, AlertCircle, ChevronDown, ChevronUp, Clapperboard } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { VerticalAd } from "../ads/VerticalAd";
import { CanvasWorkspace } from "./CanvasWorkspace";
import { PropertiesPanel } from "./PropertiesPanel";
import { Timeline } from "./Timeline";
import { Engine } from "../../engine/Core";
import { Exporter } from "../../engine/Export";
import { HardwareDetector, type HardwareInfo } from "../../utils/HardwareDetector";
import { BrowserDetector } from "../../utils/BrowserDetector";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { BottomSheet } from "./BottomSheet";
import { BottomDock, type BottomDockTab } from "./BottomDock";
import { CanvasControls } from "./CanvasControls";

// Use a simple local context or prop drilling for this "one-page app"
// to keep it self-contained for now.

export const EditorLayout = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mainCanvasContainerRef = useRef<HTMLDivElement>(null); // Ref for fullscreen
    const [engine, setEngine] = useState<Engine | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
    const [isExporting, setIsExporting] = useState(false);
    const [canvasAspectRatio, setCanvasAspectRatio] = useState(16 / 9);
    const [exportMode, setExportMode] = useState<'realtime' | 'offline'>('offline');
    const [exportProgress, setExportProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [activeGuide, setActiveGuide] = useState("none");

    // Mobile Bottom Sheet State
    const [activeBottomTab, setActiveBottomTab] = useState<BottomDockTab>(null);
    const [showExportAdvanced, setShowExportAdvanced] = useState(false);

    // When selection changes on mobile, verify if we should open edit sheet?
    // YouTube Create behavior: selecting an object opens the tools.
    // We can auto-open 'edit' tab if on mobile.
    useEffect(() => {
        if (selectedId && window.innerWidth < 1024) {
            // Optional: Auto-open edit sheet or just show dock is active?
            // YouTube Create: The bottom bar changes to tool options.
            // For us: We highlight the Edit button or open the sheet.
            // Let's just notify availability for now, or auto-open if desired.
            // setActiveBottomTab('edit'); // Uncomment to auto-open
        }
    }, [selectedId]);

    // FIX: Remove injected 'height: auto !important' style to restore layout.
    useLayoutEffect(() => {
        const removeInjectedHeight = () => {
            if (rootRef.current && rootRef.current.style.height === 'auto') {
                rootRef.current.style.removeProperty('height');
            }
        };

        removeInjectedHeight();

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    removeInjectedHeight();
                }
            });
        });

        if (rootRef.current) {
            observer.observe(rootRef.current, { attributes: true, attributeFilter: ["style"] });
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    // Initialize Engine
    useEffect(() => {
        if (!canvasRef.current) return;

        const newEngine = new Engine(canvasRef.current);

        // Hooks
        newEngine.onTimeUpdate = (t) => setCurrentTime(t);
        newEngine.onPlayStateChange = (p) => setIsPlaying(p);
        newEngine.onSelectionChange = (id) => setSelectedId(id);
        newEngine.onResize = (w, h) => setCanvasAspectRatio(w / h);
        newEngine.onDurationChange = (d) => {
            // Force re-render of Timeline/UI
            setCurrentTime(t => t); // fast way to trigger update? or maybe add a state?
        };

        setEngine(newEngine);

        return () => {
            newEngine.dispose();
        };
    }, []);

    const handlePlayPause = () => {
        if (!engine) return;
        if (isPlaying) engine.pause();
        else engine.play();
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            mainCanvasContainerRef.current?.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };



    const handleExportImage = () => {
        if (!engine) return;
        Exporter.exportImage(engine, "png");
    };

    // State for Export Dialog
    const [showExportDialog, setShowExportDialog] = useState(false);
    const [exportConfig, setExportConfig] = useState<{
        filename: string;
        format: "webm" | "mp4" | "mov";
        duration: number; // 0 for full
        useFullDuration: boolean;
        fps: number;
    }>({
        filename: "my-animation",
        format: "webm",
        duration: 5,
        useFullDuration: true,
        fps: 30
    });

    const [exportTab, setExportTab] = useState<'offline' | 'realtime'>('offline');
    const [hardwareInfo, setHardwareInfo] = useState<HardwareInfo | null>(null);
    const [exportLogs, setExportLogs] = useState<string[]>([]);

    useEffect(() => {
        if (showExportDialog && !hardwareInfo) {
            const info = HardwareDetector.getHardwareInfo();
            setHardwareInfo(info);
            console.log("Hardware Detected:", info);
        }
    }, [showExportDialog]);

    const isPerformanceWarning = hardwareInfo?.tier === 'low' && (exportConfig.fps > 30 || (engine?.canvas?.width ?? 0) > 1920);
    const isBrowserWarning = showExportDialog && !BrowserDetector.isChromium();


    const abortController = useRef<AbortController | null>(null);

    // State for Guides
    const [showGuidesMenu, setShowGuidesMenu] = useState(false);
    const [currentGuide, setCurrentGuide] = useState<"none" | "center" | "thirds" | "golden">("none");

    const handleGuideChange = (type: "none" | "center" | "thirds" | "golden") => {
        if (!engine) return;
        engine.scene.guideType = type;
        setCurrentGuide(type);
        engine.render();
        setShowGuidesMenu(false);
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

            // Download
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${exportConfig.filename}.${exportConfig.format}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setShowExportDialog(false);

        } catch (e: any) {
            if (e.message === "Export cancelled") {
                console.log("Export cancelled by user");
            } else {
                console.error("Export failed", e);
                alert("Export failed. Check console for details.");
            }
        } finally {
            setIsExporting(false);
            setExportProgress(0);
            abortController.current = null;
        }
    };

    const handleCancelExport = () => {
        if (abortController.current) {
            abortController.current.abort();
        }
    };

    return (
        <div ref={rootRef} className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 relative font-sans text-slate-900 dark:text-slate-200 selection:bg-indigo-500/30">

            {/* Landscape Lock Overlay Removed */}

            {/* Header */}
            <header className="h-12 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 bg-white dark:bg-slate-900 shrink-0 z-[60] relative">
                <a href={import.meta.env.BASE_URL} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">K</div>
                    <span className="font-bold text-lg hidden sm:block text-slate-900 dark:text-white">Kinetix Create</span>
                </a>

                <div className="flex items-center gap-2">
                    {/* Donation Buttons */}
                    <a
                        href="https://ko-fi.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-2 py-2 md:px-3 bg-amber-100 hover:bg-amber-200 text-amber-900 dark:bg-amber-900/20 dark:text-amber-500 dark:hover:bg-amber-900/40 rounded-lg text-xs font-bold transition-colors mr-1 md:mr-2"
                    >
                        <Coffee size={14} className="text-amber-700 dark:text-amber-500" />
                        <span className="hidden md:inline">Buy me a coffee</span>
                    </a>
                    <a
                        href="https://patreon.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-2 py-2 md:px-3 bg-red-100 hover:bg-red-200 text-red-900 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 rounded-lg text-xs font-bold transition-colors mr-2 md:mr-4"
                    >
                        <Heart size={14} className="text-red-600 fill-red-600 dark:text-red-500 dark:fill-red-500" />
                        <span className="hidden md:inline">Patreon</span>
                    </a>

                    {/* Guides Menu */}
                    <div className="relative hidden lg:block">
                        <button
                            onClick={() => setShowGuidesMenu(!showGuidesMenu)}
                            className={`p-2 rounded-lg transition-colors mr-1 ${currentGuide !== 'none' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800"}`}
                            title="Canvas Guides"
                        >
                            <Grid3x3 size={20} />
                        </button>

                        {showGuidesMenu && (
                            <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-slate-200 dark:border-neutral-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="p-2 space-y-1">
                                    {[
                                        { id: "none", label: "No Guides" },
                                        { id: "center", label: "Center" },
                                        { id: "thirds", label: "Rule of Thirds" },
                                        { id: "golden", label: "Golden Ratio" }
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            onClick={() => handleGuideChange(opt.id as any)}
                                            className={`w-full text-left px-3 py-2 text-xs font-bold rounded-lg transition-colors ${currentGuide === opt.id ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" : "text-slate-600 dark:text-neutral-400 hover:bg-slate-50 dark:hover:bg-neutral-800"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={() => {
                            if (document.documentElement.classList.contains("dark")) {
                                document.documentElement.classList.remove("dark");
                                localStorage.setItem("theme", "light");
                            } else {
                                document.documentElement.classList.add("dark");
                                localStorage.setItem("theme", "dark");
                            }
                        }}
                        className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors mr-1"
                        title="Toggle Dark Mode"
                    >
                        {/* Simple Sun/Moon Icon Logic (Client-side only) */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hidden dark:block">
                            <circle cx="12" cy="12" r="5" />
                            <path d="M12 1v2" />
                            <path d="M12 21v2" />
                            <path d="M4.22 4.22l1.42 1.42" />
                            <path d="M18.36 18.36l1.42 1.42" />
                            <path d="M1 12h2" />
                            <path d="M21 12h2" />
                            <path d="M4.22 19.78l1.42-1.42" />
                            <path d="M18.36 5.64l1.42-1.42" />
                        </svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="block dark:hidden">
                            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                        </svg>
                    </button>

                    <button
                        onClick={() => {
                            // Deselect to show global settings
                            engine?.selectObject(null);
                            setRightSidebarOpen(true);
                        }}
                        className="hidden lg:block p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-lg transition-colors mr-2"
                        title="Scene & Export Settings"
                    >
                        <Settings size={20} />
                    </button>

                    <button
                        onClick={handleExportImage}
                        className="px-3 py-2 bg-slate-100 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300 rounded-lg font-medium text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
                        title="Snapshot"
                    >
                        <Camera size={18} />
                        <span className="hidden lg:inline">Snapshot</span>
                    </button>
                    <button
                        onClick={() => setShowExportDialog(true)}
                        disabled={isExporting}
                        className="px-3 lg:px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                        title="Export Video"
                    >
                        {isExporting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span className="hidden sm:inline">Exporting...</span>
                            </>
                        ) : (
                            <>
                                <Download size={18} className="lg:hidden" />
                                <span className="hidden lg:inline">Export Video</span>
                                <span className="hidden sm:inline lg:hidden">Export</span>
                            </>
                        )}
                    </button>
                </div>
            </header>

            {/* Main Workspace */}
            <div className="flex-1 flex overflow-hidden relative min-h-0">
                {/* Left Sidebar (Assets) - Desktop Only */}
                <div className="hidden lg:flex h-full">
                    <Sidebar engine={engine} />
                </div>

                {/* Center Content Area - Scrollable on Mobile */}
                <div className="flex-1 flex flex-col min-w-0 lg:min-w-0 bg-slate-100 dark:bg-[#020617] relative overflow-y-auto lg:overflow-hidden pb-20 lg:pb-0">

                    {/* Sticky Canvas Container (Mobile) / Flex Item (Desktop) */}
                    <div
                        ref={mainCanvasContainerRef}
                        className="sticky top-0 z-40 lg:relative flex-1 flex flex-col min-w-0 min-h-0 bg-slate-100 dark:bg-[#020617] border-b border-slate-200 dark:border-slate-800 lg:border-none h-full lg:h-auto"
                    >
                        <CanvasWorkspace
                            ref={canvasRef}
                            aspectRatio={canvasAspectRatio}
                            isPlaying={isPlaying}
                            onPlayPause={handlePlayPause}
                            onToggleFullscreen={toggleFullscreen}
                            isFullscreen={isFullscreen}
                            hideOverlayControls={true}
                            activeGuide={activeGuide}
                        />

                        {/* New Mobile Toolbar */}
                        <CanvasControls
                            isPlaying={isPlaying}
                            onPlayPause={handlePlayPause}
                            onToggleFullscreen={toggleFullscreen}
                            aspectRatio={canvasAspectRatio}
                            onChangeAspectRatio={(r) => {
                                setCanvasAspectRatio(r);
                                engine?.resize(1920, 1920 / r);
                            }}
                            onOpenCanvasSettings={() => {
                                // Open "Edit" tab but deselect object to show Canvas properties
                                setSelectedId(null);
                                setActiveBottomTab("edit");
                            }}
                            currentTime={currentTime}
                            totalDuration={engine?.totalDuration || 5000}
                            activeGuide={activeGuide}
                            onGuideChange={setActiveGuide}
                        />

                        {/* Timeline */}
                        <div className="hidden lg:block shrink-0 p-2 lg:p-4 z-10 bg-slate-100 dark:bg-[#020617] border-slate-200 dark:border-slate-800">
                            <div className="h-auto lg:h-32">
                                <Timeline
                                    currentTime={currentTime}
                                    totalDuration={engine?.totalDuration || 5000}
                                    isPlaying={isPlaying}
                                    onPlayPause={handlePlayPause}
                                    onSeek={(t) => engine?.seek(t)}
                                // onToggleFullscreen={toggleFullscreen} // Removed
                                // isFullscreen={isFullscreen} // Removed
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile Properties Panel - MOVED TO BOTTOM SHEET */}
                    {/* <div className="flex-1 lg:hidden p-4 bg-slate-50 dark:bg-slate-950"> ... </div> */}

                </div>

                {/* Mobile Bottom Dock */}
                <BottomDock
                    activeTab={activeBottomTab}
                    onTabChange={(tab) => {
                        if (tab === 'export') {
                            setShowExportDialog(true);
                        } else {
                            setActiveBottomTab(tab);
                        }
                    }}
                    hasSelection={!!selectedId}
                />

                {/* Mobile Bottom Sheets */}

                {/* 1. ASSETS SHEET */}
                <BottomSheet
                    isOpen={['assets', 'text', 'shapes', 'code', 'charts'].includes(activeBottomTab || '')}
                    onClose={() => setActiveBottomTab(null)}
                    title={
                        activeBottomTab === 'text' ? 'Typography' :
                            activeBottomTab === 'shapes' ? 'Shapes' :
                                activeBottomTab === 'code' ? 'Code Blocks' :
                                    activeBottomTab === 'charts' ? 'Charts & Data' : 'Assets'
                    }
                    initialSnap={0.5}
                    snaps={[0.5, 0.9]}
                >
                    <div className="h-full">
                        <Sidebar
                            engine={engine}
                            isMobileSheet
                            mobileActiveTab={
                                activeBottomTab === 'text' ? 'text' :
                                    activeBottomTab === 'shapes' ? 'shapes' :
                                        activeBottomTab === 'code' ? 'shapes' : // Code is in shapes tab
                                            activeBottomTab === 'charts' ? 'media' : // Charts are in media tab
                                                undefined
                            }
                        />
                    </div>
                </BottomSheet>

                {/* 2. EDIT SHEET */}
                <BottomSheet
                    isOpen={activeBottomTab === 'edit'}
                    onClose={() => setActiveBottomTab(null)}
                    title="Edit Properties"
                    initialSnap={0.5}
                    snaps={[0.5, 0.9]}
                >
                    <PropertiesPanel
                        engine={engine}
                        selectedId={selectedId}
                        isMobileSheet // Pass this to disable the persistent toolbar we made earlier
                    />
                </BottomSheet>

                {/* 3. LAYERS SHEET */}
                <BottomSheet
                    isOpen={activeBottomTab === 'layers'}
                    onClose={() => setActiveBottomTab(null)}
                    title="Layers"
                    initialSnap={0.5}
                    snaps={[0.5, 0.9]}
                >
                    <PropertiesPanel
                        engine={engine}
                        selectedId={selectedId}
                        isMobileSheet
                        initialTab="layers"
                    />
                </BottomSheet>


                {/* Mobile Floating Inspector Toggle - REMOVED per redesign */}

                {/* Mobile Backdrop - REMOVED per redesign */}

                {/* Right Sidebar - Desktop Only */}
                <div className={`
                    hidden lg:flex
                    w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0 flex-col overflow-hidden min-h-0
                    relative z-auto h-auto
                    transition-transform duration-300 ease-in-out
                    ${rightSidebarOpen ? 'translate-x-0' : 'translate-x-full !w-0 border-none'}
                `}>
                    <PropertiesPanel
                        engine={engine}
                        selectedId={selectedId}
                    />
                </div>

                {/* Responsive Export Dialog */}
                {(showExportDialog || isExporting) && (
                    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center pointer-events-none">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200"
                            onClick={() => !isExporting && setShowExportDialog(false)}
                        />

                        {/* Dialog Container */}
                        <div className={`
                            pointer-events-auto relative 
                            w-full lg:max-w-md bg-white dark:bg-[#0F172A] 
                            rounded-t-2xl lg:rounded-2xl 
                            shadow-2xl shadow-black/50 
                            flex flex-col overflow-hidden
                            max-h-[90vh] 
                            animate-in slide-in-from-bottom-10 lg:zoom-in-95 duration-300
                        `}>
                            {/* Header */}
                            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 dark:text-white">
                                        {isExporting ? 'Exporting...' : 'Export Video'}
                                    </h3>
                                    {!isExporting && <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400">Save to your device</p>}
                                </div>
                                {!isExporting && (
                                    <button
                                        onClick={() => setShowExportDialog(false)}
                                        className="p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="p-4 lg:p-6 overflow-y-auto custom-scrollbar">
                                {isExporting ? (
                                    <div className="py-4 space-y-6 text-center">
                                        <div className="relative w-20 h-20 mx-auto">
                                            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                <path
                                                    className="text-slate-100 dark:text-slate-800"
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                                <path
                                                    className="text-blue-500 transition-all duration-300 ease-out"
                                                    strokeDasharray={`${exportProgress}, 100`}
                                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center font-bold text-sm text-blue-500">
                                                {Math.round(exportProgress)}%
                                            </div>
                                        </div>

                                        <p className="text-sm text-slate-600 dark:text-slate-300">
                                            Rendering your masterpiece.<br />
                                            <span className="text-xs text-slate-400">Please keep this tab open.</span>
                                        </p>

                                        {/* Simplified Logs */}
                                        <div className="w-full bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 h-24 overflow-y-auto text-left font-mono text-[10px] text-slate-500">
                                            {exportLogs.length === 0 ? (
                                                <div className="italic opacity-50">Initializing...</div>
                                            ) : (
                                                exportLogs.map((log, i) => (
                                                    <div key={i} className="whitespace-nowrap">{log}</div>
                                                ))
                                            )}
                                        </div>

                                        <button
                                            onClick={handleCancelExport}
                                            className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 hover:underline"
                                        >
                                            Cancel Export
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {/* Filename Input */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-slate-500">Filename</label>
                                            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden border border-transparent focus-within:border-blue-500 transition-colors">
                                                <input
                                                    type="text"
                                                    value={exportConfig.filename}
                                                    onChange={(e) => setExportConfig({ ...exportConfig, filename: e.target.value })}
                                                    className="flex-1 bg-transparent border-none px-4 py-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-0"
                                                    placeholder="my-video"
                                                />
                                                <div className="px-4 py-3 text-sm text-slate-400 bg-slate-200/50 dark:bg-slate-700/50">
                                                    .{exportConfig.format}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Format Selection */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-slate-500">Format</label>
                                            <div className="grid grid-cols-3 gap-2">
                                                <button
                                                    onClick={() => setExportConfig({ ...exportConfig, format: 'mp4' })}
                                                    className={`
                                                        relative p-3 rounded-xl border-2 text-center transition-all group
                                                        ${exportConfig.format === 'mp4'
                                                            ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500 text-blue-700 dark:text-blue-400'
                                                            : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
                                                        }
                                                    `}
                                                >
                                                    <Film size={20} className="mx-auto mb-1.5" />
                                                    <div className="font-bold text-xs">MP4</div>
                                                    {exportConfig.format === 'mp4' && <div className="absolute top-1 right-1 text-blue-500"><Check size={12} /></div>}
                                                </button>

                                                <button
                                                    onClick={() => setExportConfig({ ...exportConfig, format: 'webm' })}
                                                    className={`
                                                        relative p-3 rounded-xl border-2 text-center transition-all group
                                                        ${exportConfig.format === 'webm'
                                                            ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500 text-blue-700 dark:text-blue-400'
                                                            : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
                                                        }
                                                    `}
                                                >
                                                    <FileVideo size={20} className="mx-auto mb-1.5" />
                                                    <div className="font-bold text-xs">WebM</div>
                                                    {exportConfig.format === 'webm' && <div className="absolute top-1 right-1 text-blue-500"><Check size={12} /></div>}
                                                </button>

                                                <button
                                                    onClick={() => setExportConfig({ ...exportConfig, format: 'mov' })}
                                                    className={`
                                                        relative p-3 rounded-xl border-2 text-center transition-all group
                                                        ${exportConfig.format === 'mov'
                                                            ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-500 text-blue-700 dark:text-blue-400'
                                                            : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
                                                        }
                                                    `}
                                                >
                                                    <Clapperboard size={20} className="mx-auto mb-1.5" />
                                                    <div className="font-bold text-xs">MOV</div>
                                                    {exportConfig.format === 'mov' && <div className="absolute top-1 right-1 text-blue-500"><Check size={12} /></div>}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Quality/Mode Selection */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase text-slate-500">Process</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    onClick={() => {
                                                        setExportMode('offline');
                                                        setExportConfig({ ...exportConfig, fps: 60 });
                                                    }}
                                                    className={`
                                                        relative p-4 rounded-xl border-2 text-left transition-all group
                                                        ${exportMode === 'offline'
                                                            ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-500 text-purple-700 dark:text-purple-400'
                                                            : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
                                                        }
                                                    `}
                                                >
                                                    <Monitor size={24} className="mb-2" />
                                                    <div className="font-bold text-sm">Render</div>
                                                    <div className="text-[10px] opacity-70">High Quality (Slow)</div>
                                                    {exportMode === 'offline' && <div className="absolute top-3 right-3 text-purple-500"><Check size={16} /></div>}
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setExportMode('realtime');
                                                        setExportConfig({ ...exportConfig, fps: 30 });
                                                    }}
                                                    className={`
                                                        relative p-4 rounded-xl border-2 text-left transition-all group
                                                        ${exportMode === 'realtime'
                                                            ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-500 text-orange-700 dark:text-orange-400'
                                                            : 'bg-white dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-600 dark:text-slate-300'
                                                        }
                                                    `}
                                                >
                                                    <Smartphone size={24} className="mb-2" />
                                                    <div className="font-bold text-sm">Record</div>
                                                    <div className="text-[10px] opacity-70">Realtime (Fast)</div>
                                                    {exportMode === 'realtime' && <div className="absolute top-3 right-3 text-orange-500"><Check size={16} /></div>}
                                                </button>
                                            </div>
                                        </div>


                                        {/* Advanced Options Toggle */}
                                        <div className="pt-2">
                                            <button
                                                onClick={() => setShowExportAdvanced(!showExportAdvanced)}
                                                className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                                            >
                                                {showExportAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                <span>Advanced Options</span>
                                            </button>

                                            {/* Collapsible Content */}
                                            {showExportAdvanced && (
                                                <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-bold uppercase text-slate-500">Frame Rate</label>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {[24, 30, 60].map(fps => (
                                                                <button
                                                                    key={fps}
                                                                    onClick={() => setExportConfig({ ...exportConfig, fps })}
                                                                    className={`
                                                                        py-2 px-3 rounded-lg text-sm font-bold border transition-colors
                                                                        ${exportConfig.fps === fps
                                                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent"
                                                                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-slate-300"
                                                                        }
                                                                    `}
                                                                >
                                                                    {fps} FPS
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Action Button */}
                                        <button
                                            onClick={handleExport}
                                            className="w-full py-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-base shadow-lg shadow-blue-500/30 active:scale-95 transition-all flex items-center justify-center gap-2"
                                        >
                                            <span>Export Video</span>
                                            <Download size={18} />
                                        </button>

                                        <div className="text-center">
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                                By continuing, you likely agree to our <a href="#" className="underline">Terms</a>.
                                            </p>
                                        </div>
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
