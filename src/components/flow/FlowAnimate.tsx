import React from 'react';
import { Play } from 'lucide-react';

interface FlowAnimateProps {
    onApplyPreset: (preset: string) => void;
}

const presets = [
    { id: 'fade-in', name: 'Fade In', description: 'Smoothly appear opacity' },
    { id: 'slide-up', name: 'Slide Up', description: 'Enter from bottom' },
    { id: 'pop', name: 'Pop', description: 'Scale bounce effect' },
    { id: 'typewriter', name: 'Typewriter', description: 'Character by character' },
    { id: 'blur-in', name: 'Blur In', description: 'Focus from blur' },
];

export const FlowAnimate: React.FC<FlowAnimateProps> = ({ onApplyPreset }) => {
    return (
        <div className="p-4 space-y-4 pb-24 overflow-y-auto h-full">
            {presets.map((preset) => (
                <button
                    key={preset.id}
                    onClick={() => onApplyPreset(preset.id)}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-xl hover:border-purple-500 dark:hover:border-purple-500 active:scale-[0.98] transition-all group"
                >
                    <div className="text-left">
                        <div className="font-bold text-slate-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{preset.name}</div>
                        <div className="text-xs text-slate-500 dark:text-neutral-400">{preset.description}</div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-neutral-700 flex items-center justify-center text-slate-400 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                        <Play size={14} fill="currentColor" />
                    </div>
                </button>
            ))}
        </div>
    );
};
