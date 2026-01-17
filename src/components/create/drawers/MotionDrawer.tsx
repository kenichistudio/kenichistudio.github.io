import React, { useEffect, useState } from "react";
import { Engine } from "../../../engine/Core";
import { Ban, Zap, ArrowUp, ArrowDown, Maximize, Minimize, Keyboard, LogIn, LogOut } from "lucide-react";
import { TextObject } from "../../../engine/objects/TextObject";
import { Slider } from "../ui/InspectorUI";

interface MotionDrawerProps {
    engine: Engine | null;
    selectedId: string | null;
    isOpen: boolean;
    onClose: () => void;
}

export const MotionDrawerContent: React.FC<{ engine: Engine | null; selectedId: string | null; onClose: () => void }> = ({ engine, selectedId, onClose }) => {
    const [activeTab, setActiveTab] = useState<'enter' | 'exit'>('enter');
    const [forceUpdate, setForceUpdate] = useState(0);

    const obj = selectedId && engine ? engine.scene.get(selectedId) : null;

    if (!obj) return null;

    // Helper to update animation
    const updateAnim = (updates: Partial<any>) => {
        if (!obj || !engine) return;

        const targetProp = activeTab === 'enter' ? 'enterAnimation' : 'exitAnimation';

        // Ensure animation object exists
        if (!obj[targetProp]) obj[targetProp] = { type: 'none', duration: 1000, delay: 0 };

        Object.assign(obj[targetProp], updates);
        engine.render();
        setForceUpdate(n => n + 1);
    };

    const enterAnimations = [
        { id: 'none', label: 'None', icon: Ban },
        { id: 'fadeIn', label: 'Fade In', icon: Zap },
        { id: 'slideUp', label: 'Slide Up', icon: ArrowUp },
        { id: 'scaleIn', label: 'Pop In', icon: Maximize },
        { id: 'typewriter', label: 'Typewriter', icon: Keyboard },
    ];

    const exitAnimations = [
        { id: 'none', label: 'None', icon: Ban },
        { id: 'fadeOut', label: 'Fade Out', icon: Zap },
        { id: 'slideDown', label: 'Slide Down', icon: ArrowDown },
        { id: 'scaleOut', label: 'Pop Out', icon: Minimize },
    ];

    // Filter animations: Typewriter only for TextObject
    const currentList = activeTab === 'enter' ? enterAnimations : exitAnimations;
    const availableAnimations = (obj instanceof TextObject)
        ? currentList
        : currentList.filter(a => a.id !== 'typewriter');

    const currentAnim = activeTab === 'enter' ? obj.enterAnimation : obj.exitAnimation;

    return (
        <div className="flex flex-col w-full">
            {/* Content Area */}
            <div className="flex-1 p-6 flex flex-col gap-6">

                {/* 1. Timing Controls (Compact Grid) */}
                {currentAnim?.type && currentAnim.type !== 'none' && (
                    <div className="grid grid-cols-2 gap-6 pb-2 border-b border-slate-100 dark:border-app-border/50">
                        <div className="space-y-2">
                            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                                <span>Duration</span>
                                <span>{(currentAnim.duration || 1000) / 1000}s</span>
                            </div>
                            <Slider
                                value={currentAnim.duration || 1000}
                                min={100} max={3000}
                                onChange={(v) => updateAnim({ duration: v })}
                                compact
                            />
                        </div>
                        {activeTab === 'enter' && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase">
                                    <span>Delay</span>
                                    <span>{(currentAnim.delay || 0) / 1000}s</span>
                                </div>
                                <Slider
                                    value={currentAnim.delay || 0}
                                    min={0} max={2000}
                                    onChange={(v) => updateAnim({ delay: v })}
                                    compact
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* 2. Motion Presets */}
                <div className="space-y-2">
                    {(!currentAnim?.type || currentAnim.type === 'none') && <span className="text-[10px] text-slate-400 font-bold uppercase block">Choose Animation</span>}

                    <div className="flex overflow-x-auto gap-3 pb-2 no-scrollbar items-center">
                        {availableAnimations.map((anim) => {
                            const isActive = currentAnim?.type === anim.id || (!currentAnim?.type && anim.id === 'none');
                            return (
                                <button
                                    key={anim.id}
                                    onClick={() => updateAnim({ type: anim.id })}
                                    className={`flex flex-col items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all shrink-0 min-w-[80px] ${isActive
                                        ? "bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-300 shadow-sm"
                                        : "bg-white dark:bg-app-surface border-slate-200 dark:border-app-border text-slate-400 hover:bg-slate-50 dark:hover:bg-app-surface-hover"
                                        }`}
                                >
                                    <anim.icon size={20} strokeWidth={2} />
                                    <span className="text-[10px] font-bold">{anim.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Bottom Tab Navigation */}
            <div className="flex p-1 bg-white dark:bg-neutral-900 border-t border-slate-100 dark:border-neutral-800 shrink-0">
                <button
                    onClick={() => setActiveTab('enter')}
                    className={`flex-1 py-1 flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === 'enter'
                        ? "text-accent dark:text-accent-light"
                        : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        }`}
                >
                    <LogIn size={20} strokeWidth={activeTab === 'enter' ? 2.5 : 2} />
                    <span className="text-[10px] font-medium mt-1">Enter</span>
                </button>
                <div className="w-px my-2 bg-slate-100 dark:bg-neutral-800" />
                <button
                    onClick={() => setActiveTab('exit')}
                    className={`flex-1 py-1 flex flex-col items-center justify-center rounded-xl transition-all ${activeTab === 'exit'
                        ? "text-accent dark:text-accent-light"
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

export const MotionDrawer: React.FC<MotionDrawerProps> = ({ engine, selectedId, isOpen, onClose }) => {
    // Preserve old behavior for direct usage (if any)
    const obj = selectedId && engine ? engine.scene.get(selectedId) : null;
    if (!isOpen || !obj) return null;

    return (
        <div className="fixed bottom-16 left-0 right-0 z-[90] bg-white/95 dark:bg-app-surface/95 backdrop-blur-xl border-t border-slate-200 dark:border-app-border animate-in slide-in-from-bottom-full duration-300 shadow-xl pb-safe">
            <MotionDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />
        </div>
    );
};
