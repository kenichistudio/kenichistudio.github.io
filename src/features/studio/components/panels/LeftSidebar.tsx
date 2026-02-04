import React, { useState } from "react";
import {
    Type,
    Image as ImageIcon,
    Square,
    ChevronLeft,
    MonitorPlay,
    LayoutGrid,
    X
} from "lucide-react";
import { Engine } from "../../../../engine/Core";
import { TEXT_OPTIONS, createText } from "../../config/textOptions";
import { SHAPE_OPTIONS, createShape } from "../../config/shapeOptions";
import { CODE_OPTIONS, createCode } from "../../config/codeOptions";
import { CHART_TYPES, createChart } from "../../config/chartOptions";

interface SidebarProps {
    engine: Engine | null;
    isMobileSheet?: boolean;
    mobileActiveTab?: Tab;
    allowedTabs?: Tab[];
}

import { SquareAd } from "../../../../components/ads/SquareAd";

export type Tab = "templates" | "text" | "media" | "shapes" | null;

export const LeftSidebar = ({ engine, isMobileSheet = false, mobileActiveTab, allowedTabs }: SidebarProps) => {
    const defaultTab = allowedTabs && allowedTabs.length > 0 ? allowedTabs[0] : "text";
    const [localActiveTab, setLocalActiveTab] = useState<Tab>(defaultTab);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Use controlled tab on mobile, otherwise local state
    const activeTab = (isMobileSheet && mobileActiveTab) ? mobileActiveTab : localActiveTab;

    const handleTabClick = (tab: Tab) => {
        if (localActiveTab === tab) {
            setLocalActiveTab(null); // Toggle close
            setIsMobileMenuOpen(false);
        } else {
            setLocalActiveTab(tab);
        }
    };

    const getNextName = (base: string) => {
        if (!engine) return base;
        let count = 1;
        // Regex to find "Base N" pattern
        const regex = new RegExp(`^${base} (\\d+)$`);

        const existingNumbers = engine.scene.objects
            .map(o => {
                const match = o.name.match(regex);
                return match ? parseInt(match[1]) : 0;
            })
            .filter(n => n > 0);

        if (existingNumbers.length > 0) {
            count = Math.max(...existingNumbers) + 1;
        }

        // If "Base" itself exists but not "Base 1", we might want to start at 2?
        // Or simpler: just count how many objects start with "Base"
        // Let's stick to the gap-filling or max method.
        // If "Heading" exists, next is "Heading 1"? Or "Heading 2"?
        // Used asked for "Heading 1", "Heading 2".

        // Let's start with "Heading 1" always if "Heading" isn't taken? 
        // Or if user just clicks add, it should be "Heading 1", then "Heading 2".

        return `${base} ${count}`;
    };







    return (
        <div className="flex h-full z-10 shadow-xl shadow-slate-200 dark:shadow-neutral-900/50 relative">
            {/* 1. Slim Activity Bar - Hide on Mobile Sheet */}
            {!isMobileSheet && (
                <aside className={`w-16 bg-white dark:bg-app-surface border-r border-slate-200 dark:border-app-border flex flex-col items-center py-4 gap-4 
            fixed left-0 top-12 bottom-0 z-[60] transition-transform duration-300 lg:static lg:h-full lg:translate-x-0 lg:z-auto
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    {(!allowedTabs || allowedTabs.includes("text")) && (
                        <button
                            onClick={() => handleTabClick("text")}
                            className={`p-3 rounded-xl transition-all ${activeTab === "text" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-app-surface-hover"}`}
                            title="Typography"
                        >
                            <Type size={22} />
                        </button>
                    )}
                    {(!allowedTabs || allowedTabs.includes("media")) && (
                        <button
                            onClick={() => handleTabClick("media")}
                            className={`p-3 rounded-xl transition-all ${activeTab === "media" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-app-surface-hover"}`}
                            title="Charts & Media"
                        >
                            <ImageIcon size={22} />
                        </button>
                    )}
                    {(!allowedTabs || allowedTabs.includes("shapes")) && (
                        <button
                            onClick={() => handleTabClick("shapes")}
                            className={`p-3 rounded-xl transition-all ${activeTab === "shapes" ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "text-slate-500 hover:bg-slate-100 dark:hover:bg-app-surface-hover"}`}
                            title="Shapes & Code"
                        >
                            <Square size={22} />
                        </button>
                    )}

                    <div className="flex-1" />

                    {/* Ad Spot - Sponsor Slot */}
                    <div className="w-12 h-12 mb-2 bg-slate-100 dark:bg-app-surface rounded-lg flex flex-col items-center justify-center border border-slate-200 dark:border-app-border overflow-hidden cursor-pointer group hover:border-blue-300 transition-colors">
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">AD</span>
                        <div className="w-6 h-4 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-sm group-hover:scale-110 transition-transform"></div>
                    </div>

                    <button
                        onClick={() => {
                            setLocalActiveTab(null);
                            setIsMobileMenuOpen(false);
                        }}
                        className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Collapse"
                    >
                        <ChevronLeft size={20} className={`transition-transform ${!activeTab ? "rotate-180" : ""}`} />
                    </button>
                </aside>
            )}


            {/* Mobile Toggle Button (FAB) - Hide if in sheet */}
            {!isMobileSheet && (
                <button
                    onClick={() => {
                        if (isMobileMenuOpen) {
                            setIsMobileMenuOpen(false);
                            setLocalActiveTab(null);
                        } else {
                            setIsMobileMenuOpen(true);
                        }
                    }}
                    className={`
                    lg:hidden fixed bottom-6 right-4 z-[100] p-4 rounded-full shadow-2xl transition-all duration-300
                    flex items-center justify-center border border-slate-200 dark:border-slate-700
                    ${isMobileMenuOpen
                            ? "bg-white text-slate-900 dark:bg-app-surface dark:text-white"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }
                `}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <LayoutGrid size={24} />}
                </button>
            )}

            {/* 2. Expandable Drawer */}
            {activeTab && (
                <>
                    {/* Backdrop for mobile overlay - Hide if in sheet */}
                    {!isMobileSheet && (
                        <div
                            className="fixed inset-0 z-40 lg:hidden bg-black/50 animate-in fade-in duration-200"
                            onClick={() => {
                                setLocalActiveTab(null);
                                setIsMobileMenuOpen(false);
                            }}
                        />
                    )}

                    <aside className={`
                        bg-slate-50 dark:bg-app-bg border-r border-slate-200 dark:border-app-border flex flex-col animate-in slide-in-from-left-4 duration-200
                        ${isMobileSheet ? 'w-full h-full relative border-none shadow-none z-0' : 'w-64 sm:w-72 fixed left-16 top-12 bottom-0 z-50 shadow-2xl lg:shadow-none lg:static lg:h-full'}
                    `}>
                        <div className="p-4 border-b border-slate-200 dark:border-app-border flex justify-between items-center bg-white/50 dark:bg-app-surface/50 backdrop-blur-sm">
                            <span className="font-bold text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                {activeTab === "text" && "Typography"}
                                {activeTab === "media" && "Charts & Data"}
                                {activeTab === "shapes" && "Shapes & Assets"}
                            </span>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-6">

                            {activeTab === "text" && (
                                <div className="space-y-4">
                                    <div className="text-xs font-bold text-slate-400 text-center mb-4">Click to add to canvas</div>
                                    {TEXT_OPTIONS.map((opt) => {
                                        const Icon = opt.icon;
                                        return (
                                            <button
                                                key={opt.type}
                                                onClick={() => {
                                                    if (engine) createText(engine, opt.type);
                                                    if (window.innerWidth < 1100) setLocalActiveTab(null);
                                                }}
                                                className={`w-full text-left p-6 rounded-xl shadow-sm border transition-all group relative overflow-hidden
                                                    ${opt.bgClass} 
                                                    ${opt.type === 'particle'
                                                        ? 'hover:scale-105 hover:shadow-md border-violet-200 dark:border-violet-900/30'
                                                        : 'bg-white dark:bg-app-surface border-slate-200 dark:border-app-border hover:scale-105 hover:shadow-md'
                                                    }
                                                `}
                                            >
                                                {opt.type === 'particle' && (
                                                    <div className="absolute right-4 top-4 text-violet-500 opacity-20 group-hover:opacity-100 transition-opacity">
                                                        <Icon size={24} />
                                                    </div>
                                                )}
                                                <span className={`block mb-2 font-black ${opt.type === 'heading' ? 'text-4xl' : opt.type === 'subheading' ? 'text-xl font-medium' : 'text-2xl'} ${opt.colorClass}`}>
                                                    {opt.label}
                                                </span>
                                                <span className={`text-xs block ${opt.type === 'particle' ? 'text-violet-600/70 dark:text-violet-400/70' : 'text-slate-400'}`}>
                                                    {opt.description}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {activeTab === "media" && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {CHART_TYPES.map((chart) => {
                                            const Icon = chart.icon;
                                            return (
                                                <button
                                                    key={chart.type}
                                                    onClick={() => {
                                                        if (engine) createChart(engine, chart.type);
                                                        if (window.innerWidth < 1100) setLocalActiveTab(null);
                                                    }}
                                                    className="aspect-square bg-white dark:bg-app-surface rounded-xl border border-slate-200 dark:border-app-border flex flex-col items-center justify-center hover:bg-blue-50 dark:hover:bg-app-surface-hover hover:border-blue-200 transition-all gap-3 group"
                                                >
                                                    <Icon size={24} className={`${chart.colorClass} group-hover:scale-110 transition-transform`} />
                                                    <span className="text-[10px] font-bold text-slate-600 dark:text-neutral-400">{chart.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {activeTab === "shapes" && (
                                <div className="space-y-4">
                                    {CODE_OPTIONS.map((opt) => (
                                        <button
                                            key={opt.type}
                                            onClick={() => {
                                                if (engine) createCode(engine, opt.type);
                                                if (window.innerWidth < 1100) setLocalActiveTab(null);
                                            }}
                                            className="w-full text-left p-1 bg-slate-900 dark:bg-app-surface rounded-xl shadow-lg hover:ring-2 ring-blue-500 transition-all group overflow-hidden"
                                        >
                                            <div className="bg-slate-800/50 p-2 flex gap-1.5 border-b border-white/5">
                                                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            </div>
                                            <div className="p-4 font-mono text-xs">
                                                <span className="text-blue-400">console</span>
                                                <span className="text-white">.log(</span>
                                                <span className="text-green-400">'Code Block'</span>
                                                <span className="text-white">)</span>
                                            </div>
                                        </button>
                                    ))}

                                    {SHAPE_OPTIONS.map((opt) => {
                                        const Icon = opt.icon;
                                        return (
                                            <button
                                                key={opt.type}
                                                onClick={() => {
                                                    if (engine) createShape(engine, opt.type);
                                                    if (window.innerWidth < 1100) setLocalActiveTab(null);
                                                }}
                                                className="w-full text-left p-4 bg-white dark:bg-app-surface rounded-xl shadow-sm border border-slate-200 dark:border-app-border hover:scale-105 hover:shadow-md transition-all group flex items-center gap-4"
                                            >
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${opt.iconBgClass} ${opt.iconColorClass}`}>
                                                    <Icon size={24} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900 dark:text-white">{opt.label}</div>
                                                    <div className="text-xs text-slate-500 dark:text-neutral-400">{opt.description}</div>
                                                </div>
                                            </button>
                                        );
                                    })}

                                    <div className="text-center text-xs text-slate-400 mt-2">More shapes coming soon...</div>
                                </div>
                            )}

                        </div>

                        <div className="mt-auto pt-4">
                            <SquareAd />
                        </div>
                    </aside>
                </>
            )
            }
        </div >
    );
};
