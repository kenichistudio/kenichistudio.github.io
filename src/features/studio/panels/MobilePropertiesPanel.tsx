import React, { useState, useEffect } from "react";
import { Engine } from "@core/Core";
import { useObjectProperties } from "../hooks/useObjectProperties";
import { CanvasSettings } from "../settings/CanvasSettings";
import { CodeBlockSettings } from "../settings/CodeBlockSettings";
import {
    MobilePropertyContainer,
    MobileCategoryStrip,
    ControlRow,
    Slider,
    ColorPicker,
    Toggle
} from "../ui/InspectorUI";

import {
    Keyboard,
    User,
    Copy,
    Trash2,
    ArrowUp,
    ArrowDown,
    Palette,
    Scaling,
    Sparkles,
    Layers
} from "lucide-react";

// Objects
import { TextObject } from "@core/objects/TextObject";
import { CodeBlockObject } from "@core/objects/CodeBlockObject";
import { CharacterObject } from "@core/objects/CharacterObject";
import { ParticleTextObject } from "@core/objects/ParticleTextObject";

interface MobilePropertiesPanelProps {
    engine: Engine | null;
    selectedId: string | null;
    activeCategory: string; // Controlled by parent (BottomDock) usually
    onCategoryChange: (category: string) => void;
    onResize?: (w: number, h: number) => void;
}

export const MobilePropertiesPanel: React.FC<MobilePropertiesPanelProps> = ({
    engine,
    selectedId,
    activeCategory,
    onCategoryChange,
    onResize
}) => {

    const {
        object,
        updateProperty,
        duplicateObject,
        deleteObject,
        moveLayer,
        renderTrigger
    } = useObjectProperties(engine, selectedId);

    // Local state for specific mobile interactions like Text Editing
    const [isEditingText, setIsEditingText] = useState(false);
    const [initialEditText, setInitialEditText] = useState("");

    // --- Special Layouts ---

    // 1. No Object Selected -> Canvas Settings
    if (!object) {
        return (
            <MobilePropertyContainer>
                <div className="flex-1 overflow-y-auto p-6">
                    <CanvasSettings
                        engine={engine}
                        onResize={onResize}
                        onUpdate={() => { }}
                        variant="mobile"
                    />
                </div>
            </MobilePropertyContainer>
        );
    }

    // 2. Text Editing Mode (Full Screen Overlay)
    if (isEditingText && object instanceof TextObject) {
        return (
            <div className="fixed inset-0 z-[100] flex flex-col bg-slate-100 dark:bg-slate-900">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
                    <button
                        onClick={() => {
                            updateProperty("text", initialEditText);
                            setIsEditingText(false);
                        }}
                        className="px-3 py-2 text-sm font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                        Cancel
                    </button>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Edit Text</span>
                    <button
                        onClick={() => setIsEditingText(false)}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-full shadow-sm"
                    >
                        Done
                    </button>
                </div>

                {/* Editor Area */}
                <div className="flex-1 p-6 flex flex-col items-center justify-center relative">
                    <textarea
                        className="w-full h-full max-w-2xl bg-transparent border-none text-center text-3xl font-bold text-slate-900 dark:text-white placeholder:text-slate-300 outline-none resize-none mx-auto leading-relaxed"
                        value={object.text}
                        onChange={(e) => updateProperty("text", e.target.value)}
                        placeholder="Type something..."
                        style={{ fontFamily: object.fontFamily }}
                        autoFocus
                    />
                </div>
            </div>
        );
    }

    // 3. Main Property View

    // Define Categories based on object type
    // This replicates the logic from BottomDock basically, but we might want it here if we move fully to this panel
    // For now, we assume standard categories: style, transform, motion, layers

    return (
        <MobilePropertyContainer>
            {/* Header / Identity */}
            <div className="px-6 py-4 flex items-center justify-between bg-transparent">
                <span className="text-lg font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
                    {object.name || "Object"}
                </span>
                <div className="flex items-center gap-1">
                    <button onClick={duplicateObject} className="p-2 rounded-full text-slate-400 hover:text-indigo-500 bg-white dark:bg-slate-800 shadow-sm"><Copy size={16} /></button>
                    <button onClick={deleteObject} className="p-2 rounded-full text-slate-400 hover:text-red-500 bg-white dark:bg-slate-800 shadow-sm"><Trash2 size={16} /></button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {activeCategory === 'style' && (
                    <div className="space-y-4">
                        {/* Text Style */}
                        {object instanceof TextObject && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 flex items-center justify-between">
                                <span className="font-bold text-slate-700 dark:text-slate-200">Content</span>
                                <button
                                    onClick={() => { setInitialEditText(object.text); setIsEditingText(true); }}
                                    className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold flex items-center gap-2"
                                >
                                    <Keyboard size={16} /> Edit Text
                                </button>
                            </div>
                        )}

                        {/* Colors */}
                        {('color' in object || 'skinColor' in object) && (
                            <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-4">
                                <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Colors</span>
                                <div className="flex gap-4">
                                    {/* Generic Color */}
                                    {'color' in (object as any) && (
                                        <div className="flex flex-col gap-1 items-center">
                                            <span className="text-[10px] text-slate-400">Main</span>
                                            <ColorPicker value={(object as any).color} onChange={(v) => updateProperty("color", v)} />
                                        </div>
                                    )}
                                    {/* Character Colors */}
                                    {'skinColor' in (object as any) && (
                                        <>
                                            <div className="flex flex-col gap-1 items-center">
                                                <span className="text-[10px] text-slate-400">Skin</span>
                                                <ColorPicker value={(object as any).skinColor} onChange={(v) => updateProperty("skinColor", v)} />
                                            </div>
                                            <div className="flex flex-col gap-1 items-center">
                                                <span className="text-[10px] text-slate-400">Hair</span>
                                                <ColorPicker value={(object as any).hairColor} onChange={(v) => updateProperty("hairColor", v)} />
                                            </div>
                                            <div className="flex flex-col gap-1 items-center">
                                                <span className="text-[10px] text-slate-400">Costume</span>
                                                <ColorPicker value={(object as any).costumeColor} onChange={(v) => updateProperty("costumeColor", v)} />
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Opacity */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-2">Opacity</span>
                            <Slider
                                value={object.opacity ?? 1}
                                min={0} max={1} step={0.01}
                                onChange={(v) => updateProperty("opacity", v)}
                            />
                        </div>
                    </div>
                )}

                {activeCategory === 'transform' && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 space-y-4">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block">Transform</span>

                        <ControlRow label="Rotation">
                            <Slider value={(object as any).rotation || 0} min={-180} max={180} onChange={(v) => updateProperty("rotation", v)} />
                        </ControlRow>

                        <ControlRow label="Scale (Width)">
                            <Slider value={(object as any).width || 100} min={10} max={1000} onChange={(v) => updateProperty("width", v)} />
                        </ControlRow>
                    </div>
                )}

                {activeCategory === 'layers' && (
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4">
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200 block mb-2">Layer Order</span>
                        <div className="flex justify-between p-2 gap-4">
                            <button onClick={() => moveLayer('up')} className="flex-1 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <ArrowUp size={24} className="text-slate-500 dark:text-slate-300" />
                                <span className="text-xs font-bold text-slate-500">Bring Forward</span>
                            </button>
                            <button onClick={() => moveLayer('down')} className="flex-1 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                                <ArrowDown size={24} className="text-slate-500 dark:text-slate-300" />
                                <span className="text-xs font-bold text-slate-500">Send Backward</span>
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </MobilePropertyContainer>
    );
};
