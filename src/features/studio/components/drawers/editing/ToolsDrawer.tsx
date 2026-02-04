import React, { useMemo } from "react";
import { Engine } from "@core/Core";
import { BottomSheet } from "../../dock/BottomSheet";
import { AdjustDrawerContent } from "../properties/AdjustDrawer";
import { MotionDrawerContent } from "../properties/MotionDrawer";
import { StyleDrawerContent } from "./StyleDrawer";
import { FontDrawerContent } from "./FontDrawer";
import { SettingsDrawerContent } from "./SettingsDrawer";
import { EditDrawer } from "./EditDrawer";
import { DimensionsDrawerContent } from "../properties/DimensionsDrawer";
import { PositionDrawerContent } from "../properties/PositionDrawer";

import { CanvasSettings } from "../../../settings/CanvasSettings";

interface ToolsDrawerProps {
    engine: Engine | null;
    selectedId: string | null;
    activeTab: string | null;
    onClose: () => void;
}

export const ToolsDrawer: React.FC<ToolsDrawerProps> = ({ engine, selectedId, activeTab, onClose }) => {

    // Determine if we should be open
    const isOpen = useMemo(() => {
        return ['adjust', 'motion', 'style', 'font', 'settings', 'edit', 'dimensions', 'position', 'canvas'].includes(activeTab || '');
    }, [activeTab]);

    const title = useMemo(() => {
        switch (activeTab) {
            case 'adjust': return 'Adjust';
            case 'dimensions': return 'Dimensions';
            case 'position': return 'Position';
            case 'motion': return 'Motion';
            case 'style': return 'Style';
            case 'font': return 'Font';
            case 'settings': return 'Settings';
            case 'edit': return 'Edit';
            case 'canvas': return 'Canvas';
            default: return 'Tools';
        }
    }, [activeTab]);

    const content = useMemo(() => {
        switch (activeTab) {
            case 'adjust': return <AdjustDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            case 'dimensions': return <DimensionsDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            case 'position': return <PositionDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            case 'motion': return <MotionDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            case 'style': return <StyleDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            case 'font': return <FontDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            case 'settings': return <SettingsDrawerContent engine={engine} selectedId={selectedId} onClose={onClose} />;
            case 'edit': return <EditDrawer engine={engine} selectedId={selectedId} isOpen={activeTab === 'edit'} onClose={onClose} />;
            case 'canvas': return <CanvasSettings engine={engine} variant="mobile" />;
            default: return null;
        }
    }, [activeTab, engine, selectedId, onClose]);

    // Use Close on empty content or if no object is selected (though editor handles deselect)
    // Allow 'canvas' tab to open even if no object is selected
    if (!selectedId && activeTab !== 'canvas') return null;

    if (activeTab === 'edit') {
        return <EditDrawer engine={engine} selectedId={selectedId} isOpen={activeTab === 'edit'} onClose={onClose} />;
    }

    return (
        <BottomSheet
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            variant='dock'
            initialSnap={0.5}
            snaps={[0.5, 0.9]}
        >
            {content}
        </BottomSheet>
    );
};
