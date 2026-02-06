import React, { useEffect, useState } from "react";
import {
    Ban, Zap, ArrowUp, ArrowDown, Maximize, Minimize, Keyboard, LogIn, LogOut,
    ArrowLeft, ArrowRight // Added new requirements from shared hook if any
} from "lucide-react";
import { TextObject } from "@core/objects/TextObject";
import { Slider } from "../../ui/InspectorUI";
import { useObjectAnimations } from "../../../hooks/useObjectAnimations";
import { useStudio } from "../../../context/StudioContext";

interface MotionDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MotionDrawerContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const {
        updateAnimation,
        getAnimation,
        availableEnterAnimations,
        availableExitAnimations,
        renderTrigger
    } = useObjectAnimations();

    const { selectedId } = useStudio();

    const [activeTab, setActiveTab] = useState<'enter' | 'exit'>('enter');

    // Force re-render when hook updates
    useEffect(() => { }, [renderTrigger]);

    if (!selectedId) return null;

    const currentList = activeTab === 'enter' ? availableEnterAnimations : availableExitAnimations;
    const currentAnim = getAnimation(activeTab);
    const currentAnimId = currentAnim?.type || 'none';

    return (
        <div className="flex flex-col w-full h-[60vh] max-h-[500px]">
            {/* Content Area */}
            <div className="flex-1 p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">

                {/* 1. Timing Controls (Compact Grid) */}
                {currentAnimId !== 'none' && (
                    <div className="grid grid-cols-2 gap-6 pb-2 border-b border-slate-100 dark:border-app-border/50 shrink-0">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                                <span>Duration</span>
                                <span>{(currentAnim?.duration || 1000) / 1000}s</span>
                            </div>
                            <Slider
                                value={currentAnim?.duration || 1000}
                                min={100} max={3000} step={50}
                                onChange={(v) => updateAnimation(activeTab, { duration: v })}
                                compact
                            />
                        </div>
                        {activeTab === 'enter' && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                                    <span>Delay</span>
                                    <span>{(currentAnim?.delay || 0) / 1000}s</span>
                                </div>
                                <Slider
                                    value={currentAnim?.delay || 0}
                                    min={0} max={2000} step={100}
                                    onChange={(v) => updateAnimation(activeTab, { delay: v })}
                                    compact
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Motion Presets */}
                <div className="space-y-2">
                    {currentAnimId === 'none' && <span className="text-[10px] text-slate-400 font-bold uppercase block">Choose Animation</span>}

                    <div className="grid grid-cols-3 gap-3">
                        {currentList.map((anim) => {
                            const isActive = currentAnimId === anim.id;
                            return (
                                <button
                                    key={anim.id}
                                    onClick={() => updateAnimation(activeTab, { type: anim.id })}
                                    className={`flex flex-col items-center justify-center gap-2 px-2 py-3 rounded-xl border transition-all aspect-square ${isActive
                                        ? "bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-300 shadow-sm"
                                        : "bg-white dark:bg-app-surface border-slate-200 dark:border-app-border text-slate-400 hover:bg-slate-50 dark:hover:bg-app-surface-hover"
                                        }`}
                                >
                                    <anim.icon size={24} strokeWidth={2} />
                                    <span className="text-[10px] font-bold text-center leading-tight">{anim.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Tab Navigation */}
            <div className="flex p-1 bg-white dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-800 shrink-0 mt-auto">
                <button
                    onClick={() => setActiveTab('enter')}
                    className={`flex-1 py-3 flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === 'enter'
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                >
                    <LogIn size={20} strokeWidth={activeTab === 'enter' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium mt-1">Enter</span>
                </button>
                <div className="w-px my-2 bg-slate-100 dark:bg-neutral-800" />
                <button
                    onClick={() => setActiveTab('exit')}
                    className={`flex-1 py-3 flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === 'exit'
                        ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                >
                    <LogOut size={20} strokeWidth={activeTab === 'exit' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium mt-1">Exit</span>
                </button>
            </div>
        </div>
    );
};

export const MotionDrawer: React.FC<MotionDrawerProps> = ({ isOpen, onClose }) => {
    const { engine, selectedId } = useStudio();
    const obj = selectedId && engine ? engine.scene.get(selectedId) : null;
    if (!isOpen || !obj) return null;

    return (
        <div className="fixed bottom-16 left-0 right-0 z-[90] bg-white/95 dark:bg-app-surface/95 backdrop-blur-xl border-t border-slate-200 dark:border-app-border animate-in slide-in-from-bottom-full duration-300 shadow-xl pb-safe">
            <MotionDrawerContent onClose={onClose} />
        </div>
    );
};
