import React from "react";
import { Engine } from "../../../../../engine/Core";
import { SHAPE_OPTIONS, createShape } from "../../../config/shapeOptions";
import { BottomSheet } from "../../dock/BottomSheet";

interface ShapesDrawerProps {
    engine: Engine | null;
    isOpen: boolean;
    onClose: () => void;
}

export const ShapesDrawerContent: React.FC<{ engine: Engine | null; onClose: () => void }> = ({ engine, onClose }) => {
    const handleAdd = (type: any) => {
        if (!engine) return;
        createShape(engine, type);
        onClose();
    };

    return (
        <div className="grid grid-cols-2 gap-3 px-2 pb-4">
            {/* Shapes Loop */}
            {SHAPE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                    <button
                        key={opt.type}
                        onClick={() => handleAdd(opt.type)}
                        className="group relative flex flex-col items-center justify-center gap-2 p-4 h-32 w-full bg-slate-50 dark:bg-neutral-800/50 rounded-2xl border border-slate-200 dark:border-white/5 hover:border-accent dark:hover:border-accent hover:bg-slate-100 dark:hover:bg-neutral-800 transition-all active:scale-95"
                    >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${opt.iconBgClass} ${opt.iconColorClass}`}>
                            <Icon size={20} />
                        </div>
                        <div className="text-center">
                            <div className="font-bold text-xs text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white">{opt.label}</div>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export const ShapesDrawer: React.FC<ShapesDrawerProps> = ({ engine, isOpen, onClose }) => {
    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title="Shapes & Assets"
            initialSnap={0.5}
            snaps={[0.5, 0.9]}
        >
            <ShapesDrawerContent engine={engine} onClose={onClose} />
        </BottomSheet>
    );
};
