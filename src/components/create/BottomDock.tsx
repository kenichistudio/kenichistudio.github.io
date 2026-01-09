import React from "react";
import { Plus, SlidersHorizontal, Layers, Download, Check } from "lucide-react";

export type BottomDockTab = "assets" | "edit" | "layers" | "export" | null;

interface BottomDockProps {
    activeTab: BottomDockTab;
    onTabChange: (tab: BottomDockTab) => void;
    hasSelection: boolean;
}

export const BottomDock: React.FC<BottomDockProps> = ({ activeTab, onTabChange, hasSelection }) => {
    return (
        <div className="lg:hidden fixed bottom-6 left-4 right-4 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 ring-1 ring-black/5 flex items-center justify-between px-2 z-40 transition-transform duration-300">
            {/* Assets */}
            <button
                onClick={() => onTabChange(activeTab === "assets" ? null : "assets")}
                className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors ${activeTab === "assets" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`}
            >
                <div className={`p-2 rounded-full ${activeTab === "assets" ? "bg-indigo-100 dark:bg-indigo-900/50" : ""}`}>
                    <Plus size={20} />
                </div>
                <span className="text-[9px] font-bold">Add</span>
            </button>

            {/* Edit (Contextual) */}
            <button
                onClick={() => hasSelection && onTabChange(activeTab === "edit" ? null : "edit")}
                disabled={!hasSelection}
                className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-all ${!hasSelection ? "opacity-30 grayscale" : ""} ${activeTab === "edit" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`}
            >
                <div className={`p-2 rounded-full ${activeTab === "edit" ? "bg-indigo-100 dark:bg-indigo-900/50" : ""}`}>
                    <SlidersHorizontal size={20} />
                </div>
                <span className="text-[9px] font-bold">Edit</span>
            </button>

            {/* Layers */}
            <button
                onClick={() => onTabChange(activeTab === "layers" ? null : "layers")}
                className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors ${activeTab === "layers" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`}
            >
                <div className={`p-2 rounded-full ${activeTab === "layers" ? "bg-indigo-100 dark:bg-indigo-900/50" : ""}`}>
                    <Layers size={20} />
                </div>
                <span className="text-[9px] font-bold">Layers</span>
            </button>

            {/* Export */}
            <button
                onClick={() => onTabChange(activeTab === "export" ? null : "export")}
                className={`flex flex-col items-center justify-center w-14 h-full gap-1 transition-colors ${activeTab === "export" ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`}
            >
                <div className={`p-2 rounded-full ${activeTab === "export" ? "bg-indigo-100 dark:bg-indigo-900/50" : ""}`}>
                    <Download size={20} />
                </div>
                <span className="text-[9px] font-bold">Export</span>
            </button>
        </div>
    );
};
