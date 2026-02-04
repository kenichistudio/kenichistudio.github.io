import React from "react";
import { Engine } from "@core/Core";
import { CODE_OPTIONS, createCode } from "../../../config/codeOptions";
import { BottomSheet } from "../../dock/BottomSheet";

interface CodeDrawerProps {
    engine: Engine | null;
    isOpen: boolean;
    onClose: () => void;
}

export const CodeDrawerContent: React.FC<{ engine: Engine | null; onClose: () => void }> = ({ engine, onClose }) => {
    const handleAdd = (type: any) => {
        if (!engine) return;
        createCode(engine, type);
        onClose();
    };

    return (
        <div className="grid grid-cols-2 gap-3 px-2">
            {CODE_OPTIONS.map((opt) => (
                <button
                    key={opt.type}
                    onClick={() => handleAdd(opt.type)}
                    className="w-full text-left bg-slate-900 border border-slate-800 dark:border-white/10 rounded-xl hover:ring-2 ring-accent transition-all group overflow-hidden flex flex-col h-full"
                >
                    <div className="bg-slate-800/50 p-2 flex gap-1.5 border-b border-white/5 shrink-0">
                        <div className="w-2 h-2 rounded-full bg-red-500/80"></div>
                        <div className="w-2 h-2 rounded-full bg-yellow-500/80"></div>
                        <div className="w-2 h-2 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="p-3 font-mono text-[10px] sm:text-xs leading-relaxed flex-1 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity">
                        <div>
                            <span className="text-blue-400">console</span>
                            <span className="text-white/60">.log(</span>
                            <span className="text-green-400">'Code'</span>
                            <span className="text-white/60">)</span>
                        </div>
                    </div>
                    <div className="px-2 pb-2 text-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{opt.label || 'Code Block'}</span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export const CodeDrawer: React.FC<CodeDrawerProps> = ({ engine, isOpen, onClose }) => {
    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Code Blocks"
            initialSnap={0.5}
            snaps={[0.5, 0.9]}
        >
            <CodeDrawerContent engine={engine} onClose={onClose} />
        </BottomSheet>
    );
};
