// modules/diagram/model/util/recalculateEdge.ts
import type { DiagramEdge, DiagramNode, EdgePoint } from '../types';
import { getNodeAnchors } from '../factories/getNodeAnchors';
import { closestPointOnRectPerimeter } from '../util/edgeGeometry';

/**
 * Пересчитывает координаты точек ребра на основе позиции ноды.
 * ✅ Чистая функция: не мутирует входные данные, возвращает новый объект
 */
export const recalculateEdge = (
    edge: DiagramEdge,
    movedNode: DiagramNode
): DiagramEdge => {
    const isSource = edge.source?.nodeId === movedNode.id;
    const isTarget = edge.target?.nodeId === movedNode.id;

    // Если нода не относится к этому ребру — возвращаем как есть
    if (!isSource && !isTarget) return edge;

    const anchors = getNodeAnchors(movedNode);

    // Вспомогательная: вычисляет точку привязки (якорь или периметр)
    const calculatePoint = (
        anchorId: string | undefined,
        toward: EdgePoint
    ): EdgePoint => {
        const anchor = anchors.find(a => a.id === anchorId);
        if (anchor) {
            return { x: anchor.x, y: anchor.y };
        }
        // Фоллбэк: ближайшая точка на периметре прямоугольника
        return closestPointOnRectPerimeter(movedNode, toward);
    };

    // Пересчёт source
    const newSource = isSource && edge.source
        ? {
            ...edge.source,
            point: calculatePoint(
                edge.source.anchorId,
                // toward: ближайшая контрольная точка или target.point
                edge.controlPoints?.[0] ?? edge.target.point
            ),
        }
        : edge.source;

    // Пересчёт target
    const newTarget = isTarget && edge.target
        ? {
            ...edge.target,
            point: calculatePoint(
                edge.target.anchorId,
                // toward: ближайшая контрольная точка или source.point
                edge.controlPoints?.[edge.controlPoints.length - 1] ?? edge.source.point
            ),
        }
        : edge.target;

    // Возвращаем новый объект ребра с обновлёнными точками
    return {
        ...edge,
        source: newSource,
        target: newTarget,
    };
};