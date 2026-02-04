import React from 'react';
import { Plus, Trash2, GripVertical } from 'lucide-react';


import { useAnimatorStore } from '../../store';

const DataEditor: React.FC = () => {
    const { barChartData, setBarChartData } = useAnimatorStore();
    const [isJsonMode, setIsJsonMode] = React.useState(false);
    const [jsonError, setJsonError] = React.useState<string | null>(null);
    const [jsonText, setJsonText] = React.useState('');

    // Sync JSON text when switching to JSON mode or when data changes externally (and we are not editing)
    React.useEffect(() => {
        if (!isJsonMode) {
            setJsonText(JSON.stringify(barChartData, null, 2));
        }
    }, [barChartData, isJsonMode]);

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newVal = e.target.value;
        setJsonText(newVal);
        try {
            const parsed = JSON.parse(newVal);
            if (Array.isArray(parsed)) {
                setBarChartData(parsed);
                setJsonError(null);
            } else {
                setJsonError('Data must be an array');
            }
        } catch (err) {
            setJsonError((err as Error).message);
        }
    };

    const handleAdd = () => {
        // Add a new mock frame
        const lastYear = barChartData[barChartData.length - 1]?.year || 2000;
        setBarChartData([...barChartData, {
            year: lastYear + 1,
            data: [
                { id: 'new', label: 'New Item', value: 100, color: '#FFFFFF' }
            ]
        }]);
    };

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-300">Data Source</h3>
                <div className="flex gap-2 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
                    <button
                        onClick={() => setIsJsonMode(false)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${!isJsonMode ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Visual
                    </button>
                    <button
                        onClick={() => setIsJsonMode(true)}
                        className={`text-xs px-2 py-1 rounded transition-colors ${isJsonMode ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        JSON
                    </button>
                </div>
            </div>

            {isJsonMode ? (
                <div className="space-y-2">
                    <textarea
                        className="w-full h-[calc(100vh-350px)] bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 p-3 rounded-lg focus:outline-none focus:border-sky-500/50 resize-none"
                        value={jsonText}
                        onChange={handleJsonChange}
                        spellCheck={false}
                    />
                    {jsonError ? (
                        <div className="text-xs text-red-400 p-2 bg-red-500/10 rounded border border-red-500/20">
                            Error: {jsonError}
                        </div>
                    ) : (
                        <div className="text-xs text-emerald-400 p-2 bg-emerald-500/10 rounded border border-emerald-500/20">
                            Valid JSON
                        </div>
                    )}
                </div>
            ) : (
                <>
                    <div className="flex justify-end">
                        <button className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 px-2 py-1 rounded transition-colors" onClick={handleAdd}>
                            + Add Year
                        </button>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid gap-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-2">
                        {barChartData.map((item) => (
                            <div key={item.year} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-3 group hover:border-sky-500/30 transition-all">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-mono text-slate-500">{item.year}</span>
                                    <button
                                        onClick={() => setBarChartData(barChartData.filter(d => d.year !== item.year))}
                                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-opacity"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {item.data.slice(0, 3).map((val, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: val.color }} />
                                            <span className="text-sm text-slate-300 flex-1 truncate">{val.label}</span>
                                            <span className="text-xs font-mono text-slate-500">{Math.round(val.value)}</span>
                                        </div>
                                    ))}
                                    {item.data.length > 3 && (
                                        <div className="text-xs text-slate-600 italic">
                                            + {item.data.length - 3} more items
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default DataEditor;


