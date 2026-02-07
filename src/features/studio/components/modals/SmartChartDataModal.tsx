import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { SmartChartObject, type DataPoint, type RaceDataPoint } from "../../../../core/objects/SmartChartObject";

interface SmartChartDataModalProps {
    isOpen: boolean;
    onClose: () => void;
    object: SmartChartObject;
}

interface ColumnMapping {
    label: string | null;
    value: string | null;
    time: string | null;
    group: string | null;
}

export const SmartChartDataModal: React.FC<SmartChartDataModalProps> = ({ isOpen, onClose, object }) => {
    const [rawData, setRawData] = useState("");
    const [parsedData, setParsedData] = useState<string[][]>([]);
    const [headers, setHeaders] = useState<string[]>([]);
    const [mapping, setMapping] = useState<ColumnMapping>({
        label: null,
        value: null,
        time: null,
        group: null
    });

    if (!isOpen) return null;

    // Detect CSV/TSV and parse
    const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value;
        setRawData(text);

        const rows = text.trim().split("\n").map(row => {
            // Check for tab or comma
            if (row.includes("\t")) return row.split("\t");
            return row.split(",");
        });

        if (rows.length > 0) {
            setHeaders(rows[0]);
            setParsedData(rows.slice(1));

            // Auto-guess mapping
            const newMapping = { ...mapping };
            rows[0].forEach(header => {
                const h = header.toLowerCase();
                if (h.includes("label") || h.includes("name") || h.includes("entity")) newMapping.label = header;
                if (h.includes("value") || h.includes("count") || h.includes("score")) newMapping.value = header;
                if (h.includes("year") || h.includes("time") || h.includes("date")) newMapping.time = header;
                if (h.includes("group") || h.includes("category") || h.includes("region")) newMapping.group = header;
            });
            setMapping(newMapping);
        }
    };

    const handleImport = () => {
        if (!mapping.label || !mapping.value) {
            alert("Please map at least Label and Value columns.");
            return;
        }

        const labelIdx = headers.indexOf(mapping.label);
        const valueIdx = headers.indexOf(mapping.value);
        const groupIdx = mapping.group ? headers.indexOf(mapping.group) : -1;
        const timeIdx = mapping.time ? headers.indexOf(mapping.time) : -1;

        // 1. Basic Data (Last snapshot or aggregated?)
        // If time exists, we likely want to generate raceData.

        const newData: DataPoint[] = [];
        const raceDataMap: Record<string, Record<string, number>> = {}; // year -> { id: value }

        parsedData.forEach((row, i) => {
            const label = row[labelIdx];
            const valStr = row[valueIdx];
            const group = groupIdx >= 0 ? row[groupIdx] : undefined;
            const time = timeIdx >= 0 ? row[timeIdx] : undefined;

            if (!label || !valStr) return;

            const value = parseFloat(valStr.replace(/[^0-9.-]+/g, ""));
            const id = label; // Simple ID for now

            // Add to basic data (if it's the latest year or just all unique items)
            // Strategy: Create unique items first
            let existing = newData.find(d => d.id === id);
            if (!existing) {
                newData.push({
                    id,
                    label,
                    value, // Will be updated by race logic if time exists
                    color: object.nodes.find(n => n.id === id)?.color || "#" + Math.floor(Math.random() * 16777215).toString(16),
                    group
                });
            }

            // If time exists, build raceData
            if (time) {
                // Ensure year exists
                if (!raceDataMap[time]) raceDataMap[time] = {};
                raceDataMap[time][id] = value;
            }
        });

        // Update Object
        if (timeIdx >= 0) {
            // Race Mode Data
            const sortedYears = Object.keys(raceDataMap).sort((a, b) => parseInt(a) - parseInt(b));
            const newRaceData: RaceDataPoint[] = sortedYears.map(year => ({
                year: parseInt(year),
                values: raceDataMap[year]
            }));
            object.raceData = newRaceData;

            // Set initial values to first year? Or just keep metadata?
            // Actually SmartChartObject.update() will handle values if we are in race mode.
            // But let's set initial values to the first year's values
            if (newRaceData.length > 0) {
                const firstYearVals = newRaceData[0].values;
                newData.forEach(d => {
                    if (firstYearVals[d.id] !== undefined) d.value = firstYearVals[d.id];
                });
            }
        } else {
            // Static Data - Clear race data
            object.raceData = [];
            // Values are already set from valid rows
        }

        object.setData(newData);
        onClose();
    };

    // Use Portal to render outside the sidebar context
    if (typeof document === "undefined") return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            {/* Modal Container */}
            <div
                className="bg-[#1e1e1e] w-full max-w-5xl h-[85vh] flex flex-col rounded-xl overflow-hidden shadow-2xl border border-[#333] ring-1 ring-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="h-12 px-4 border-b border-[#333] flex justify-between items-center bg-[#252525] select-none">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 cursor-pointer" onClick={onClose} />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        <span className="ml-3 text-sm font-semibold text-slate-200">Data Editor</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 font-mono">
                            {parsedData.length > 0 ? `${parsedData.length} Rows Parsed` : "Waiting for data..."}
                        </span>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* Input Area (Left) */}
                    <div className="w-[350px] flex flex-col border-r border-[#333] bg-[#1a1a1a]">
                        <div className="p-3 border-b border-[#333] bg-[#222]">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">1. Paste Data</h3>
                            <p className="text-[10px] text-slate-500 mt-1">
                                Copy header & rows from Excel, Sheets, or CSV.
                            </p>
                        </div>
                        <div className="flex-1 relative group">
                            <textarea
                                className="absolute inset-0 w-full h-full bg-[#111] text-slate-300 p-3 text-xs font-mono resize-none focus:outline-none focus:bg-[#0f0f0f] transition-colors leading-relaxed"
                                placeholder="Label, Value, Year, Group&#10;React, 80, 2020, Library&#10;Vue, 60, 2020, Framework&#10;Angular, 40, 2020, Framework&#10;..."
                                value={rawData}
                                onChange={handlePaste}
                                spellCheck={false}
                            />
                        </div>
                    </div>

                    {/* Preview & Mapping (Right) */}
                    <div className="flex-1 flex flex-col bg-[#1e1e1e]">
                        {/* Mapping Controls */}
                        <div className="flex flex-col border-b border-[#333] bg-[#222]">
                            <div className="p-3 border-b border-[#333] flex justify-between items-center">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">2. Map Columns</h3>
                                <button
                                    className="text-[10px] text-blue-400 hover:text-blue-300 underline"
                                    onClick={() => handlePaste({ target: { value: rawData } } as any)}
                                >
                                    Auto-Guess Mapping
                                </button>
                            </div>
                            <div className="p-4 grid grid-cols-4 gap-6">
                                {[
                                    { key: "label", label: "Label", req: true, desc: "Name/ID" },
                                    { key: "value", label: "Value", req: true, desc: "Number" },
                                    { key: "time", label: "Time", req: false, desc: "Year/Date" },
                                    { key: "group", label: "Group", req: false, desc: "Category" }
                                ].map(field => {
                                    const isMapped = !!mapping[field.key as keyof ColumnMapping];
                                    return (
                                        <div key={field.key} className="flex flex-col gap-1.5">
                                            <div className="flex justify-between items-baseline">
                                                <label className={`text-[11px] font-bold uppercase tracking-wider ${field.req ? 'text-slate-300' : 'text-slate-500'}`}>
                                                    {field.label} {field.req && <span className="text-red-400">*</span>}
                                                </label>
                                                <span className="text-[9px] text-slate-600 italic">{field.desc}</span>
                                            </div>
                                            <div className="relative">
                                                <select
                                                    className={`w-full appearance-none bg-[#333] text-xs p-2 pr-8 rounded border transition-colors outline-none cursor-pointer ${isMapped ? 'text-white border-blue-500/50 bg-blue-500/10' : 'text-slate-400 border-[#444] hover:border-[#555]'}`}
                                                    value={mapping[field.key as keyof ColumnMapping] || ""}
                                                    onChange={(e) => setMapping({ ...mapping, [field.key as keyof ColumnMapping]: e.target.value || null })}
                                                >
                                                    <option value="">-- Ignored --</option>
                                                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                                </select>
                                                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Table Preview */}
                        <div className="flex-1 overflow-auto bg-[#181818] relative">
                            {parsedData.length === 0 ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-600 gap-2 select-none pointer-events-none">
                                    <div className="text-4xl opacity-20">📊</div>
                                    <div className="text-sm font-medium">No Data Parsed</div>
                                    <div className="text-xs opacity-60">Paste CSV data on the left to begin</div>
                                </div>
                            ) : (
                                <table className="w-full text-left border-collapse text-xs table-fixed">
                                    <thead className="sticky top-0 z-10">
                                        <tr>
                                            {headers.map((h, i) => {
                                                // Highlight mapped columns
                                                const isMappedStr = Object.values(mapping).includes(h);
                                                return (
                                                    <th key={i} className={`p-2 border-b border-r border-[#333] font-mono text-[10px] uppercase tracking-wider truncate transition-colors ${isMappedStr ? 'bg-blue-900/20 text-blue-200 border-b-blue-500/30' : 'bg-[#252525] text-slate-500'}`}>
                                                        {h}
                                                    </th>
                                                );
                                            })}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#222]">
                                        {parsedData.slice(0, 50).map((row, i) => (
                                            <tr key={i} className="hover:bg-[#2a2a2a] group transition-colors">
                                                {row.map((cell, j) => (
                                                    <td key={j} className="p-2 border-r border-[#222] text-slate-300 truncate font-mono text-[11px] group-hover:text-white">
                                                        {cell}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                            {parsedData.length > 50 && (
                                <div className="p-2 text-center text-[10px] text-slate-500 italic border-t border-[#333] bg-[#1e1e1e]">
                                    Showing first 50 rows of {parsedData.length}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="h-14 px-6 border-t border-[#333] flex justify-between items-center bg-[#252525]">
                    <div className="text-[10px] text-slate-500">
                        Smart Chart Data Importer
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleImport}
                            disabled={!mapping.label || !mapping.value}
                            className={`px-6 py-2 text-xs font-bold rounded shadow-lg transition-all transform active:scale-95 ${(!mapping.label || !mapping.value) ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-blue-500/20'}`}
                        >
                            Import Data
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};
