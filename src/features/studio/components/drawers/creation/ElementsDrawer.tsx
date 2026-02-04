import React, { useState } from "react";
import { Engine } from "@core/Core";
import { ShapesDrawerContent } from "./ShapesDrawer";
import { CodeDrawerContent } from "./CodeDrawer";
import { Square, Terminal } from "lucide-react";

interface ElementsDrawerContentProps {
    engine: Engine | null;
    onClose: () => void;
}

import { BottomSheet } from "../../dock/BottomSheet";

export const ElementsDrawer: React.FC<ElementsDrawerContentProps & { isOpen: boolean }> = ({ engine, onClose, isOpen }) => {
    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title={undefined}
            initialSnap={0.5}
            snaps={[0.5, 0.95]}
            variant="dock"
        >
            <ElementsDrawerContent engine={engine} onClose={onClose} />
        </BottomSheet>
    );
};

export const ElementsDrawerContent: React.FC<ElementsDrawerContentProps> = ({ engine, onClose }) => {
    const [activeSubTab, setActiveSubTab] = useState<'shapes' | 'code'>('shapes');

    return (
        <div className="h-full flex flex-col">
            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {activeSubTab === 'shapes' ? (
                    <ShapesDrawerContent engine={engine} onClose={onClose} />
                ) : (
                    <CodeDrawerContent engine={engine} onClose={onClose} />
                )}
            </div>

            {/* Segmented Control - Simple Text Toggle */}
            <div className="px-4 pt-2 pb-4 flex justify-center gap-8 border-t border-slate-200 dark:border-white/5 bg-white dark:bg-[#1a1a1a]">
                <button
                    onClick={() => setActiveSubTab('shapes')}
                    className={`flex items-center gap-2 py-3 text-sm font-bold transition-colors ${activeSubTab === 'shapes'
                        ? 'text-accent dark:text-accent-light'
                        : 'text-slate-500 hover:text-slate-800 dark:text-gray-500 dark:hover:text-gray-300'
                        }`}
                >
                    <Square size={16} className={activeSubTab === 'shapes' ? "fill-current" : ""} />
                    <span>Shapes</span>
                </button>
                <button
                    onClick={() => setActiveSubTab('code')}
                    className={`flex items-center gap-2 py-3 text-sm font-bold transition-colors ${activeSubTab === 'code'
                        ? 'text-accent dark:text-accent-light'
                        : 'text-slate-500 hover:text-slate-800 dark:text-gray-500 dark:hover:text-gray-300'
                        }`}
                >
                    <Terminal size={16} className={activeSubTab === 'code' ? "fill-current" : ""} />
                    <span>Code</span>
                </button>
            </div>
        </div>
    );
};
