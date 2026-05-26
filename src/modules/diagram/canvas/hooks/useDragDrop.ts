// modules/diagram/canvas/hooks/useDragDrop.ts
import { useCallback } from 'react';
import type Konva from 'konva';
import { useEditorStore } from '@/modules/diagram/store/editor.store.ts';
import { createNode } from '@/modules/diagram/model/factories/create-node.ts';

interface UseDragDropOptions {
    stageRef: React.RefObject<Konva.Stage | null>;
    viewportRef: React.RefObject<{ x: number; y: number; zoom: number }>;
}

export const useDragDrop = ({ stageRef, viewportRef }: UseDragDropOptions) => {
    const getWorldCoords = useCallback((pointer: { x: number; y: number }) => {
        const { x, y, zoom } = viewportRef.current;
        return { worldX: (pointer.x - x) / zoom, worldY: (pointer.y - y) / zoom };
    }, [viewportRef]);

    const handleDragOver = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
        e.evt.preventDefault();
    }, []);

    const handleDrop = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
        e.evt.preventDefault();
        const type = e.evt.dataTransfer?.getData('application/diagram-node-type');
        if (!type) return;

        const stage = stageRef.current;
        if (!stage) return;

        const pointer = stage.getPointerPosition();
        if (!pointer) return;

        const { worldX, worldY } = getWorldCoords(pointer);
        useEditorStore.getState().actions.addNode(createNode(type, worldX, worldY));
    }, [stageRef, getWorldCoords]);

    return { handleDragOver, handleDrop };
};