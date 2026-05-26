// modules/diagram/canvas/hooks/useDrawScheduler.ts
import { useRef } from 'react';
import type Konva from 'konva';

export type DrawTarget = 'grid' | 'edges' | 'handles' | 'nodes' | 'overlay' | 'all';

export const useDrawScheduler = (
    layers: Record<Exclude<DrawTarget, 'all'>, React.RefObject<Konva.Layer | null>>
) => {
    const animationFrame = useRef<number | null>(null);

    const requestDraw = (target: DrawTarget = 'all') => {
        if (animationFrame.current) return;

        animationFrame.current = requestAnimationFrame(() => {
            const draw = (layer: Konva.Layer | null) => layer?.batchDraw();

            if (target === 'all' || target === 'grid') draw(layers.grid.current);
            if (target === 'all' || target === 'edges') draw(layers.edges.current);
            if (target === 'all' || target === 'handles') draw(layers.handles.current);
            if (target === 'all' || target === 'nodes') draw(layers.nodes.current);
            if (target === 'all' || target === 'overlay') draw(layers.overlay.current);

            animationFrame.current = null;
        });
    };

    // Очистка при размонтировании
    const cleanup = () => {
        if (animationFrame.current) {
            cancelAnimationFrame(animationFrame.current);
            animationFrame.current = null;
        }
    };

    return { requestDraw, cleanup };
};