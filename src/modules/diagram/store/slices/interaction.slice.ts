import type {IDiagramSlice, IInteractionState, IInteractionActions} from "@/modules/diagram/store/slices/types/store.types.ts";

export const createInteractionStateSlice = (): IInteractionState  => ({
    interaction: {
        dragging: false,
        nodeDragActive: false,
        edgeHandleDragActive: false,
        hoveredEdgeId: null,
        anchorHighlightNodeId: null,
    },
})

export const createInteractionActionsSlice: IDiagramSlice<IInteractionActions> = (set) => ({
    setNodeDragActive: (active) => set((draft) => {
        draft.interaction.nodeDragActive = active;
    }),

    setEdgeHandleDragActive: (active) => set((draft) => {
        draft.interaction.edgeHandleDragActive = active;
    }),

    setHoveredEdgeId: (id) => set((draft) => {
        draft.interaction.hoveredEdgeId = id;
    }),

    setAnchorHighlightNodeId: (id) => set((draft) => {
        draft.interaction.anchorHighlightNodeId = id;
    }),
})