// modules/diagram/canvas/hooks/useCollaborationSync.ts
import { useEffect, useCallback, useRef } from 'react';
import { useEditorStore } from '@/modules/diagram/store/editor.store.ts';

interface UseCollaborationSyncOptions {
    updateLocalCursor?: (x: number, y: number) => void;
    updateLocalSelection?: (nodeIds: string[], edgeIds: string[]) => void;
    updateLocalInteraction?: (mode: 'idle' | 'dragging' | 'editing' | 'connecting') => void;
    updateEditingField?: (nodeId: string, fieldName: string) => void;
    viewportRef: React.RefObject<{ x: number; y: number; zoom: number }>;
}

export const useCollaborationSync = ({
                                         updateLocalCursor,
                                         updateLocalSelection,
                                         updateLocalInteraction,
                                         updateEditingField,
                                     }: UseCollaborationSyncOptions) => {
    const lastCursorUpdate = useRef(0);
    const CURSOR_THROTTLE_MS = 100;

    // Throttled cursor update
    const throttledCursorUpdate = useCallback((worldX: number, worldY: number) => {
        if (!updateLocalCursor) return;
        const now = Date.now();
        if (now - lastCursorUpdate.current < CURSOR_THROTTLE_MS) return;
        lastCursorUpdate.current = now;
        updateLocalCursor(worldX, worldY);
    }, [updateLocalCursor]);

    // Sync selection changes
    const selection = useEditorStore(s => s.selection.ids);
    useEffect(() => {
        if (!updateLocalSelection) return;
        const state = useEditorStore.getState();
        const nodeIds = selection.filter(id => state.document?.nodes?.some(n => n.id === id));
        const edgeIds = selection.filter(id => state.document?.edges?.some(e => e.id === id));
        updateLocalSelection(nodeIds, edgeIds);
    }, [selection, updateLocalSelection]);

    // Sync interaction mode
    const isDragging = useEditorStore(s => s.interaction.nodeDragActive);
    const isConnecting = useEditorStore(s => s.interaction.edgeHandleDragActive);
    useEffect(() => {
        if (!updateLocalInteraction) return;
        if (isConnecting) updateLocalInteraction('connecting');
        else if (isDragging) updateLocalInteraction('dragging');
        else updateLocalInteraction('idle');
    }, [isDragging, isConnecting, updateLocalInteraction]);

    // Helper for editing fields
    const startFieldEdit = useCallback((nodeId: string, fieldName: string) => {
        updateEditingField?.(nodeId, fieldName);
        updateLocalInteraction?.('editing');
    }, [updateEditingField, updateLocalInteraction]);

    const endFieldEdit = useCallback(() => {
        updateEditingField?.('', '');
        updateLocalInteraction?.('idle');
    }, [updateEditingField, updateLocalInteraction]);

    return {
        throttledCursorUpdate,
        startFieldEdit,
        endFieldEdit,
    };
};