import React from 'react';
import { Type, Box, PieChart, Image as ImageIcon } from 'lucide-react';

interface FlowSelectProps {
    onSelect: (type: string, data?: any) => void;
}

const templates = [
    { id: 'text-basic', label: 'Basic Text', icon: Type, type: 'text' },
    { id: 'shape-box', label: 'Box Shape', icon: Box, type: 'shape' },
    { id: 'chart-pie', label: 'Pie Chart', icon: PieChart, type: 'chart', comingSoon: true },
    { id: 'image-upload', label: 'Image', icon: ImageIcon, type: 'image', comingSoon: true },
];

export const FlowSelect: React.FC<FlowSelectProps> = ({ onSelect }) => {
    return (
        <div className="p-4 grid grid-cols-2 gap-4 pb-24 overflow-y-auto h-full">
            {templates.map((t) => (
                <button
                    key={t.id}
                    onClick={() => !t.comingSoon && onSelect(t.type)}
                    className={`flex flex-col items-center justify-center p-6 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 rounded-2xl shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all group ${t.comingSoon ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
                >
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-neutral-700 flex items-center justify-center text-slate-600 dark:text-neutral-400 mb-3 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        <t.icon size={24} />
                    </div>
                    <span className="font-medium text-slate-900 dark:text-white">{t.label}</span>
                    {t.comingSoon && <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">Coming Soon</span>}
                </button>
            ))}
        </div>
    );
};
