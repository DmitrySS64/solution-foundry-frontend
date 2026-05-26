// modules/diagram/store/debouncedYjsUpdate.ts
import * as Y from 'yjs';
import { recalculateEdge } from "@/modules/diagram/model/factories/recalculateEdge.ts";
import type { DiagramNode, DiagramEdge } from '@/modules/diagram/model/types';

type YjsContext = {
    ydoc: Y.Doc;
    yNodesMap: Y.Map<unknown>;
    yEdgesMap: Y.Map<unknown>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NodeUpdater = Partial<DiagramNode>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EdgeUpdater = Partial<DiagramEdge>;

// Получаем LOCAL_ORIGIN из ydoc
const getLocalOrigin = (ydoc: Y.Doc): symbol => (ydoc as unknown as { _localOrigin: symbol })._localOrigin;

// === NODE UPDATES ===
const nodeUpdateQueue = new Map<string, { updater: NodeUpdater; timeoutId: ReturnType<typeof setTimeout> }>();

export function updateYjsNodeDebounced(ctx: YjsContext, nodeId: string, partialUpdate: NodeUpdater) {
    const queued = nodeUpdateQueue.get(nodeId);
    const mergedUpdater = queued ? { ...queued.updater, ...partialUpdate } : partialUpdate;

    if (queued) clearTimeout(queued.timeoutId);

    const timeoutId = setTimeout(() => {
        nodeUpdateQueue.delete(nodeId);

        const origin = getLocalOrigin(ctx.ydoc);

        ctx.ydoc.transact(() => {
            const rawNode = ctx.yNodesMap.get(nodeId);
            if (!rawNode) return;

            // Преобразуем Yjs shared type в plain object
            const plainNode = typeof (rawNode as { toJSON?: () => unknown }).toJSON === 'function'
                ? (rawNode as { toJSON: () => NodeUpdater }).toJSON()
                : { ...rawNode } as NodeUpdater;

            const updatedNode = { ...plainNode, ...mergedUpdater, updatedAt: Date.now() };

            // Пересчет связанных ребер
            if (updatedNode.edges && Array.isArray(updatedNode.edges)) {
                for (const edgeRef of updatedNode.edges) {
                    const rawEdge = ctx.yEdgesMap.get(edgeRef.id);
                    if (rawEdge) {
                        const plainEdge = typeof (rawEdge as { toJSON?: () => unknown }).toJSON === 'function'
                            ? (rawEdge as { toJSON: () => DiagramEdge }).toJSON()
                            : { ...rawEdge } as DiagramEdge;
                        const recalculatedEdge = recalculateEdge(plainEdge, updatedNode as DiagramNode);
                        ctx.yEdgesMap.set(edgeRef.id, recalculatedEdge);
                    }
                }
            }
            ctx.yNodesMap.set(nodeId, updatedNode);
        }, origin);
    }, 60);

    nodeUpdateQueue.set(nodeId, { updater: mergedUpdater, timeoutId });
}

// === EDGE UPDATES ===
const edgeUpdateQueue = new Map<string, { updater: EdgeUpdater; timeoutId: ReturnType<typeof setTimeout> }>();

export function updateYjsEdgeDebounced(ctx: YjsContext, edgeId: string, partialUpdate: EdgeUpdater) {
    const queued = edgeUpdateQueue.get(edgeId);
    const mergedUpdater = queued ? { ...queued.updater, ...partialUpdate } : partialUpdate;

    if (queued) clearTimeout(queued.timeoutId);

    const timeoutId = setTimeout(() => {
        edgeUpdateQueue.delete(edgeId);

        const origin = getLocalOrigin(ctx.ydoc);

        ctx.ydoc.transact(() => {
            const rawEdge = ctx.yEdgesMap.get(edgeId);
            if (!rawEdge) return;

            const plainEdge = typeof (rawEdge as { toJSON?: () => unknown }).toJSON === 'function'
                ? (rawEdge as { toJSON: () => DiagramEdge }).toJSON()
                : { ...rawEdge } as DiagramEdge;
            const updatedEdge = { ...plainEdge, ...mergedUpdater };
            ctx.yEdgesMap.set(edgeId, updatedEdge);

            // Синхронизация ссылок на ребро в связанных нодах
            const updateNodeEdgeRefs = (nodeId: string, direction: 'in' | 'out', shouldAdd: boolean) => {
                const node = ctx.yNodesMap.get(nodeId);
                if (!node) return;

                const plainNode = typeof (node as { toJSON?: () => unknown }).toJSON === 'function'
                    ? (node as { toJSON: () => DiagramNode }).toJSON()
                    : { ...node } as DiagramNode;
                const edges = (plainNode.edges ?? []).filter((e: { id: string }) => e.id !== edgeId);
                if (shouldAdd) edges.push({ id: edgeId, direction });
                ctx.yNodesMap.set(nodeId, { ...plainNode, edges });
            };

            // Очистка старых связей
            if (plainEdge.source?.nodeId) {
                updateNodeEdgeRefs(plainEdge.source.nodeId, 'out', false);
            }
            if (plainEdge.target?.nodeId && plainEdge.target.nodeId !== plainEdge.source?.nodeId) {
                updateNodeEdgeRefs(plainEdge.target.nodeId, 'in', false);
            }

            // Добавление новых связей
            if (updatedEdge.source?.nodeId) {
                updateNodeEdgeRefs(updatedEdge.source.nodeId, 'out', true);
            }
            if (updatedEdge.target?.nodeId && updatedEdge.target.nodeId !== updatedEdge.source?.nodeId) {
                updateNodeEdgeRefs(updatedEdge.target.nodeId, 'in', true);
            }
        }, origin);
    }, 30);

    edgeUpdateQueue.set(edgeId, { updater: mergedUpdater, timeoutId });
}
