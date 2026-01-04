import React from 'react';
import { PlusSquare, Edit3, Sparkles, Download } from 'lucide-react';

export type FlowTab = 'select' | 'edit' | 'animate' | 'export';

interface FlowTabsProps {
    activeTab: FlowTab;
    onTabChange: (tab: FlowTab) => void;
}

export const FlowTabs: React.FC<FlowTabsProps> = ({ activeTab, onTabChange }) => {

    // Helper to allow generic tab matching
    const isActive = (tab: FlowTab) => activeTab === tab;

    return (
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-neutral-800 pb-6 pt-2 px-6">
            <div className="flex justify-between items-center max-w-md mx-auto h-20">
                <button
                    onClick={() => onTabChange('select')}
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive('select') ? 'text-blue-600 dark:text-blue-500' : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'}`}
                >
                    <PlusSquare size={24} strokeWidth={isActive('select') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Select</span>
                </button>

                <button
                    onClick={() => onTabChange('edit')}
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive('edit') ? 'text-blue-600 dark:text-blue-500' : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'}`}
                >
                    <Edit3 size={24} strokeWidth={isActive('edit') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Edit</span>
                </button>

                <button
                    onClick={() => onTabChange('animate')}
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive('animate') ? 'text-purple-600 dark:text-purple-500' : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'}`}
                >
                    <Sparkles size={24} strokeWidth={isActive('animate') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Animate</span>
                </button>

                <button
                    onClick={() => onTabChange('export')}
                    className={`flex flex-col items-center gap-1 transition-colors ${isActive('export') ? 'text-green-600 dark:text-green-500' : 'text-slate-400 dark:text-neutral-500 hover:text-slate-600 dark:hover:text-neutral-300'}`}
                >
                    <Download size={24} strokeWidth={isActive('export') ? 2.5 : 2} />
                    <span className="text-[10px] font-bold">Export</span>
                </button>
            </div>
        </div>
    );
};
