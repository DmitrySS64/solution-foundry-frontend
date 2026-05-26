// modules/diagram/canvas/hooks/useKeyboardShortcuts.ts
import { useEffect } from 'react';

interface UseKeyboardShortcutsOptions {
    onUndo: () => void;
    onRedo: () => void;
    onDelete: () => void;
    pastLen: number;
    futureLen: number;
}

export const useKeyboardShortcuts = ({
                                         onUndo, onRedo, onDelete, pastLen, futureLen,
                                     }: UseKeyboardShortcutsOptions) => {
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            // Ignore when typing in inputs
            const target = event.target as HTMLElement | null;
            const tag = target?.tagName?.toLowerCase();
            if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) return;

            // Ctrl/Cmd+Z → Undo
            if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z') {
                if (pastLen === 0) return;
                event.preventDefault();
                onUndo();
                return;
            }

            // Ctrl/Cmd+Y → Redo
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
                if (futureLen === 0) return;
                event.preventDefault();
                onRedo();
                return;
            }

            // Delete → Delete selection
            if (event.key === 'Delete') {
                event.preventDefault();
                onDelete();
                return;
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onUndo, onRedo, onDelete, pastLen, futureLen]);
};