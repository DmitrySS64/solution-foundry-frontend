// modules/diagram/canvas/hooks/useConnectionManagement.ts
import { useRef, useCallback } from 'react';
import type { TempEdge, DiagramEdge } from '@/modules/diagram/model/types';
import { getNodeAnchors } from '@/modules/diagram/model/factories/getNodeAnchors.ts';
import { closestPointOnRectPerimeter } from '@/modules/diagram/model/util/edgeGeometry.ts';
import { useEditorStore } from '@/modules/diagram/store/editor.store.ts';
import type { DrawTarget } from './useDrawScheduler.ts';

interface UseConnectionOptions {
    requestDraw: (target?: DrawTarget) => void;
}

export const useConnectionManagement = ({ requestDraw }: UseConnectionOptions) => {
    const tempConnection = useRef<TempEdge>({
        active: false, fromX: 0, fromY: 0, toX: 0, toY: 0,
    });
    const isConnecting = useRef(false);

    const startConnection = useCallback((
        nodeId: string, anchorId: string, x: number, y: number
    ) => {
        isConnecting.current = true;
        tempConnection.current = {
            active: true, fromNodeId: nodeId, fromAnchor: anchorId, fromX: x, fromY: y, toX: x, toY: y,
        };
        requestDraw('edges');
    }, [requestDraw]);

    const finishConnection = useCallback((targetNodeId: string, targetAnchorId?: string) => {
        const c = tempConnection.current;
        if (!c.active || c.fromNodeId === targetNodeId) {
            cancelConnection();
            return;
        }

        const state = useEditorStore.getState();
        const targetNode = state.document.nodes.find(n => n.id === targetNodeId);
        if (!targetNode) { cancelConnection(); return; }

        const anchors = getNodeAnchors(targetNode);
        const anchor = anchors.find(a => a.id === targetAnchorId);
        const targetPoint = anchor
            ? { x: anchor.x, y: anchor.y }
            : closestPointOnRectPerimeter(targetNode, { x: c.fromX, y: c.fromY });

        const edge: DiagramEdge = {
            id: crypto.randomUUID(), type: 'straight',
            source: { nodeId: c.fromNodeId, anchorId: c.fromAnchor, point: { x: c.fromX, y: c.fromY } },
            target: { nodeId: targetNodeId, anchorId: targetAnchorId, point: targetPoint },
            controlPoints: [],
            style: { stroke: '#111827', strokeWidth: 2, startCap: 'none', endCap: 'arrow' },
            labelStyle: { fill: '#111827', fontSize: 12, fontFamily: 'Arial', fontStyle: 'normal', fontWeight: 'normal' },
        };

        state.actions.addEdge(edge);
        cancelConnection();
    }, []);

    const cancelConnection = useCallback(() => {
        isConnecting.current = false;
        tempConnection.current.active = false;
        requestDraw('edges');
    }, [requestDraw]);

    const updateTempConnection = useCallback((toX: number, toY: number) => {
        if (!isConnecting.current) return;
        tempConnection.current.toX = toX;
        tempConnection.current.toY = toY;
        requestDraw('edges');
    }, [requestDraw]);

    return {
        tempConnection, isConnecting,
        startConnection, finishConnection, cancelConnection, updateTempConnection,
    };
};