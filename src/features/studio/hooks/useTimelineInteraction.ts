import { useState, useRef, useEffect, useCallback } from "react";
import { useStudio } from "../context/StudioContext";

export const useTimelineInteraction = () => {
    const { currentTime, totalDuration, engine } = useStudio();
    const onSeek = (time: number) => engine?.seek(time);
    const trackRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleSeek = useCallback((e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent) => {
        if (!trackRef.current) return;
        const rect = trackRef.current.getBoundingClientRect();

        let clientX;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
        } else {
            clientX = (e as MouseEvent).clientX;
        }

        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        const pct = x / rect.width;
        onSeek(pct * totalDuration);
    }, [totalDuration, onSeek]);

    useEffect(() => {
        if (!isDragging) return;

        const onMove = (e: MouseEvent | TouchEvent) => handleSeek(e);
        const onUp = () => setIsDragging(false);

        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("touchmove", onMove, { passive: false });
        window.addEventListener("touchend", onUp);

        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
            window.removeEventListener("touchmove", onMove);
            window.removeEventListener("touchend", onUp);
        };
    }, [isDragging, handleSeek]);

    const formatTime = (ms: number) => {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        return `${m}:${(s % 60).toString().padStart(2, '0')}`;
    };

    const progress = (currentTime / totalDuration) * 100;

    return {
        trackRef,
        isDragging,
        setIsDragging,
        handleSeek,
        formatTime,
        progress
    };
};
