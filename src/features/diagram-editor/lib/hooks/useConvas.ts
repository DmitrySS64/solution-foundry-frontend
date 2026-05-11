// hooks/useConvas.ts
import { useRef, useState, useCallback } from 'react';
import Konva from 'konva';

interface UseConvasProps {
    readOnly: boolean;
}

export const useConvas = ({ readOnly }: UseConvasProps) => {
    const layerRef = useRef<Konva.Layer>(null);          // ссылка на слой для прямого управления
    const [stageOffset, setStageOffset] = useState({ x: 0, y: 0 });
    const [bounds, setBounds] = useState({
        minX: -500,
        maxX: 500,
        minY: -500,
        maxY: 500,
    });
    const [scale, setScale] = useState(1);

    const isPanning = useRef(false);
    const lastPointerPos = useRef({ x: 0, y: 0 });
    const offsetRef = useRef(stageOffset); // синхронизированный слой-реф

    // Панорамирование (прямое управление)
    const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target === e.target.getStage() && !readOnly) {
            isPanning.current = true;
            lastPointerPos.current = { x: e.evt.clientX, y: e.evt.clientY };
        }
    };

    const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!isPanning.current || !layerRef.current) return;
        const dx = e.evt.clientX - lastPointerPos.current.x;
        const dy = e.evt.clientY - lastPointerPos.current.y;
        const newX = offsetRef.current.x + dx;
        const newY = offsetRef.current.y + dy;

        // Прямое смещение слоя (без React state)
        layerRef.current.x(newX);
        layerRef.current.y(newY);
        layerRef.current.batchDraw(); // принудительная отрисовка

        offsetRef.current = { x: newX, y: newY };
        lastPointerPos.current = { x: e.evt.clientX, y: e.evt.clientY };
    };

    const handleStageMouseUp = () => {
        if (isPanning.current) {
            isPanning.current = false;
            // Синхронизируем React состояние после окончания панорамирования
            setStageOffset(offsetRef.current);
        }
    };

    // Zoom (Ctrl+колесо)
    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        if (!readOnly && e.evt.ctrlKey) {
            e.evt.preventDefault();
            const stage = e.target.getStage();
            if (!stage || !layerRef.current) return;
            const oldScale = scale;
            const pointer = stage.getPointerPosition();
            if (!pointer) return;

            // Координаты точки под курсором в локальной системе слоя
            const mousePointTo = {
                x: (pointer.x - offsetRef.current.x) / oldScale,
                y: (pointer.y - offsetRef.current.y) / oldScale,
            };
            const delta = e.evt.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.min(3, Math.max(0.1, oldScale * delta));
            const newOffset = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };

            // Применяем новое масштабирование и смещение к слою
            layerRef.current.scaleX(newScale);
            layerRef.current.scaleY(newScale);
            layerRef.current.x(newOffset.x);
            layerRef.current.y(newOffset.y);
            layerRef.current.batchDraw();

            setScale(newScale);
            setStageOffset(newOffset);
            offsetRef.current = newOffset;
        }
    };

    // Расширение границ при перетаскивании фигуры (вызывается из onDragEnd)
    const expandBounds = useCallback((x: number, y: number) => {
        const margin = 500;
        let changed = false;
        setBounds(prev => {
            const newBounds = { ...prev };
            if (x < prev.minX) { newBounds.minX = x - margin; changed = true; }
            if (x > prev.maxX) { newBounds.maxX = x + margin; changed = true; }
            if (y < prev.minY) { newBounds.minY = y - margin; changed = true; }
            if (y > prev.maxY) { newBounds.maxY = y + margin; changed = true; }
            return changed ? newBounds : prev;
        });
    }, []);

    return {
        layerRef,
        stageOffset,
        bounds,
        scale,
        handleStageMouseDown,
        handleStageMouseMove,
        handleStageMouseUp,
        handleWheel,
        expandBounds,
        setBounds,
    };
};
