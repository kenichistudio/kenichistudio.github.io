import React from "react";

interface EffectControlProps {
    label: string;
    activeId?: string;
    options: { id: string; name: string }[];
    onChange: (id: string | undefined) => void;
}

export const EffectControl: React.FC<EffectControlProps> = ({ label, activeId, options, onChange }) => {
    return (
        <div className="space-y-2">
            <span className="text-xs font-bold uppercase text-slate-500">{label}</span>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onChange(undefined)}
                    className={`px-3 py-1.5 text-xs rounded-full border transition-all ${!activeId
                            ? "bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-black"
                            : "bg-transparent border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                >
                    None
                </button>
                {options.map(opt => (
                    <button
                        key={opt.id}
                        onClick={() => onChange(opt.id)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${activeId === opt.id
                                ? "bg-accent text-white border-accent"
                                : "bg-transparent border-slate-200 text-slate-500 hover:border-slate-300"
                            }`}
                    >
                        {opt.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
