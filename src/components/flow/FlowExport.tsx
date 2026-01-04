import React from 'react';
import { Download, Film, Share2 } from 'lucide-react';

interface FlowExportProps {
    onExport: (format: 'mp4' | 'webm', quality: '4k' | '1080p') => void;
}

export const FlowExport: React.FC<FlowExportProps> = ({ onExport }) => {
    return (
        <div className="p-6 flex flex-col items-center justify-center h-full space-y-8 pb-24">

            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to Share?</h2>
                <p className="text-slate-500 dark:text-neutral-400">Export your creation in high quality.</p>
            </div>

            <div className="w-full max-w-sm space-y-4">
                <button
                    onClick={() => onExport('mp4', '4k')}
                    className="w-full flex items-center justify-center gap-3 p-5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 active:scale-95 transition-all"
                >
                    <Film size={24} />
                    <span className="font-bold text-lg">Export 4K Video</span>
                </button>

                <button
                    onClick={() => onExport('mp4', '1080p')}
                    className="w-full flex items-center justify-center gap-3 p-5 bg-white dark:bg-neutral-800 text-slate-900 dark:text-white border border-slate-200 dark:border-neutral-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-neutral-700 active:scale-95 transition-all"
                >
                    <Download size={24} />
                    <span className="font-bold text-lg">Export 1080p</span>
                </button>
            </div>

            <div className="pt-8">
                <button className="text-slate-500 dark:text-neutral-500 flex items-center gap-2 text-sm font-medium hover:text-slate-800 dark:hover:text-neutral-300 transition-colors">
                    <Share2 size={16} />
                    Share Project Link
                </button>
            </div>
        </div>
    );
};
