import React, { useEffect, useState, useRef } from "react";
import { TextObject } from "@core/objects/TextObject";
import { CodeBlockObject } from "@core/objects/CodeBlockObject";
import { CharacterObject } from "@core/objects/CharacterObject";
import { ControlRow, ColorPicker } from "../../ui/InspectorUI";

import { CanvasSettings } from "../../../settings/CanvasSettings";
import { MobilePropertyContainer } from "../../ui/InspectorUI";
import { useStudio } from "../../../context/StudioContext";

interface EditDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export const EditDrawer: React.FC<EditDrawerProps> = ({ isOpen, onClose }) => {
    // Force Update for reactivity
    const [_, setForceUpdate] = useState(0);
    const { engine, selectedId } = useStudio();

    // Text Specific State
    const [initialEditText, setInitialEditText] = useState("");
    const textInputRef = useRef<HTMLTextAreaElement>(null);

    // Subscribe to engine changes
    useEffect(() => {
        if (!engine) return;
        const onUpdate = () => setForceUpdate(n => n + 1);
        const unsub = engine.on('objectChange', onUpdate);
        return unsub;
    }, [engine]);

    // Initialize Text Edit State when opening
    useEffect(() => {
        if (isOpen && engine && selectedId) {
            const obj = engine.scene.get(selectedId);
            if (obj instanceof TextObject) {
                setInitialEditText(obj.text);
                setTimeout(() => {
                    if (textInputRef.current) {
                        textInputRef.current.focus();
                        textInputRef.current.setSelectionRange(textInputRef.current.value.length, textInputRef.current.value.length);
                    }
                }, 100);
            }
        }
    }, [isOpen, selectedId, engine]);


    if (!engine) return null;

    // 0. Canvas Settings (No Object Selected)
    if (!selectedId) {
        return (
            <div className="flex flex-col h-full bg-slate-100 dark:bg-app-bg">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-app-border bg-white dark:bg-app-surface shadow-sm z-10 shrink-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Canvas Settings</span>
                    <button
                        onClick={onClose}
                        className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full active:scale-95 transition-transform"
                    >
                        Done
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    <CanvasSettings
                        onUpdate={() => setForceUpdate(n => n + 1)}
                        variant="mobile"
                    />
                </div>
            </div>
        );
    }

    const obj = engine.scene.get(selectedId);
    if (!obj) return null;

    const handleChange = (key: string, value: any) => {
        if (!obj) return;
        (obj as any)[key] = value;
        engine.render();
        setForceUpdate(n => n + 1);
    };

    // 1. Text Object: YT Create Style Full Screen Editor (Mobile Optimized)
    if (obj instanceof TextObject) {
        return (
            <div className="flex flex-col h-[40dvh] min-h-[250px] bg-black/60 fixed top-24 left-4 right-4 z-50 rounded-3xl shadow-2xl border border-white/10 ring-1 ring-black/5">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-transparent shrink-0">
                    <button
                        onClick={() => {
                            // Cancel: Revert text and close
                            handleChange("text", initialEditText);
                            onClose();
                        }}
                        className="px-3 py-2 text-sm font-bold text-white/70 hover:text-white transition-colors"
                    >
                        Cancel
                    </button>

                    <span className="text-sm font-bold text-white">Edit Text</span>

                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-full transition-colors shadow-sm active:scale-95"
                    >
                        Done
                    </button>
                </div>

                {/* Editor Area - Top Aligned for Virtual Keyboard safety */}
                <div className="flex-1 w-full flex flex-col justify-start pt-12 relative overflow-hidden">
                    <textarea
                        ref={textInputRef}
                        className="w-full flex-1 max-w-2xl bg-transparent border-none text-center text-3xl md:text-4xl font-bold text-white placeholder:text-slate-600 outline-none resize-none mx-auto leading-relaxed selection:bg-indigo-500/30 px-6 py-4"
                        value={obj.text}
                        onChange={(e) => handleChange("text", e.target.value)}
                        placeholder="Type something..."
                        style={{ fontFamily: obj.fontFamily }}
                    />
                </div>
            </div>
        );
    }

    // 2. Code Block: Code Editor
    if (obj instanceof CodeBlockObject) {
        return (
            <div className="flex flex-col h-[40dvh] min-h-[250px] bg-white dark:bg-slate-900 fixed top-24 left-4 right-4 z-50 rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 ring-1 ring-black/5">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-transparent shrink-0">
                    <span className="text-sm font-bold text-slate-900 dark:text-white pl-2">Edit Code</span>
                    <button
                        onClick={onClose}
                        className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-full active:scale-95 transition-transform"
                    >
                        Done
                    </button>
                </div>
                <div className="flex-1 p-4 bg-transparent relative overflow-hidden">
                    <textarea
                        className="w-full h-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl p-4 text-slate-900 dark:text-white text-xs font-mono focus:border-indigo-500 outline-none resize-none"
                        value={obj.code}
                        onChange={(e) => handleChange("code", e.target.value)}
                        spellCheck={false}
                        autoFocus
                    />
                </div>
            </div>
        );
    }

    // 3. Character Properties (Mobile View)
    if (obj instanceof CharacterObject) {
        return (
            <div className="p-6 space-y-6">
                {/* Header for context */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-app-border">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Character Settings</span>
                </div>

                <ControlRow label="Animation">
                    <select
                        className="w-full bg-slate-100 dark:bg-app-surface text-slate-900 dark:text-white rounded-lg p-3 text-sm outline-none"
                        value={obj.currentAnimation}
                        onChange={(e) => handleChange("currentAnimation", e.target.value)}
                    >
                        <option value="idle">Idle</option>
                        <option value="wave">Wave</option>
                        <option value="think">Thinking</option>
                        <option value="walk">Walking</option>
                        <option value="explain">Explain</option>
                    </select>
                </ControlRow>
                <ControlRow label="Costume">
                    <select
                        className="w-full bg-slate-100 dark:bg-app-surface text-slate-900 dark:text-white rounded-lg p-3 text-sm outline-none"
                        value={obj.costume}
                        onChange={(e) => handleChange("costume", e.target.value)}
                    >
                        <option value="casual">Casual</option>
                        <option value="suit">Suit</option>
                        <option value="superhero">Superhero</option>
                    </select>
                </ControlRow>
                <ControlRow label="Colors" layout="vertical">
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1 items-center">
                            <span className="text-[9px] text-slate-400">Skin</span>
                            <ColorPicker value={obj.skinColor} onChange={(v) => handleChange("skinColor", v)} size="sm" />
                        </div>
                        <div className="flex flex-col gap-1 items-center">
                            <span className="text-[9px] text-slate-400">Hair</span>
                            <ColorPicker value={obj.hairColor} onChange={(v) => handleChange("hairColor", v)} size="sm" />
                        </div>
                        <div className="flex flex-col gap-1 items-center">
                            <span className="text-[9px] text-slate-400">Costume</span>
                            <ColorPicker value={obj.costumeColor} onChange={(v) => handleChange("costumeColor", v)} size="sm" />
                        </div>
                    </div>
                </ControlRow>
            </div>
        );
    }

    // Default / Fallback
    return (
        <div className="p-6 text-center text-slate-400">
            <span className="text-xs">No editable properties for this object.</span>
        </div>
    );
};
