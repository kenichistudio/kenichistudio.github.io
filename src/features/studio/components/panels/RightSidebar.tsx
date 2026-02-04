import React, { useState } from "react";
import { Engine } from "../../../../engine/Core";
import { useObjectProperties } from "../../hooks/useObjectProperties";
import { useObjectAnimations } from "../../hooks/useObjectAnimations";
import { LayersPanel } from "./LayersPanel";
import { CanvasSettings } from "../../settings/CanvasSettings";
import { TextSettings } from "../../settings/TextSettings";
import { CodeBlockSettings } from "../../settings/CodeBlockSettings";
import { ChartSettings } from "../../settings/ChartSettings";
import { BarChartRaceSettings } from "../../settings/BarChartRaceSettings";

import {
    PropertySection,
    ControlRow,
    Slider,
    SliderInput,
    ColorPicker,
    IconGrid,
    CompactControlRow
} from "../ui/InspectorUI";

import {
    RotateCcw,
    Copy,
    Trash2,
    Link2,
    Unlink2,
    Sparkles,
    Move,
    Palette,
    Layers,
    Type,
    Maximize2,
    ArrowLeft,
    ArrowRight,
    X,
    Keyboard,
    PanelLeftOpen,
    PanelRightOpen,
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    ArrowUp,
    ArrowDown,
    AlignHorizontalSpaceAround,
    AlignVerticalSpaceAround
} from "lucide-react";

// Object Types
import { TextObject } from "../../../../engine/objects/TextObject";
import { CodeBlockObject } from "../../../../engine/objects/CodeBlockObject";
import { ChartObject } from "../../../../engine/objects/ChartObject";
import { BarChartRaceObject } from "../../../../engine/objects/BarChartRaceObject";
import { CharacterObject } from "../../../../engine/objects/CharacterObject";
import { LogoCharacterObject } from "../../../../engine/objects/LogoCharacterObject";
import { ParticleTextObject } from "../../../../engine/objects/ParticleTextObject";

interface DesktopPropertiesPanelProps {
    engine: Engine | null;
    selectedId: string | null;
    onResize?: (w: number, h: number) => void;
    isExpanded?: boolean;
    onToggleExpand?: () => void;
}

type Tab = "properties" | "layers" | "animations";

export const RightSidebar: React.FC<DesktopPropertiesPanelProps> = ({ engine, selectedId, onResize, isExpanded, onToggleExpand }) => {
    const [activeTab, setActiveTab] = useState<Tab>("properties");

    // Use our new unified hook
    const {
        object,
        updateProperty,
        duplicateObject,
        deleteObject,
        isRatioLocked,
        setIsRatioLocked,
        renderTrigger
    } = useObjectProperties(engine, selectedId);

    // Force re-render when engine updates (via hook's renderTrigger)
    // The hook manages its own state updates, but we might need to pass it down to sub-components

    // --- Render Helpers ---

    // --- Alignment Helpers ---
    const handleAlign = (type: 'horizontal' | 'vertical') => {
        if (!object || !engine) return;
        const canvasWidth = engine.scene.width || 1920;
        const canvasHeight = engine.scene.height || 1080;

        if (type === 'horizontal') {
            const newX = (canvasWidth - object.width) / 2;
            updateProperty('x', newX);
        } else {
            const newY = (canvasHeight - object.height) / 2;
            updateProperty('y', newY);
        }
    };

    const handleNudge = (axis: 'x' | 'y', delta: number) => {
        if (!object) return;
        const current = (object as any)[axis] || 0;
        updateProperty(axis, current + delta);
    };

    const renderTransformSection = () => {
        if (!object) return null;
        return (
            <PropertySection title="Transform" defaultOpen={true}>
                {/* Position */}
                <ControlRow label="Position">
                    <div className="grid grid-cols-2 gap-2 mb-2">
                        <CompactControlRow label="X">
                            <input
                                type="number"
                                value={Math.round(object.x)}
                                onChange={(e) => updateProperty("x", Number(e.target.value))}
                                className="w-full bg-transparent text-xs font-mono outline-none"
                            />
                        </CompactControlRow>
                        <CompactControlRow label="Y">
                            <input
                                type="number"
                                value={Math.round(object.y)}
                                onChange={(e) => updateProperty("y", Number(e.target.value))}
                                className="w-full bg-transparent text-xs font-mono outline-none"
                            />
                        </CompactControlRow>
                    </div>

                    {/* Alignment & Nudge - New Feature */}
                    <div className="flex items-center gap-2 p-1 bg-slate-50 dark:bg-app-surface/50 rounded-lg border border-slate-100 dark:border-app-border">
                        {/* Alignment Buttons */}
                        <div className="flex flex-col gap-1 pr-2 border-r border-slate-200 dark:border-white/10">
                            <button
                                onClick={() => handleAlign('horizontal')}
                                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-indigo-500 transition-colors"
                                title="Center Horizontally"
                            >
                                <AlignHorizontalSpaceAround size={14} />
                            </button>
                            <button
                                onClick={() => handleAlign('vertical')}
                                className="p-1.5 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-indigo-500 transition-colors"
                                title="Center Vertically"
                            >
                                <AlignVerticalSpaceAround size={14} />
                            </button>
                        </div>

                        {/* Nudge Controls (Mini D-Pad) */}
                        <div className="flex-1 flex items-center justify-center gap-1">
                            <button onClick={() => handleNudge('x', -1)} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-indigo-500 transition-colors"><ArrowLeft size={14} /></button>
                            <div className="flex flex-col gap-1">
                                <button onClick={() => handleNudge('y', -1)} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-indigo-500 transition-colors"><ArrowUp size={14} /></button>
                                <button onClick={() => handleNudge('y', 1)} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-indigo-500 transition-colors"><ArrowDown size={14} /></button>
                            </div>
                            <button onClick={() => handleNudge('x', 1)} className="p-1 hover:bg-white dark:hover:bg-slate-700 rounded text-slate-500 hover:text-indigo-500 transition-colors"><ArrowRight size={14} /></button>
                        </div>
                    </div>
                </ControlRow>

                {/* Dimensions */}
                <ControlRow label="Dimensions">
                    <div className="grid grid-cols-2 gap-2">
                        <CompactControlRow label="W">
                            <input
                                type="number"
                                value={Math.round(object.width)}
                                onChange={(e) => updateProperty("width", Number(e.target.value))}
                                className="w-full bg-transparent text-xs font-mono outline-none"
                            />
                        </CompactControlRow>
                        <CompactControlRow label="H">
                            <input
                                type="number"
                                value={Math.round(object.height)}
                                onChange={(e) => updateProperty("height", Number(e.target.value))}
                                className="w-full bg-transparent text-xs font-mono outline-none"
                            />
                        </CompactControlRow>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        <button
                            className="flex items-center gap-2 text-[10px] text-slate-500 hover:text-indigo-500 transition-colors"
                            onClick={() => setIsRatioLocked(!isRatioLocked)}
                        >
                            {isRatioLocked ? <Link2 size={12} /> : <Unlink2 size={12} />}
                            <span>Constrain Proportions</span>
                        </button>

                        <button
                            onClick={() => { updateProperty("rotation", 0); }}
                            className="text-[10px] text-slate-400 hover:text-slate-700 underline decoration-dotted"
                        >
                            Reset
                        </button>
                    </div>
                </ControlRow>

                {/* Rotation & Opacity */}
                <ControlRow label="Rotation">
                    <SliderInput
                        value={Math.round(object.rotation || 0)}
                        min={-180} max={180}
                        onChange={(v) => updateProperty("rotation", v)}
                        formatValue={(v) => `${v}°`}
                    />
                </ControlRow>

                <ControlRow label="Opacity">
                    <SliderInput
                        value={object.opacity ?? 1}
                        min={0} max={1} step={0.01}
                        onChange={(v) => updateProperty("opacity", v)}
                        formatValue={(v) => `${Math.round(v * 100)}%`}
                    />
                </ControlRow>
            </PropertySection>
        );
    };

    const renderObjectSpecificSection = () => {
        if (!object || !engine) return null;

        // Text
        if (object instanceof TextObject) {
            return (
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50">
                    <TextSettings
                        object={object}
                        engine={engine}
                        variant="desktop"
                        section="all"
                    />
                </div>
            );
        }

        // Code
        if (object instanceof CodeBlockObject) {
            return (
                <CodeBlockSettings
                    object={object}
                    engine={engine}
                    variant="desktop"
                    onUpdate={() => { }}
                />
            );
        }

        // Charts
        if (object instanceof ChartObject) {
            return (
                <ChartSettings
                    object={object}
                    engine={engine}
                    onUpdate={() => { }}
                />
            );
        }

        if (object instanceof BarChartRaceObject) {
            return (
                <BarChartRaceSettings
                    object={object}
                    engine={engine}
                    onUpdate={() => { }}
                />
            );
        }

        // Character
        if (object instanceof CharacterObject) {
            return (
                <PropertySection title="Character" defaultOpen={true}>
                    <ControlRow label="Animation">
                        <select
                            className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-xs outline-none"
                            value={object.currentAnimation}
                            onChange={(e) => updateProperty("currentAnimation", e.target.value)}
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
                            className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-xs outline-none"
                            value={object.costume}
                            onChange={(e) => updateProperty("costume", e.target.value)}
                        >
                            <option value="casual">Casual</option>
                            <option value="suit">Business Suit</option>
                            <option value="superhero">Superhero</option>
                        </select>
                    </ControlRow>
                    <ControlRow label="Colors" layout="horizontal">
                        <ColorPicker value={object.skinColor} onChange={(v) => updateProperty("skinColor", v)} size="sm" />
                        <ColorPicker value={object.hairColor} onChange={(v) => updateProperty("hairColor", v)} size="sm" />
                        <ColorPicker value={object.costumeColor} onChange={(v) => updateProperty("costumeColor", v)} size="sm" />
                    </ControlRow>
                </PropertySection>
            );
        }

        // Particle Text
        if (object instanceof ParticleTextObject) {
            return (
                <PropertySection title="Particle Text" defaultOpen={true}>
                    <ControlRow label="Text">
                        <textarea
                            className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-xs border-transparent focus:border-indigo-500 outline-none resize-y min-h-[60px]"
                            value={object.text}
                            onChange={(e) => updateProperty("text", e.target.value)}
                        />
                    </ControlRow>
                    <ControlRow label="Effect">
                        <select
                            className="w-full bg-slate-100 dark:bg-slate-800 rounded-lg p-2 text-xs outline-none"
                            value={object.animType}
                            onChange={(e) => updateProperty("animType", e.target.value)}
                        >
                            <option value="none">Static</option>
                            <option value="explode">Explode</option>
                            <option value="vortex">Vortex</option>
                        </select>
                    </ControlRow>
                    <ControlRow label="Gap / Density">
                        <SliderInput
                            value={object.gap}
                            min={1} max={10}
                            onChange={(v) => updateProperty("gap", v)}
                        />
                    </ControlRow>
                    <ControlRow label="Color" layout="horizontal">
                        <ColorPicker value={object.color} onChange={(v) => updateProperty("color", v)} />
                    </ControlRow>
                </PropertySection>
            );
        }

        // Generic Color (if has color prop and not handled above)
        if ('color' in object && typeof (object as any).color === 'string') {
            return (
                <PropertySection title="Style">
                    <ControlRow label="Color" layout="horizontal">
                        <ColorPicker value={(object as any).color} onChange={(v) => updateProperty("color", v)} />
                    </ControlRow>
                </PropertySection>
            );
        }

        return null;
    };

    // --- Animation Logic (Unified Hook) ---
    const {
        updateAnimation,
        getAnimation,
        availableEnterAnimations,
        availableExitAnimations
    } = useObjectAnimations(engine, selectedId);

    const [activeAnimTab, setActiveAnimTab] = useState<'enter' | 'exit'>('enter');

    const renderAnimationsSection = () => {
        if (!object) {
            return (
                <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                    <Sparkles size={24} className="mb-2 opacity-50" />
                    <span className="text-xs">No Object Selected</span>
                </div>
            )
        }

        const currentList = activeAnimTab === 'enter' ? availableEnterAnimations : availableExitAnimations;
        const currentAnim = getAnimation(activeAnimTab);

        // Helper for consistent ID checking
        const currentAnimId = currentAnim?.type || 'none';

        return (
            <div className="space-y-4">
                {/* Animation Type Tabs */}
                <div className="flex p-1 bg-slate-100 dark:bg-app-surface border border-slate-200 dark:border-app-border rounded-xl">
                    <button
                        onClick={() => setActiveAnimTab('enter')}
                        className={`flex-1 py-1 px-3 text-xs font-bold rounded-lg transition-all ${activeAnimTab === 'enter'
                            ? "bg-white dark:bg-indigo-500 text-indigo-600 dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                    >
                        Enter
                    </button>
                    <button
                        onClick={() => setActiveAnimTab('exit')}
                        className={`flex-1 py-1 px-3 text-xs font-bold rounded-lg transition-all ${activeAnimTab === 'exit'
                            ? "bg-white dark:bg-indigo-500 text-indigo-600 dark:text-white shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                            }`}
                    >
                        Exit
                    </button>
                </div>

                <PropertySection title="Animation Type" defaultOpen={true}>
                    <div className="grid grid-cols-3 gap-2">
                        {currentList.map((anim) => {
                            const isActive = currentAnimId === anim.id;
                            return (
                                <button
                                    key={anim.id}
                                    onClick={() => updateAnimation(activeAnimTab, { type: anim.id })}
                                    className={`
                                        flex flex-col items-center justify-center gap-2 p-2 rounded-xl border transition-all aspect-square
                                        ${isActive
                                            ? "bg-indigo-50 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400"
                                            : "bg-slate-50 dark:bg-app-surface/50 border-transparent hover:border-slate-200 dark:hover:border-slate-700 text-slate-500"
                                        }
                                    `}
                                >
                                    <anim.icon size={20} />
                                    <span className="text-[10px] font-bold text-center leading-tight">{anim.label}</span>
                                </button>
                            )
                        })}
                    </div>
                </PropertySection>

                {currentAnimId !== 'none' && (
                    <PropertySection title="Timing" defaultOpen={true}>
                        <ControlRow label="Duration">
                            <SliderInput
                                value={currentAnim?.duration || 1000}
                                min={100} max={3000} step={50}
                                onChange={(v) => updateAnimation(activeAnimTab, { duration: v })}
                                formatValue={(v) => `${(v / 1000).toFixed(1)}s`}
                            />
                        </ControlRow>
                        {activeAnimTab === 'enter' && (
                            <ControlRow label="Delay">
                                <SliderInput
                                    value={currentAnim?.delay || 0}
                                    min={0} max={5000} step={100}
                                    onChange={(v) => updateAnimation(activeAnimTab, { delay: v })}
                                    formatValue={(v) => `${(v / 1000).toFixed(1)}s`}
                                />
                            </ControlRow>
                        )}
                    </PropertySection>
                )}
            </div>
        );
    };

    // --- Main Render ---

    return (
        <div className="flex flex-col h-full bg-white dark:bg-app-bg text-slate-900 dark:text-slate-200">
            {/* 1. Tabs & Toggles */}
            <div className="flex items-center gap-2 mx-4 mt-4 mb-4 shrink-0">
                <div className="flex-1 flex items-center p-1 bg-app-light-surface dark:bg-app-surface rounded-xl shadow-inner">
                    {(["properties", "layers", "animations"] as Tab[]).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                                flex-1 py-1.5 text-xs font-bold rounded-lg capitalize transition-all flex items-center justify-center gap-1.5
                                ${activeTab === tab
                                    ? "bg-white dark:bg-app-bg text-indigo-600 dark:text-indigo-400 shadow-sm transform scale-100"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
                                }
                            `}
                        >
                            {tab === 'properties' && <Move size={12} />}
                            {tab === 'layers' && <Layers size={12} />}
                            {tab === 'animations' && <Sparkles size={12} />}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Expansion Toggle */}
                {onToggleExpand && (
                    <button
                        onClick={onToggleExpand}
                        className="p-2 bg-app-light-surface dark:bg-app-surface hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-indigo-500 rounded-xl transition-colors shadow-sm"
                        title={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
                    >
                        {isExpanded ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
                    </button>
                )}
            </div>

            {/* 2. Content Area */}
            <div className="flex-1 overflow-y-auto px-4 pb-20 custom-scrollbar space-y-4">

                {activeTab === 'layers' && (
                    <LayersPanel engine={engine} selectedId={selectedId} />
                )}

                {activeTab === 'animations' && renderAnimationsSection()}

                {activeTab === 'properties' && (
                    <>
                        {!object ? (
                            // Empty State: Canvas Settings
                            <div className="animate-in slide-in-from-right-4 duration-300">
                                <PropertySection title="Canvas Settings" defaultOpen={true}>
                                    <CanvasSettings
                                        engine={engine}
                                        onResize={onResize}
                                        onUpdate={() => { }}
                                    />
                                </PropertySection>
                            </div>
                        ) : (
                            // Selected Object Properties
                            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                                {/* Header / Identity */}
                                <div className="flex items-center gap-2 pb-2 border-b border-app-light-border dark:border-app-border">
                                    <div className="flex-1">
                                        <label className="text-[9px] font-bold uppercase text-slate-400 block mb-1">Layer Name</label>
                                        <input
                                            value={object.name}
                                            onChange={(e) => updateProperty('name', e.target.value)}
                                            className="w-full bg-transparent text-sm font-bold text-slate-800 dark:text-white outline-none placeholder:text-slate-300"
                                            placeholder="Layer Name"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <button onClick={duplicateObject} className="p-2 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors" title="Duplicate">
                                            <Copy size={16} />
                                        </button>
                                        <button onClick={deleteObject} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>

                                {renderTransformSection()}
                                {renderObjectSpecificSection()}

                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
