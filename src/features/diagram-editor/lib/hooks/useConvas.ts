import {useState} from "react";
import Konva from "konva";

const useConvas = (
    readOnly: boolean,
    updateElement:(id: string, updates: Record<string, any>) => void
) => {
    const [scale, setScale] = useState(1);
    const [stageOffset, setStageOffset] = useState({ x: 0, y: 0 }); // сдвиг камеры
    const [bounds, setBounds] = useState({
        minX: -500,
        maxX: 500,
        minY: -500,
        maxY: 500,
    });
    const [isPanning, setIsPanning] = useState(false);
    const [lastPointerPos, setLastPointerPos] = useState({ x: 0, y: 0 });

    // Обработчики для перетаскивания фона (не фигур)
    const handleStageMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (e.target === e.target.getStage() && !readOnly) {
            setIsPanning(true);
            setLastPointerPos({ x: e.evt.clientX, y: e.evt.clientY });
        }
    };

    const handleStageMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
        if (isPanning) {
            const dx = e.evt.clientX - lastPointerPos.x;
            const dy = e.evt.clientY - lastPointerPos.y;
            const newX = stageOffset.x + dx;
            const newY = stageOffset.y + dy;
            // Ограничиваем панорамирование текущими границами
            setStageOffset({
                x: Math.min(bounds.maxX, Math.max(bounds.minX, newX)),
                y: Math.min(bounds.maxY, Math.max(bounds.minY, newY)),
            });
            setLastPointerPos({ x: e.evt.clientX, y: e.evt.clientY });
        }
    };

    const handleStageMouseUp = () => {
        setIsPanning(false);
    };

    const handleDragEnd = (id: string, x: number, y: number) => {
        updateElement(id, { position: { x, y } });

        // Расширяем границы с запасом
        const margin = 300; // запас для добавления новой области
        const newBounds = { ...bounds };
        let changed = false;

        if (x < bounds.minX) {
            newBounds.minX = x - margin;
            changed = true;
        }
        if (x > bounds.maxX) {
            newBounds.maxX = x + margin;
            changed = true;
        }
        if (y < bounds.minY) {
            newBounds.minY = y - margin;
            changed = true;
        }
        if (y > bounds.maxY) {
            newBounds.maxY = y + margin;
            changed = true;
        }

        if (changed) {
            setBounds(newBounds);
        }
    };

    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        if (!readOnly && e.evt.ctrlKey) {
            e.evt.preventDefault();
            const stage = e.target.getStage();
            if (!stage) return;
            const oldScale = scale;
            const pointer = stage.getPointerPosition();
            if (!pointer) return;
            const mousePointTo = {
                x: (pointer.x - stageOffset.x) / oldScale,
                y: (pointer.y - stageOffset.y) / oldScale,
            };
            const delta = e.evt.deltaY > 0 ? 0.9 : 1.1;
            const newScale = Math.min(3, Math.max(0.1, oldScale * delta));
            const newOffset = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            setScale(newScale);
            setStageOffset(newOffset);
        }
    };

    return {
        scale,
        stageOffset,
        bounds,
        handleStageMouseDown,
        handleStageMouseMove,
        handleStageMouseUp,
        handleDragEnd,
        handleWheel
    }
}

export { useConvas }