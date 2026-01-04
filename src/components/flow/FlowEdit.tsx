import React from 'react';
import { Sliders } from 'lucide-react';

interface FlowEditProps {
    selectedId: string | null;
    onUpdate: (id: string, prop: string, value: any) => void;
}

export const FlowEdit: React.FC<FlowEditProps> = ({ selectedId }) => {
    if (!selectedId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 p-8 text-center pb-24">
                <Sliders size={48} className="mb-4 opacity-20" />
                <p>Select an object to edit its properties.</p>
            </div>
        );
    }

    // Placeholder for properties - in a real app this would reflect the specific object types
    return (
        <div className="p-6 space-y-6 pb-24 overflow-y-auto h-full">
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider">Transform</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300">X Position</label>
                        <input type="range" className="w-full accent-blue-600" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300">Y Position</label>
                        <input type="range" className="w-full accent-blue-600" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300">Scale</label>
                        <input type="range" className="w-full accent-blue-600" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700 dark:text-neutral-300">Rotation</label>
                        <input type="range" className="w-full accent-blue-600" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider">Content</h3>
                <textarea
                    className="w-full bg-slate-100 dark:bg-neutral-800 border-none rounded-xl p-4 text-slate-900 dark:text-white resize-none h-24 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Edit text content..."
                    defaultValue="Visuals from Text"
                />
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-500 dark:text-neutral-500 uppercase tracking-wider">Appearance</h3>
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'].map(color => (
                        <button key={color} className="w-10 h-10 rounded-full border-2 border-white dark:border-neutral-700 shadow-sm flex-shrink-0" style={{ backgroundColor: color }} />
                    ))}
                </div>
            </div>
        </div>
    );
};
