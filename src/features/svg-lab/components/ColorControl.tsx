import React from "react";

interface ColorControlProps {
    label: string;
    type: 'solid' | 'gradient';
    color: string;
    gradientStart: string;
    gradientEnd: string;
    onTypeChange: (type: 'solid' | 'gradient') => void;
    onColorChange: (val: string) => void;
    onGradientStartChange: (val: string) => void;
    onGradientEndChange: (val: string) => void;
}

export const ColorControl: React.FC<ColorControlProps> = (props) => {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-slate-500">{props.label}</span>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 text-[10px] font-bold">
                    <button
                        onClick={() => props.onTypeChange('solid')}
                        className={`px-3 py-1 rounded-md transition-all ${props.type === 'solid' ? "bg-white dark:bg-slate-600 shadow-sm" : "opacity-50 hover:opacity-100"}`}
                    >
                        Solid
                    </button>
                    <button
                        onClick={() => props.onTypeChange('gradient')}
                        className={`px-3 py-1 rounded-md transition-all ${props.type === 'gradient' ? "bg-white dark:bg-slate-600 shadow-sm" : "opacity-50 hover:opacity-100"}`}
                    >
                        Gradient
                    </button>
                </div>
            </div>

            {props.type === 'solid' ? (
                <div className="flex items-center gap-3">
                    <input
                        type="color"
                        value={props.color}
                        onChange={(e) => props.onColorChange(e.target.value)}
                        className="w-10 h-10 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                    />
                    <input
                        type="text"
                        value={props.color}
                        onChange={(e) => props.onColorChange(e.target.value)}
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-xs font-mono px-3 py-2 uppercase"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                        <label className="text-[10px] text-slate-400">Start</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={props.gradientStart}
                                onChange={(e) => props.onGradientStartChange(e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                            />
                            <input
                                type="text"
                                value={props.gradientStart}
                                onChange={(e) => props.onGradientStartChange(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-[10px] font-mono px-2 py-1.5 uppercase"
                            />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] text-slate-400">End</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={props.gradientEnd}
                                onChange={(e) => props.onGradientEndChange(e.target.value)}
                                className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent p-0"
                            />
                            <input
                                type="text"
                                value={props.gradientEnd}
                                onChange={(e) => props.onGradientEndChange(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg text-[10px] font-mono px-2 py-1.5 uppercase"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
