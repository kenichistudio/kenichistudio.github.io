import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Engine } from '@core/Core';
import { useStudioStore } from '../store/useStudioStore';

interface StudioContextType {
    engine: Engine | null;
    selectedId: string | null;
    resolution: { width: number; height: number };
    activeGuide: string;
    isFullscreen: boolean;
    aspectRatio: number;

    // Actions
    setEngine: (engine: Engine | null) => void;
    selectObject: (id: string | null) => void;
    togglePlay: () => void;
    seek: (time: number) => void;
    setResolution: (width: number, height: number) => void;
    setGuide: (guide: string) => void;
    setAspectRatio: (ratio: number) => void;
    toggleFullscreen: (element?: HTMLElement | null) => void;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

export const StudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [engine, setEngine] = useState<Engine | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [resolution, setResolutionState] = useState({ width: 1920, height: 1080 });
    const [activeGuide, setActiveGuide] = useState("none");
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [aspectRatio, setAspectRatioState] = useState(16 / 9);

    useEffect(() => {
        const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, []);

    useEffect(() => {
        if (!engine) return;

        // Subscribe to engine events - Direct to Store (Headless)
        const unsubTime = engine.on('timeUpdate', (t: number) => useStudioStore.getState().setTime(t));
        const unsubPlay = engine.on('playStateChange', (p: boolean) => useStudioStore.getState().setIsPlaying(p));
        const unsubDuration = engine.on('durationChange', (d: number) => useStudioStore.getState().setDuration(d));

        const unsubSelect = engine.on('selectionChange', (id: string | null) => setSelectedId(id));
        const unsubResize = engine.on('resize', (w: number, h: number) => setResolutionState({ width: w, height: h }));

        // Initial sync
        useStudioStore.getState().setTime(engine.currentTime);
        useStudioStore.getState().setIsPlaying(engine.isPlaying);
        useStudioStore.getState().setDuration(engine.totalDuration);

        setSelectedId(engine.selectedObjectId);
        setResolutionState({ width: engine.canvas.width, height: engine.canvas.height });
        setActiveGuide(engine.scene.guideType || "none");

        return () => {
            unsubTime();
            unsubPlay();
            unsubSelect();
            unsubDuration();
            unsubResize();
        };
    }, [engine]);

    const selectObject = useCallback((id: string | null) => {
        engine?.selectObject(id);
    }, [engine]);

    const togglePlay = useCallback(() => {
        if (!engine) return;
        if (engine.isPlaying) engine.pause();
        else engine.play();
    }, [engine]);

    const seek = useCallback((time: number) => {
        engine?.seek(time);
    }, [engine]);

    const setResolution = useCallback((width: number, height: number) => {
        engine?.resize(width, height);
        setResolutionState({ width, height });
        setAspectRatioState(width / height);
    }, [engine]);

    const setAspectRatio = useCallback((ratio: number) => {
        setAspectRatioState(ratio);
        const width = 1920;
        const height = Math.round(1920 / ratio);
        engine?.resize(width, height);
        setResolutionState({ width, height });
    }, [engine]);


    const setGuide = useCallback((guide: string) => {
        if (!engine) return;
        engine.scene.guideType = guide as any;
        setActiveGuide(guide);
        engine.render();
    }, [engine]);

    const toggleFullscreen = useCallback((element?: HTMLElement | null) => {
        if (!document.fullscreenElement) {
            const el = element || document.documentElement;
            el.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    }, []);

    const value: StudioContextType = {
        engine,
        setEngine,
        selectedId,
        resolution,
        activeGuide,
        isFullscreen,
        aspectRatio,
        selectObject,
        togglePlay,
        seek,
        setResolution,
        setGuide,
        setAspectRatio,
        toggleFullscreen
    };

    return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
};

export const useStudio = () => {
    const context = useContext(StudioContext);
    if (context === undefined) {
        throw new Error('useStudio must be used within a StudioProvider');
    }
    return context;
};
