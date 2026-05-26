// modules/diagram/store/slices/document.slice.ts
import type { IDiagramSlice, IDocumentState, IDocumentActions } from "./types/store.types";
import { pushPastSnapshot } from "@/modules/diagram/store/history/documentHistory.ts";
import { updateYjsEdgeDebounced, updateYjsNodeDebounced } from "@/modules/diagram/store/debouncedYjsUpdate.ts";

export const createDocumentStateSlice = (): IDocumentState => ({
    document: { nodes: [], edges: [] },
});

export const createDocumentActionsSlice: IDiagramSlice<IDocumentActions> = (set, get) => ({

    addNode: (node) => set((draft) => {
        if (!draft.document) draft.document = { nodes: [], edges: [] };
        if (!Array.isArray(draft.document.nodes)) draft.document.nodes = [];

        const ctx = get().yjsContext;
        const nodeWithEdges = { ...node, edges: node.edges ?? [] };

        if (ctx) {
            // ✅ Оптимистичное обновление
            if (!draft.document.nodes.some(n => n.id === node.id)) {
                draft.document.nodes.push(nodeWithEdges);
            }
            // Запись в Yjs
            ctx.ydoc.transact(() => {
                ctx.yNodesMap.set(node.id, nodeWithEdges);
            }, ctx.ydoc.clientID);
        } else {
            draft.history = pushPastSnapshot(draft.history, draft.document);
            draft.document.nodes.push(nodeWithEdges);
        }
    }),

    updateNode: (id, updater) => {
        const state = get();
        const ctx = state.yjsContext;

        if (ctx) {
            // ✅ Оптимистичное обновление локального стейта
            set((draft) => {
                const nodes = draft.document?.nodes ?? [];
                const node = nodes.find(n => n.id === id);
                if (node) Object.assign(node, updater);
            });
            // Асинхронная запись в Yjs
            updateYjsNodeDebounced(ctx, id, updater);
        } else {
            set((draft) => {
                draft.history = pushPastSnapshot(draft.history, draft.document);
                const node = draft.document?.nodes?.find(n => n.id === id);
                if (node) Object.assign(node, updater);
            });
        }
    },

    deleteNode: (id) => {
        const state = get();
        const ctx = state.yjsContext;

        if (ctx) {
            ctx.ydoc.transact(() => {
                // Находим связанные рёбра
                const edges = state.document?.edges ?? [];
                const edgesToDelete = edges.filter(
                    e => e.source?.nodeId === id || e.target?.nodeId === id
                );

                // Удаляем из Yjs
                edgesToDelete.forEach(e => ctx.yEdgesMap.delete(e.id));
                ctx.yNodesMap.delete(id);

                // Обновляем ссылки в оставшихся нодах
                const nodes = state.document?.nodes ?? [];
                nodes.forEach(node => {
                    if (node.id !== id && node.edges?.length) {
                        const remaining = node.edges.filter((ref: any) =>
                            !edgesToDelete.some(e => e.id === ref.id)
                        );
                        if (remaining.length !== node.edges.length) {
                            ctx.yNodesMap.set(node.id, { ...node, edges: remaining });
                        }
                    }
                });
            }, ctx.ydoc.clientID);

            // Обновляем локальный стейт
            set((draft) => {
                const nodes = draft.document?.nodes ?? [];
                const edges = draft.document?.edges ?? [];

                draft.document.nodes = nodes.filter(n => n.id !== id);
                draft.document.edges = edges.filter(
                    e => e.source?.nodeId !== id && e.target?.nodeId !== id
                );

                // Чистим ссылки в оставшихся нодах
                for (const node of draft.document.nodes) {
                    node.edges = (node.edges ?? []).filter(edgeRef =>
                        draft.document.edges?.some(e => e.id === edgeRef.id)
                    );
                }
            });
        } else {
            set((draft) => {
                draft.history = pushPastSnapshot(draft.history, draft.document);
                const nodes = draft.document?.nodes ?? [];
                const edges = draft.document?.edges ?? [];

                draft.document.nodes = nodes.filter(n => n.id !== id);
                draft.document.edges = edges.filter(
                    e => e.source?.nodeId !== id && e.target?.nodeId !== id
                );

                for (const node of draft.document.nodes) {
                    node.edges = (node.edges ?? []).filter(edgeRef =>
                        draft.document.edges?.some(e => e.id === edgeRef.id)
                    );
                }
            });
        }
    },

    addEdge: (edge) => set((draft) => {
        if (!draft.document) draft.document = { nodes: [], edges: [] };
        if (!Array.isArray(draft.document.edges)) draft.document.edges = [];

        const ctx = get().yjsContext;

        if (ctx) {
            ctx.ydoc.transact(() => {
                ctx.yEdgesMap.set(edge.id, edge);
            }, ctx.ydoc.clientID);
        }
        // В локальном режиме просто добавляем
        draft.document.edges.push(edge);
    }),

    updateEdge: (id, updater) => {
        const state = get();
        const ctx = state.yjsContext;

        if (ctx) {
            set((draft) => {
                const edge = draft.document?.edges?.find(e => e.id === id);
                if (edge) Object.assign(edge, updater);
            });
            updateYjsEdgeDebounced(ctx, id, updater);
        } else {
            set((draft) => {
                draft.history = pushPastSnapshot(draft.history, draft.document);
                const edge = draft.document?.edges?.find(e => e.id === id);
                if (edge) Object.assign(edge, updater);
            });
        }
    },

    deleteEdge: (id) => {
        const state = get();
        const ctx = state.yjsContext;

        if (ctx) {
            ctx.ydoc.transact(() => {
                ctx.yEdgesMap.delete(id);

                // Убираем ссылки из нод
                const nodes = state.document?.nodes ?? [];
                nodes.forEach(node => {
                    if (node.edges?.some((ref: any) => ref.id === id)) {
                        const remaining = node.edges.filter((ref: any) => ref.id !== id);
                        ctx.yNodesMap.set(node.id, { ...node, edges: remaining });
                    }
                });
            }, ctx.ydoc.clientID);

            set((draft) => {
                draft.document.edges = (draft.document?.edges ?? []).filter(e => e.id !== id);
                for (const node of draft.document?.nodes ?? []) {
                    node.edges = (node.edges ?? []).filter(edgeRef => edgeRef.id !== id);
                }
            });
        } else {
            set((draft) => {
                draft.history = pushPastSnapshot(draft.history, draft.document);
                draft.document.edges = (draft.document?.edges ?? []).filter(e => e.id !== id);
                for (const node of draft.document?.nodes ?? []) {
                    node.edges = (node.edges ?? []).filter(edgeRef => edgeRef.id !== id);
                }
            });
        }
    },

    setNodes: (nodes) => set((draft) => {
        if (!draft.document) draft.document = { nodes: [], edges: [] };
        draft.document.nodes = nodes;
    }),

    setEdges: (edges) => set((draft) => {
        if (!draft.document) draft.document = { nodes: [], edges: [] };
        draft.document.edges = edges;
    }),

    loadDocument: (document) => set((draft) => {
        draft.document = document;
        draft.history = { past: [], future: [] };
        draft.selection.ids = [];
    }),

    clearDocument: () => set((draft) => {
        draft.document = { nodes: [], edges: [] };
        draft.history = { past: [], future: [] };
        draft.selection.ids = [];
    }),

    // === Granular network sync ===
    updateNodeGranular: (id, updatedNode) => set((draft) => {
        const nodes = draft.document?.nodes ?? [];
        const index = nodes.findIndex(n => n.id === id);
        if (index !== -1) {
            draft.document.nodes[index] = { ...nodes[index], ...updatedNode };
        }
    }),

    addNodeFromNetwork: (node) => set((draft) => {
        const nodes = draft.document?.nodes ?? [];
        const existingIndex = nodes.findIndex(n => n.id === node.id);

        if (existingIndex !== -1) {
            // ✅ Нода уже есть — обновляем поля (мердж, а не замена)
            draft.document.nodes[existingIndex] = {
                ...nodes[existingIndex],
                ...node
            };
        } else {
            // Новая нода — добавляем
            draft.document.nodes.push(node);
        }
    }),

    deleteNodeFromNetwork: (id) => set((draft) => {
        draft.document.nodes = (draft.document?.nodes ?? []).filter(n => n.id !== id);
        draft.document.edges = (draft.document?.edges ?? []).filter(
            e => e.source?.nodeId !== id && e.target?.nodeId !== id
        );
        for (const node of draft.document?.nodes ?? []) {
            node.edges = (node.edges ?? []).filter(edgeRef =>
                draft.document.edges?.some(e => e.id === edgeRef.id)
            );
        }
    }),

    updateEdgeGranular: (id, updatedEdge) => set((draft) => {
        const edges = draft.document?.edges ?? [];
        const index = edges.findIndex(e => e.id === id);
        if (index !== -1) {
            draft.document.edges[index] = { ...edges[index], ...updatedEdge };
        }
    }),

    addEdgeFromNetwork: (edge) => set((draft) => {
        const edges = draft.document?.edges ?? [];
        if (!edges.some(e => e.id === edge.id)) {
            draft.document.edges.push(edge);
            const nodes = draft.document?.nodes ?? [];
            const source = nodes.find(n => n.id === edge.source?.nodeId);
            const target = nodes.find(n => n.id === edge.target?.nodeId);

            if (source && !source.edges?.some((e: any) => e.id === edge.id)) {
                source.edges = [...(source.edges ?? []), { id: edge.id, direction: 'out' }];
            }
            if (target && target.id !== source?.id && !target.edges?.some((e: any) => e.id === edge.id)) {
                target.edges = [...(target.edges ?? []), { id: edge.id, direction: 'in' }];
            }
        }
    }),

    deleteEdgeFromNetwork: (id) => set((draft) => {
        draft.document.edges = (draft.document?.edges ?? []).filter(e => e.id !== id);
        for (const node of draft.document?.nodes ?? []) {
            node.edges = (node.edges ?? []).filter(edgeRef => edgeRef.id !== id);
        }
    }),
});