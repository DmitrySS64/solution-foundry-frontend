

export interface IInteractionState {
    interaction: {
        dragging: boolean;
        nodeDragActive: boolean;
        edgeHandleDragActive: boolean;
        hoveredEdgeId?: string | null;
        anchorHighlightNodeId?: string | null;
    };
}

export interface IInteractionActions {
    setNodeDragActive: (active: boolean) => void;
    setEdgeHandleDragActive: (active: boolean) => void;
    setHoveredEdgeId: (id: string | null) => void;
    setAnchorHighlightNodeId: (id: string | null) => void;
}