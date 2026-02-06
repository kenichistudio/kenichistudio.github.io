import React, { useMemo } from "react";
import { BottomSheet } from "../../dock/BottomSheet";
import { AdjustDrawerContent } from "../properties/AdjustDrawer";
import { MotionDrawerContent } from "../properties/MotionDrawer";
import { StyleDrawerContent } from "./StyleDrawer";
import { FontDrawerContent } from "./FontDrawer";
import { SettingsDrawerContent } from "./SettingsDrawer";
import { EditDrawer } from "./EditDrawer";
import { DimensionsDrawerContent } from "../properties/DimensionsDrawer";
import { PositionDrawerContent } from "../properties/PositionDrawer";
import { useStudio } from "../../../context/StudioContext";
import { CanvasSettings } from "../../../settings/CanvasSettings";

interface ToolsDrawerProps {
    activeTab: string | null;
    onClose: () => void;
}

export const ToolsDrawer: React.FC<ToolsDrawerProps> = ({ activeTab, onClose }) => {
    const { engine, selectedId } = useStudio();

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
            case 'adjust': return <AdjustDrawerContent onClose={onClose} />;
            case 'dimensions': return <DimensionsDrawerContent onClose={onClose} />;
            case 'position': return <PositionDrawerContent onClose={onClose} />;
            case 'motion': return <MotionDrawerContent onClose={onClose} />;
            case 'style': return <StyleDrawerContent onClose={onClose} />;
            case 'font': return <FontDrawerContent onClose={onClose} />;
            case 'settings': return <SettingsDrawerContent onClose={onClose} />;
            case 'edit': return <EditDrawer isOpen={activeTab === 'edit'} onClose={onClose} />;
            case 'canvas': return <CanvasSettings variant="mobile" />;
            default: return null;
        }
    }, [activeTab, onClose]);

    // Use Close on empty content or if no object is selected (though editor handles deselect)
    // Allow 'canvas' tab to open even if no object is selected
    if (!selectedId && activeTab !== 'canvas') return null;

    if (activeTab === 'edit') {
        return <EditDrawer isOpen={activeTab === 'edit'} onClose={onClose} />;
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
