// modules/diagram/store/useDiagramCollaboration.ts
import { useCallback, useEffect, useRef } from 'react';
import { WebsocketProvider } from '@y/websocket';
import * as Y from 'yjs';
import { useEditorStore } from './editor.store.ts';
import type { CollabUserState } from "@/modules/diagram/model/types/collab.types.ts";
import type { DiagramNode, DiagramEdge } from "@/modules/diagram/model/types";

// Symbol to mark transactions originating from this client, distinct from Y.js clientID number
//const LOCAL_ORIGIN = Symbol('local');

const generateUserColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF'];
    return colors[Math.floor(Math.random() * colors.length)];
};

const getLocalUserState = (): Omit<CollabUserState, 'cursor' | 'selection' | 'interaction'> => ({
    userId: `user_${Math.random().toString(36).slice(2, 10)}`,
    name: `User_${Math.floor(Math.random() * 1000)}`,
    color: generateUserColor(),
});

interface CachedProvider {
    provider: WebsocketProvider;
    ydoc: Y.Doc;
    unobserveNodes?: () => void;
    unobserveEdges?: () => void;
    cleanupAwareness?: () => void;
}

export function useDiagramCollaboration(roomId: string, websocketUrl = 'ws://localhost:1234') {
    const providersCache = useRef<Map<string, CachedProvider>>(new Map());

    const actions = useEditorStore(state => state.actions);

    useEffect(() => {
        const currentRoomId = roomId;
        const currentWebsocketUrl = websocketUrl;

        if (providersCache.current.has(currentRoomId)) return;

        const ydoc = new Y.Doc();
        const provider = new WebsocketProvider(currentWebsocketUrl, currentRoomId, ydoc, { connect: true });
        const { awareness } = provider;
        const yNodesMap = ydoc.getMap('diagram_nodes');
        const yEdgesMap = ydoc.getMap('diagram_edges');

        // === Инициализация локального пользователя ===
        const localUser = getLocalUserState();
        awareness.setLocalStateField('user', localUser);

        // === Подписка на Awareness ===
        const onAwarenessUpdate = () => {
            const states = new Map<number, CollabUserState>();
            awareness.getStates().forEach((state, clientId) => {
                if (state.user) {
                    states.set(clientId, { ...localUser, ...state.user });
                }
            });
            useEditorStore.setState({ remoteUsers: states });
        };
        awareness.on('update', onAwarenessUpdate);


        const initialSync = () => {
            // Проверяем, есть ли данные в картах
            if (yNodesMap.size > 0 || yEdgesMap.size > 0) {
                console.log('[Collab] Initial sync:', {
                    nodes: yNodesMap.size,
                    edges: yEdgesMap.size,
                });

                const nodes: DiagramNode[] = [];
                yNodesMap.forEach((val) => {
                    const plain = toPlain(val);
                    if (plain) nodes.push(plain as DiagramNode);
                });

                const edges: DiagramEdge[] = [];
                yEdgesMap.forEach((val) => {
                    const plain = toPlain(val);
                    if (plain) edges.push(plain as DiagramEdge);
                });

                actions.setNodes(nodes);
                actions.setEdges(edges);
            }
        };

        // Вызываем сразу после инициализации
        initialSync();

        // === ГРАНУЛЯРНАЯ синхронизация данных ===
        // Преобразуем YMap shared type в plain object
        const toPlain = (val: unknown): unknown => {
            if (val == null) return val;
            if (typeof (val as any).toJSON === 'function') return (val as any).toJSON();
            if (Array.isArray(val)) return val.map(toPlain);
            if (typeof val === 'object' && val.constructor === Object) {
                const res: Record<string, unknown> = {};
                for (const [k, v] of Object.entries(val)) res[k] = toPlain(v);
                return res;
            }
            return val;
        };

        const syncNodesFromYjs = (event?: Y.YMapEvent<unknown>) => {
            const hasChanges = event && typeof event === 'object' && 'changes' in event;
            if (hasChanges) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const changes = (event as any).changes as {
                    updated?: Map<string, unknown>;
                    added?: Set<string>;
                    deleted?: Set<string>;
                } | undefined;

                if (changes) {
                    // Обновляем изменённые ноды
                    changes.updated?.forEach((_: unknown, key: string) => {
                        const raw = yNodesMap.get(key);
                        const updatedNode = toPlain(raw);
                        if (updatedNode) actions.updateNodeGranular(key, updatedNode as DiagramNode);
                    });

                    // Добавляем новые
                    changes.added?.forEach((key: string) => {
                        const raw = yNodesMap.get(key);
                        const newNode = toPlain(raw);
                        if (newNode) actions.addNodeFromNetwork(newNode as DiagramNode);
                    });

                    // Удаляем удалённые
                    changes.deleted?.forEach((key: string) => {
                        actions.deleteNodeFromNetwork(key);
                    });
                    return;
                }
            }

            // Фоллбэк: полная синхронизация
            const allNodes: DiagramNode[] = [];
            yNodesMap.forEach((val: unknown) => {
                const plain = toPlain(val);
                if (plain !== undefined) allNodes.push(plain as DiagramNode);
            });
            actions.setNodes(allNodes);
        };

        const syncEdgesFromYjs = (event?: Y.YMapEvent<unknown>) => {
            const hasChanges = event && typeof event === 'object' && 'changes' in event;

            if (hasChanges) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const changes = (event as any).changes as {
                    updated?: Map<string, unknown>;
                    added?: Set<string>;
                    deleted?: Set<string>;
                } | undefined;

                if (changes) {
                    changes.updated?.forEach((_: unknown, key: string) => {
                        const raw = yEdgesMap.get(key);
                        const updatedEdge = toPlain(raw);
                        if (updatedEdge) actions.updateEdgeGranular(key, updatedEdge as DiagramEdge);
                    });

                    changes.added?.forEach((key: string) => {
                        const raw = yEdgesMap.get(key);
                        const newEdge = toPlain(raw);
                        if (newEdge) actions.addEdgeFromNetwork(newEdge as DiagramEdge);
                    });

                    changes.deleted?.forEach((key: string) => {
                        actions.deleteEdgeFromNetwork(key);
                    });
                    return;
                }
            }

            const allEdges: DiagramEdge[] = [];
            yEdgesMap.forEach((val: unknown) => {
                const plain = toPlain(val);
                if (plain !== undefined) allEdges.push(plain as DiagramEdge);
            });
            actions.setEdges(allEdges);
        };

        const onNodesChange = (event: Y.YMapEvent<unknown>) => {
            // @ts-expect-error origin существует в runtime
            const origin = (event as any).origin;

            // 🟡 Если origin === undefined → транзакция была вызвана БЕЗ второго аргумента
            if (origin === undefined) {
                console.warn('[Collab] ⚠️ Transaction missing origin! Check ydoc.transact(cb, origin)');
            }

            if (origin === ydoc.clientID) return; // Свои изменения игнорируем
            syncNodesFromYjs(event);
        };

        const onEdgesChange = (event: Y.YMapEvent<unknown>) => {
            // @ts-expect-error
            if ((event as any).origin === ydoc.clientID) return;
            syncEdgesFromYjs(event);
        };

        yNodesMap.observe(onNodesChange);
        yEdgesMap.observe(onEdgesChange);

        // UndoManager — trackedOrigins включает LOCAL_ORIGIN, чтобы undo/redo работал
        //(window as any).diagramUndoManager = new Y.UndoManager([yNodesMap, yEdgesMap], {
        //    captureTimeout: 200,
        //    //trackedOrigins: new Set([LOCAL_ORIGIN]),
        //});

        // Сохраняем контекст в стор + публикуем метод transact с LOCAL_ORIGIN
        //(ydoc as any)._localOrigin = LOCAL_ORIGIN;

        useEditorStore.setState({
            yjsContext: { yNodesMap, yEdgesMap, ydoc },
            localUserId: localUser.userId,
        });

        providersCache.current.set(roomId, {
            provider, ydoc,
            unobserveNodes: () => yNodesMap.unobserve(onNodesChange),
            unobserveEdges: () => yEdgesMap.unobserve(onEdgesChange),
            cleanupAwareness: () => awareness.off('update', onAwarenessUpdate),
        });

        return () => {
            const cached = providersCache.current.get(currentRoomId);
            if (!cached) return;

            cached.unobserveNodes?.();
            cached.unobserveEdges?.();
            cached.cleanupAwareness?.();

            if (cached.provider?.awareness) {
                cached.provider.awareness.setLocalState(null);
            }

            try {
                cached.provider?.disconnect();
                cached.provider?.destroy();
                cached.ydoc?.destroy();
            } catch (e) {
                console.debug('[Collab] Cleanup:', e);
            }

            providersCache.current.delete(currentRoomId);
            useEditorStore.setState({
                yjsContext: null,
                remoteUsers: new Map(),
                localUserId: undefined
            });
        };
    }, [roomId, websocketUrl, actions]);

    // === Хелперы для Awareness ===
    const updateLocalCursor = useCallback((x: number, y: number) => {
        const provider = providersCache.current.get(roomId)?.provider;
        if (!provider) return;
        provider.awareness.setLocalStateField('user', {
            ...provider.awareness.getLocalState()?.user,
            cursor: { x, y, timestamp: Date.now() },
        });
    }, [roomId]);

    const updateLocalSelection = useCallback((nodeIds: string[], edgeIds: string[]) => {
        const provider = providersCache.current.get(roomId)?.provider;
        if (!provider) return;
        provider.awareness.setLocalStateField('user', {
            ...provider.awareness.getLocalState()?.user,
            selection: { nodeIds, edgeIds },
        });
    }, [roomId]);

    const updateLocalInteraction = useCallback((interaction: CollabUserState['interaction']) => {
        const provider = providersCache.current.get(roomId)?.provider;
        if (!provider) return;
        provider.awareness.setLocalStateField('user', {
            ...provider.awareness.getLocalState()?.user,
            interaction,
        });
    }, [roomId]);

    const updateEditingField = useCallback((nodeId: string, fieldName: string) => {
        const provider = providersCache.current.get(roomId)?.provider;
        if (!provider) return;
        provider.awareness.setLocalStateField('user', {
            ...provider.awareness.getLocalState()?.user,
            editingField: nodeId ? { nodeId, fieldName } : undefined,
        });
    }, [roomId]);

    return {
        updateLocalCursor,
        updateLocalSelection,
        updateLocalInteraction,
        updateEditingField,
        //LOCAL_ORIGIN,
    };
}
