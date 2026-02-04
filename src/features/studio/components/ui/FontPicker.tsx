import React, { useState } from "react";
import { Check } from "lucide-react";

interface FontPickerProps {
    currentFont: string;
    onSelect: (font: string) => void;
}

const FONTS = [
    { name: "Inter", label: "Inter Standard" },
    { name: "Arial", label: "Arial Classic" },
    { name: "Roboto", label: "Roboto" },
    { name: "Open Sans", label: "Open Sans" },
    { name: "Montserrat", label: "Montserrat" },
    { name: "Lato", label: "Lato" },
    { name: "Poppins", label: "Poppins" },
    { name: "Oswald", label: "Oswald" },
    { name: "Playfair Display", label: "Playfair" },
    { name: "Lobster", label: "Lobster" },
    { name: "Pacifico", label: "Pacifico" },
    { name: "Comic Sans MS", label: "Comic Sans" },
    { name: "Impact", label: "Impact" },
    { name: "Courier New", label: "Courier" },
];

export const FontPicker: React.FC<FontPickerProps> = ({ currentFont, onSelect }) => {
    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-white/5 bg-slate-900 sticky top-0 z-10">
                <input
                    type="text"
                    placeholder="Search fonts..."
                    className="w-full bg-slate-800 text-white text-sm px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500 transition-all"
                />
            </div>
            <div className="flex-1 overflow-y-auto p-2 grid grid-cols-1 gap-1">
                {FONTS.map((font) => (
                    <button
                        key={font.name}
                        onClick={() => onSelect(font.name)}
                        className={`flex items-center justify-between p-3 rounded-xl transition-all group ${currentFont === font.name
                                ? "bg-blue-600/20 border border-blue-500/50"
                                : "hover:bg-slate-800 border border-transparent"
                            }`}
                    >
                        <span
                            className="text-lg text-white group-hover:text-blue-200 transition-colors"
                            style={{ fontFamily: font.name }}
                        >
                            {font.label}
                        </span>
                        {currentFont === font.name && <Check size={16} className="text-blue-400" />}
                    </button>
                ))}
            </div>
        </div>
    );
};
