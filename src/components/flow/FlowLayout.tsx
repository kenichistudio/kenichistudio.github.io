import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { FlowTabs, type FlowTab } from './FlowTabs';
import { FlowSelect } from './FlowSelect';
import { FlowEdit } from './FlowEdit';
import { FlowAnimate } from './FlowAnimate';
import { FlowExport } from './FlowExport';
import { Engine } from '../../engine/Core';
// We'll reuse CanvasWorkspace but wrapped with mobile styling
import { CanvasWorkspace } from '../create/CanvasWorkspace';
import { Settings } from 'lucide-react';

export const FlowLayout = () => {
    const [activeTab, setActiveTab] = useState<FlowTab>('select');
    const [engine, setEngine] = useState<Engine | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Initial Engine Setup (same as EditorLayout)
    useEffect(() => {
        if (!canvasRef.current) return;
        const newEngine = new Engine(canvasRef.current);
        setEngine(newEngine);
        return () => newEngine.dispose();
    }, []);

    // Layout enforcement
    const rootRef = useRef<HTMLDivElement>(null);
    useLayoutEffect(() => {
        if (rootRef.current) {
            rootRef.current.style.setProperty("height", "100%", "important");
            rootRef.current.style.setProperty("overflow", "hidden", "important");
        }
    }, []);

    const handleSelect = (type: string) => {
        // Todo: Add logic to add object to engine
        console.log('Selected', type);
        // For testing, let's ensure an object exists
        if (engine && engine.scene.objects.length === 0) {
            // Import CodeBlock dynamically or just assume it exists in window/registry?
            // checking imports... we need key access to Engine.
            // For now, let's look for existing objects or prompt user
        }
        setActiveTab('edit'); // Auto advance
    };

    const handleApplyPreset = (presetId: string) => {
        if (!engine || !engine.selectedObjectId) return;
        const obj = engine.scene.get(engine.selectedObjectId);
        if (!obj) return;

        // Map UI presets to Engine types
        const map: any = {
            'fade-in': 'fadeIn',
            'slide-up': 'slideUp',
            'pop': 'scaleIn',
            'typewriter': 'typewriter'
        };

        if (map[presetId]) {
            obj.animation = {
                type: map[presetId],
                duration: 1000,
                delay: 0
            };
            // Reset time to replay animation
            engine.seek(0);
            engine.play();
        }
    };

    return (
        <div ref={rootRef} className="flex flex-col h-full bg-slate-50 dark:bg-neutral-950">
            {/* Header */}
            <header className="h-14 px-4 flex items-center justify-between border-b border-slate-200 dark:border-neutral-800 flex-shrink-0 bg-white dark:bg-neutral-900">
                <div className="flex items-center gap-2">
                    <img src={`${import.meta.env.BASE_URL}flow-logo.png`} alt="Flow Logo" className="w-8 h-8 rounded-lg shadow-sm" />
                    <span className="font-bold text-slate-900 dark:text-white tracking-tight">Flow</span>
                </div>
                <button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-neutral-800 rounded-full transition-colors">
                    <Settings size={20} />
                </button>
            </header>

            {/* Main Area: Split into Top (Canvas) and Bottom (Tools) */}
            <div className="flex-1 flex flex-col relative overflow-hidden">

                {/* Canvas Area - Fixed Aspect Ratio or Flexible */}
                {/* Canvas Area - Fixed Height using VH for reliability on mobile */}
                {/* Canvas Area - Fixed Height using VH for reliability on mobile */}
                <div className={`${activeTab === 'select' ? 'hidden' : 'block'} h-[45vh] min-h-[350px] flex-shrink-0 bg-slate-100 dark:bg-black relative border-b border-slate-200 dark:border-neutral-800 z-0`}>
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                        <div className="aspect-square h-full w-auto shadow-2xl rounded-lg overflow-hidden border border-slate-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                            <canvas ref={canvasRef} className="w-full h-full block" width={1080} height={1080} />
                        </div>
                    </div>
                </div>

                {/* Bottom Sheet / Tool Area */}
                <div className="flex-1 bg-white dark:bg-neutral-900 relative z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.2)] rounded-t-3xl border-t border-slate-100 dark:border-neutral-800 overflow-hidden">
                    {/* Content Area */}
                    <div className="absolute inset-0 pb-24 overflow-y-auto">
                        {activeTab === 'select' && <FlowSelect onSelect={handleSelect} />}
                        {activeTab === 'edit' && <FlowEdit selectedId="mock-id" onUpdate={() => { }} />}
                        {activeTab === 'animate' && <FlowAnimate onApplyPreset={handleApplyPreset} />}
                        {activeTab === 'export' && <FlowExport onExport={(fmt, qual) => console.log(fmt, qual)} />}
                    </div>
                </div>

                {/* Tab Bar - High Z-Index to stay on top */}
                <div className="relative z-50">
                    <FlowTabs activeTab={activeTab} onTabChange={setActiveTab} />
                </div>
            </div>
        </div>
    );
};
