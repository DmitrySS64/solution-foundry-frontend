// modules/diagram/canvas/hooks/useViewportManagement.ts
import { useRef, useCallback } from 'react';
import type Konva from 'konva';
import type { DrawTarget } from './useDrawScheduler.ts';

interface ViewportState { x: number; y: number; zoom: number; }

interface UseViewportOptions {
    layers: Record<Exclude<DrawTarget, 'all'>, React.RefObject<Konva.Layer | null>>;
    requestDraw: (target?: DrawTarget) => void;
    onViewportChange?: (x: number, y: number, zoom: number) => void;
}

export const useViewportManagement = (
    initial: ViewportState = { x: 0, y: 0, zoom: 1 },
    { layers, requestDraw, onViewportChange }: UseViewportOptions
) => {
    const viewportRef = useRef(initial);

    const applyViewport = useCallback(() => {
        const { x, y, zoom } = viewportRef.current;
        const affectedLayers = [layers.grid, layers.nodes, layers.edges, layers.handles].filter(Boolean);

        affectedLayers.forEach(layerRef => {
            const layer = layerRef?.current;
            if (!layer) return;
            layer.position({ x, y });
            layer.scale({ x: zoom, y: zoom });
        });

        onViewportChange?.(x, y, zoom);
        requestDraw('all');
    }, [layers, requestDraw, onViewportChange]);

    const zoomAtPointer = useCallback((pointer: { x: number; y: number }, delta: number) => {
        const scaleBy = 1.1;
        const oldZoom = viewportRef.current.zoom;
        let newZoom = delta > 0 ? oldZoom / scaleBy : oldZoom * scaleBy;
        newZoom = Math.max(0.2, Math.min(4, newZoom));

        const worldX = (pointer.x - viewportRef.current.x) / oldZoom;
        const worldY = (pointer.y - viewportRef.current.y) / oldZoom;

        viewportRef.current = {
            ...viewportRef.current,
            zoom: newZoom,
            x: pointer.x - worldX * newZoom,
            y: pointer.y - worldY * newZoom,
        };

        applyViewport();
    }, [applyViewport]);

    const panBy = useCallback((dx: number, dy: number) => {
        viewportRef.current.x += dx;
        viewportRef.current.y += dy;
        applyViewport();
    }, [applyViewport]);

    const setViewport = useCallback((x: number, y: number, zoom: number) => {
        viewportRef.current = { x, y, zoom };
        applyViewport();
    }, [applyViewport]);

    return { viewportRef, applyViewport, zoomAtPointer, panBy, setViewport };
};