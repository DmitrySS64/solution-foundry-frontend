import type {IDiagramSlice, ISelectionState, ISelectionActions} from "@/modules/diagram/store/slices/types/store.types.ts";
import type {ISelectionBox} from "@/modules/diagram/store/slices/types/selection.sTypes.ts";
import {pushPastSnapshot} from "@/modules/diagram/store/history/documentHistory.ts";

export type {ISelectionBox};

export const createSelectionStateSlice = (): ISelectionState  => ({
    selection: { ids: [], box: null },
})

export const createSelectionActionsSlice: IDiagramSlice<ISelectionActions> = (set, get) => ({
    selectNode: (id) => set((draft) => { draft.selection.ids = id ? [id] : []; }),
    setSelectionBox: (box) => set((draft) => { draft.selection.box = box; }),
    deleteSelection: () => {
        const state = get();
        const ctx = state.yjsContext;
        const selected = new Set(state.selection.ids ?? []);
        if (selected.size === 0) return;

        if (ctx) {
            // 🟢 YJS-РЕЖИМ: Работаем ТОЛЬКО с Yjs. set() вызывается ПОСЛЕ транзакции.
            ctx.ydoc.transact(() => {
                // 1. Удаляем ноды
                for (const nodeId of selected) {
                    ctx.yNodesMap.delete(nodeId);
                }

                // 2. Находим и удаляем связанные рёбра
                const edgesToDelete = new Set<string>();
                ctx.yEdgesMap.forEach((val: any, edgeId: string) => {
                    const plain = typeof val.toJSON === 'function' ? val.toJSON() : val;
                    if (selected.has(edgeId) ||
                        selected.has(plain.source?.nodeId) ||
                        selected.has(plain.target?.nodeId)) {
                        edgesToDelete.add(edgeId);
                        ctx.yEdgesMap.delete(edgeId);
                    }
                });

                // 3. Чистим ссылки в оставшихся нодах
                ctx.yNodesMap.forEach((val: any, nodeId: string) => {
                    if (val.edges?.length) {
                        const plain = typeof val.toJSON === 'function' ? val.toJSON() : val;
                        const remaining = plain.edges.filter((ref: any) => !edgesToDelete.has(ref.id));
                        if (remaining.length !== plain.edges.length) {
                            ctx.yNodesMap.set(nodeId, { ...plain, edges: remaining });
                        }
                    }
                });
            }, ctx.ydoc.clientID); // ← КРИТИЧНО: передаём origin

            // 🟢 Обновляем Zustand ТОЛЬКО после завершения транзакции
            set((draft) => { draft.selection.ids = []; });

        } else {
            // 🟢 ЛОКАЛЬНЫЙ РЕЖИМ: Безопасный Immer
            set((draft) => {
                const nodes = draft.document?.nodes ?? [];
                const edges = draft.document?.edges ?? [];

                draft.history = pushPastSnapshot(draft.history, draft.document);
                draft.document.nodes = nodes.filter(n => !selected.has(n.id));
                draft.document.edges = edges.filter(e =>
                    !selected.has(e.id) &&
                    !selected.has(e.source?.nodeId ?? '') &&
                    !selected.has(e.target?.nodeId ?? '')
                );

                for (const node of draft.document.nodes) {
                    node.edges = (node.edges ?? []).filter(ref =>
                        draft.document.edges?.some(e => e.id === ref.id)
                    );
                }
                draft.selection.ids = [];
            });
        }
    },
})
