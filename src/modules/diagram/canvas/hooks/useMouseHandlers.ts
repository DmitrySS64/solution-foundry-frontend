// modules/diagram/canvas/hooks/useMouseHandlers.ts
import {useCallback, useRef} from 'react';
import type Konva from 'konva';
import type {ISelectionBox} from '@/modules/diagram/store/slices/selection.slice.ts';
import type {DrawTarget} from './useDrawScheduler.ts';

interface UseMouseHandlersOptions {
    stageRef: React.RefObject<Konva.Stage | null>;
    viewportRef: React.RefObject<{ x: number; y: number; zoom: number }>;
    requestDraw: (target?: DrawTarget) => void;
    onSelectStart?: (pos: { x: number; y: number }) => void;
    onPanStart?: (pos: { x: number; y: number }) => void;
    onPanMove?: (dx: number, dy: number) => void;
    onSelectionUpdate?: (box: ISelectionBox) => void;
    onWorldPosition?: (worldX: number, worldY: number) => void;
}

export const useMouseHandlers = ({
                                     stageRef, viewportRef, requestDraw,
                                     onSelectStart, onPanStart, onPanMove, onSelectionUpdate, onWorldPosition,
                                 }: UseMouseHandlersOptions) => {
    const isDragging = useRef(false);
    const lastPointer = useRef({x: 0, y: 0});
    const selectionStart = useRef<{ x: number; y: number } | null>(null);
    const selectionBox = useRef<ISelectionBox>({active: false, x: 0, y: 0, width: 0, height: 0});

    const getWorldCoords = useCallback((pos: { x: number; y: number }) => {
        const {x, y, zoom} = viewportRef.current;
        return {worldX: (pos.x - x) / zoom, worldY: (pos.y - y) / zoom};
    }, [viewportRef]);

    const handleMouseDown = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = stageRef.current;
        if (!stage) return;

        // Pan on middle mouse
        if (e.evt.button === 1) {
            isDragging.current = true;
            lastPointer.current = {x: e.evt.clientX, y: e.evt.clientY};
            onPanStart?.({x: e.evt.clientX, y: e.evt.clientY});
            return;
        }

        // Selection on empty canvas
        if (e.target === stage) {
            const pos = stage.getPointerPosition();
            if (!pos) return;
            const {worldX, worldY} = getWorldCoords(pos);

            onSelectStart?.({x: worldX, y: worldY});
            selectionStart.current = {x: worldX, y: worldY};
            selectionBox.current = {active: true, x: worldX, y: worldY, width: 0, height: 0};
            requestDraw('overlay');
        }
    }, [stageRef, viewportRef, getWorldCoords, onSelectStart, onPanStart, requestDraw]);

    const handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
        const stage = stageRef.current;
        if (!stage) return;

        const pos = stage.getPointerPosition();
        if (!pos) return;

        const {worldX, worldY} = getWorldCoords(pos);
        onWorldPosition?.(worldX, worldY);

        // Pan
        if (isDragging.current) {
            const dx = e.evt.clientX - lastPointer.current.x;
            const dy = e.evt.clientY - lastPointer.current.y;
            onPanMove?.(dx, dy);
            lastPointer.current = {x: e.evt.clientX, y: e.evt.clientY};
            return;
        }

        // Selection box
        if (selectionStart.current) {
            const start = selectionStart.current;
            const box: ISelectionBox = {
                active: true,
                x: Math.min(start.x, worldX),
                y: Math.min(start.y, worldY),
                width: Math.abs(worldX - start.x),
                height: Math.abs(worldY - start.y),
            };
            selectionBox.current = box;
            onSelectionUpdate?.(box);
            requestDraw('overlay');
        }
    }, [stageRef, viewportRef, getWorldCoords, onWorldPosition, onPanMove, onSelectionUpdate, requestDraw]);

    const handleMouseUp = useCallback(() => {
        isDragging.current = false;
        selectionStart.current = null;
        selectionBox.current = {active: false, x: 0, y: 0, width: 0, height: 0};
        requestDraw('overlay');
    }, [requestDraw]);

    return {
        handleMouseDown, handleMouseMove, handleMouseUp,
        selectionBoxRef: selectionBox, isDragging: () => isDragging.current,
    };
};