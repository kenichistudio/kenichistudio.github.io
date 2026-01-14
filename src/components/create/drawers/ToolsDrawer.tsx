import React, { useMemo } from "react";
import { Engine } from "../../../engine/Core";
import { BottomSheet } from "../panels/BottomSheet";
import { AdjustDrawerContent } from "./AdjustDrawer";
import { MotionDrawerContent } from "./MotionDrawer";
import { StyleDrawerContent } from "./StyleDrawer";
import { FontDrawerContent } from "./FontDrawer";
import { SettingsDrawerContent } from "./SettingsDrawer";

interface ToolsDrawerProps {
    engine: Engine | null;
    selectedId: string | null;
    activeTab: string | null;
    onClose: () => void;
}

export const ToolsDrawer: React.FC<ToolsDrawerProps> = ({ engine, selectedId, activeTab, onClose }) => {

    // Determine if we should be open
    const isOpen = useMemo(() => {
        return ['adjust', 'motion', 'style', 'font', 'settings'].includes(activeTab || '');
    }, [activeTab]);

    const title = useMemo(() => {
        switch (activeTab) {
            case 'adjust': return 'Adjust';
            case 'motion': return 'Motion';
            case 'style': return 'Style';
            case 'font': return 'Font';
            case 'settings': return 'Settings';
            default: return 'Tools';
        }
    }, [activeTab]);

    const content = useMemo(() => {
        switch (activeTab) {
            case 'adjust': return <AdjustDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            case 'motion': return <MotionDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            case 'style': return <StyleDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            case 'font': return <FontDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            case 'settings': return <SettingsDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            default: return null;
        }
    }, [activeTab, engine, selectedId, onClose]);

    // Use Close on empty content or if no object is selected (though editor handles deselect)
    if (!selectedId) return null;

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant="dock"
        >
            {content}
        </BottomSheet>
    );
};
