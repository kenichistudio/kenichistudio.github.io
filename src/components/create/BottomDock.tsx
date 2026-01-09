import React from "react";
import { Plus, SlidersHorizontal, Layers, Download, Type, Square, BarChart3, Terminal } from "lucide-react";

export type BottomDockTab = "assets" | "text" | "shapes" | "code" | "charts" | "edit" | "layers" | "export" | null;

interface BottomDockProps {
    activeTab: BottomDockTab;
    onTabChange: (tab: BottomDockTab) => void;
    hasSelection: boolean;
}

export const BottomDock: React.FC<BottomDockProps> = ({ activeTab, onTabChange, hasSelection }) => {

    const Button = ({ id, icon: Icon, label, disabled = false }: { id: BottomDockTab, icon: any, label: string, disabled?: boolean }) => (
        <button
            onClick={() => !disabled && onTabChange(activeTab === id ? null : id)}
            disabled={disabled}
            className={`flex flex-col items-center justify-center min-w-[3.5rem] h-full gap-1 transition-all
                ${disabled ? "opacity-30 grayscale" : ""} 
                ${activeTab === id ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 dark:text-slate-400"}`}
        >
            <div className={`p-2 rounded-full ${activeTab === id ? "bg-indigo-100 dark:bg-indigo-900/50" : ""}`}>
                <Icon size={20} />
            </div>
            <span className="text-[9px] font-bold whitespace-nowrap">{label}</span>
        </button>
    );

    return (
        <>
            <style>
                {`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                `}
            </style>
            <div className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800 flex items-center px-4 z-40 overflow-x-auto no-scrollbar gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] dark:shadow-none">

                {/* Text */}
                <Button id="text" icon={Type} label="Text" />

                {/* Shapes */}
                <Button id="shapes" icon={Square} label="Shapes" />

                {/* Code */}
                <Button id="code" icon={Terminal} label="Code" />

                {/* Charts */}
                <Button id="charts" icon={BarChart3} label="Charts" />

                <div className="w-px h-8 bg-slate-200 dark:bg-slate-800 shrink-0 mx-1" />

                {/* Edit */}
                <Button id="edit" icon={SlidersHorizontal} label="Edit" disabled={!hasSelection} />

                {/* Layers */}
                <Button id="layers" icon={Layers} label="Layers" />

                {/* Export button removed */}

            </div>
        </>
    );
};
