import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, type PanInfo, useAnimation } from "framer-motion";
import { X, ChevronDown } from "lucide-react";

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title?: string;
    initialSnap?: number; // 0 to 1 (percentage of screen height)
    snaps?: number[]; // [0.5, 0.9]
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
    isOpen,
    onClose,
    children,
    title,
    initialSnap = 0.5,
    snaps = [0.5, 0.9]
}) => {
    const [scope, animate] = [null, useAnimation()];
    const [isDragging, setIsDragging] = useState(false);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop - Transparent to allow previewing canvas */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-transparent z-40 lg:hidden"
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: `${(1 - initialSnap) * 100}%` }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        drag="y"
                        dragConstraints={{ top: 0 }}
                        dragElastic={0.05}
                        dragMomentum={false}
                        onDragEnd={(e, info) => {
                            if (info.offset.y > 100) {
                                onClose();
                            } else {
                                // Snap logic could go here, for now just snapping to initial
                            }
                        }}
                        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col max-h-[95vh] lg:hidden"
                        style={{ height: "95vh" }} // occupies full height but positioned down
                    >
                        {/* Handle / Header */}
                        <div className="flex flex-col items-center pt-2 pb-0 shrink-0 cursor-grab active:cursor-grabbing touch-none"
                        // Add drag handle logic if needed, but the whole sheet is draggable in this simple version
                        // Actually, better to make only header draggable or content scrollable.
                        // For framer motion drag on parent + scrollable child, it's tricky.
                        // Let's rely on a specific drag handle for resizing/closing if we want scroll.
                        >
                            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mb-3" />
                            {title && (
                                <div className="w-full px-4 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
                                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
                                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-8">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
