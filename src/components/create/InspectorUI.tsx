import React, { useState } from "react";
import { ChevronDown, ChevronRight, Check } from "lucide-react";

// --- Types ---
interface PropertySectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
    rightElement?: React.ReactNode;
}

interface ControlRowProps {
    label: string;
    children: React.ReactNode;
    description?: string;
    layout?: "horizontal" | "vertical";
}

interface ToggleProps {
    value: boolean;
    onChange: (val: boolean) => void;
    label?: string;
}

interface SliderProps {
    value: number;
    min: number;
    max: number;
    step?: number;
    onChange: (val: number) => void;
    label?: string; // Optional label for the value display
    formatValue?: (val: number) => string;
}

interface SegmentedControlProps {
    options: { value: string; label?: string; icon?: React.ReactNode }[];
    value: string;
    onChange: (val: string) => void;
}

interface IconGridProps {
    options: { value: string; label: string; icon: React.ReactNode }[];
    value: string;
    onChange: (val: string) => void;
    cols?: number;
    size?: "sm" | "md";
}


// --- Components ---

export const PropertySection: React.FC<PropertySectionProps> = ({ title, children, defaultOpen = true, rightElement }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="inspector-section">
            <div
                className="inspector-section-header"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    {isOpen ? <ChevronDown size={14} className="text-slate-400" /> : <ChevronRight size={14} className="text-slate-400" />}
                    <span className="inspector-section-title">{title}</span>
                </div>
                {rightElement && <div onClick={e => e.stopPropagation()}>{rightElement}</div>}
            </div>
            {isOpen && (
                <div className="inspector-section-content">
                    {children}
                </div>
            )}
        </div>
    );
};

export const ControlRow: React.FC<ControlRowProps> = ({ label, children, description, layout = "vertical" }) => {
    return (
        <div className={`inspector-row ${layout}`}>
            <div className="inspector-label-container">
                <label className="inspector-label">{label}</label>
                {description && <span className="inspector-description">{description}</span>}
            </div>
            <div className={`inspector-control-container ${layout}`}>
                {children}
            </div>
        </div>
    );
};

export const Toggle: React.FC<ToggleProps> = ({ value, onChange, label }) => {
    return (
        <button
            className={`inspector-toggle ${value ? "active" : ""}`}
            onClick={() => onChange(!value)}
        >
            <span className="sr-only">{label || "Toggle"}</span>
            <span
                className={`inspector-toggle-thumb ${value ? "active" : ""}`}
            />
        </button>
    );
};

export const Slider: React.FC<SliderProps> = ({ value, min, max, step = 1, onChange, formatValue }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="inspector-slider group">
            {/* Track Background */}
            <div className="inspector-slider-track">
                {/* Fill */}
                <div
                    className="inspector-slider-fill"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* Thumb (Invisible but large hit area for touch) */}
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="inspector-slider-input"
            />

            {/* Visual Value Label (Optional floating or fixed) */}
            <div className="inspector-slider-label">
                {formatValue ? formatValue(value) : value}
            </div>

            {/* Always visible Value inside control if space allows, or specialized display */}
            <div
                className="inspector-slider-thumb"
                style={{ left: `calc(${percentage}% - 8px)` }}
            />
        </div>
    );
};

export const SliderInput: React.FC<SliderProps> = (props) => {
    return (
        <div className="inspector-slider-input-group">
            <div className="flex-1">
                <Slider {...props} />
            </div>
            <input
                type="number"
                value={props.value}
                onChange={(e) => props.onChange(Number(e.target.value))}
                className="inspector-input-number"
            />
        </div>
    )
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({ options, value, onChange }) => {
    return (
        <div className="inspector-segmented-control">
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`inspector-segmented-item ${isSelected ? "selected" : ""}`}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};

export const IconGrid: React.FC<IconGridProps> = ({ options, value, onChange, cols = 3, size = "md" }) => {
    return (
        <div className={`inspector-icon-grid grid grid-cols-${cols} gap-2`}>
            {options.map((option) => {
                const isSelected = value === option.value;
                return (
                    <button
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={`inspector-grid-item ${size} ${isSelected ? "selected" : ""}`}
                    >
                        <div className={`inspector-grid-item-icon ${size}`}>{option.icon}</div>
                        <span className={`inspector-grid-item-label ${size}`}>{option.label}</span>
                        {isSelected && <div className="inspector-grid-item-indicator" />}
                    </button>
                );
            })}
        </div>
    );
};
