import { create } from 'zustand';

interface StudioState {
    currentTime: number;
    totalDuration: number;
    isPlaying: boolean;

    // Actions
    setTime: (time: number) => void;
    setDuration: (duration: number) => void;
    setIsPlaying: (playing: boolean) => void;
}

export const useStudioStore = create<StudioState>((set) => ({
    currentTime: 0,
    totalDuration: 5000,
    isPlaying: false,

    setTime: (time) => set({ currentTime: time }),
    setDuration: (duration) => set({ totalDuration: duration }),
    setIsPlaying: (playing) => set({ isPlaying: playing }),
}));
