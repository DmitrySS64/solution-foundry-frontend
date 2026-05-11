//store/editor.store
import type {DiagramDocument} from "../model/types/document.types.ts";
import type {DiagramNode} from "../model/types/node.types.ts";
import type {DiagramEdge} from "../model/types/edge.types.ts";
import {immer} from "zustand/middleware/immer";
import {create} from "zustand";
import type {ISelectionBox} from "@/modules/diagram/store/slices/selection.slice.ts";
import {recalculateEdge} from "@/modules/diagram/model/util/recalculateEdge.ts";
import {
    createEmptyHistory,
    pushPastSnapshot,
    redoSnapshot,
    undoSnapshot,
} from "@/modules/diagram/store/history/documentHistory.ts";

interface EditorState {
    document: DiagramDocument

    history: {
        past: DiagramDocument[]
        future: DiagramDocument[]
    }

    selection: {
        ids: string[]
    }

    viewport: {
        x: number
        y: number
        zoom: number
    }

    interaction: {
        dragging: boolean
        hoveredId?: string
        nodeDragActive: boolean
        edgeHandleDragActive: boolean
        hoveredEdgeId?: string | null
        anchorHighlightNodeId?: string | null
        selectionBox?: ISelectionBox
    }

    actions: {
        undo: () => void
        redo: () => void

        addNode: (node: DiagramNode) => void
        updateNode: (id: string, updater: Partial<DiagramNode>) => void
        deleteNode: (id: string) => void

        addEdge: (edge: DiagramEdge) => void
        updateEdge: (id: string, updater: Partial<DiagramEdge>) => void
        deleteEdge: (id: string) => void

        deleteSelection: () => void

        selectNode: (id: string | null) => void

        setViewport: (x: number, y: number, zoom: number) => void
        loadDocument: (document: DiagramDocument) => void
        clearDocument: () => void

        setNodeDragActive: (active: boolean) => void
        setEdgeHandleDragActive: (active: boolean) => void
        setHoveredEdgeId: (id: string | null) => void
        setAnchorHighlightNodeId: (id: string | null) => void
    }
}

export const useEditorStore = create<EditorState>()(
    immer((set) => ({
        history: createEmptyHistory(),

        document: {
            nodes: [],
            edges: [],
        },

        selection: {
            ids: [],
        },

        viewport: {
            x: 0,
            y: 0,
            zoom: 1,
        },

        interaction: {
            dragging: false,
            nodeDragActive: false,
            edgeHandleDragActive: false,
            hoveredEdgeId: null,
            anchorHighlightNodeId: null,
        },

        actions: {
            undo: () =>
                set((state) => {
                    const current = state.document
                    const result = undoSnapshot(state.history, current)
                    if (!result.nextSnapshot) return state
                    state.history = result.nextHistory
                    state.document = result.nextSnapshot
                }),

            redo: () =>
                set((state) => {
                    const current = state.document
                    const result = redoSnapshot(state.history, current)
                    if (!result.nextSnapshot) return state
                    state.history = result.nextHistory
                    state.document = result.nextSnapshot
                }),

            addNode: (node) =>
                set((state) => {
                    state.history = pushPastSnapshot(state.history, state.document)
                    state.history.future = []

                    if (!node.edges) node.edges = []
                    state.document.nodes.push(node)
                }),

            updateNode: (id, updater) =>
                set((state) => {
                    state.history = pushPastSnapshot(state.history, state.document)
                    state.history.future = []

                    const node =
                        state.document.nodes.find(n => n.id === id)
                    if (!node) return

                    Object.assign(node, updater)

                    if (node.edges && Array.isArray(node.edges)) {
                        for (const edgeRef of node.edges) {
                            const edge = state.document.edges.find(
                                e => e.id === edgeRef.id
                            )
                            if (edge) recalculateEdge(edge, node)
                        }
                    }

                    node.updatedAt = Date.now()
                }),

            deleteNode: (id) =>
                set((state) => {
                    state.history = pushPastSnapshot(state.history, state.document)
                    state.history.future = []

                    state.document.nodes = state.document.nodes.filter(n => n.id !== id)
                    state.document.edges = state.document.edges.filter(
                        e => e.source?.nodeId !== id && e.target?.nodeId !== id
                    )

                    // also purge edges refs in nodes
                    for (const node of state.document.nodes) {
                        node.edges = (node.edges ?? []).filter(edgeRef =>
                            state.document.edges.some(edge => edge.id === edgeRef.id)
                        )
                    }
                }),

            addEdge: (edge) =>
                set((state) => {
                    state.history = pushPastSnapshot(state.history, state.document)
                    state.history.future = []

                    state.document.edges.push(edge)

                    const source = state.document.nodes.find(n => n.id === edge.source?.nodeId)
                    const target = state.document.nodes.find(n => n.id === edge.target?.nodeId)

                    if (source) {
                        if (!source.edges) source.edges = []
                        source.edges.push({id: edge.id, direction: 'out'})
                    }
                    if (target && target.id !== source?.id) {
                        if (!target.edges) target.edges = []
                        target.edges.push({id: edge.id, direction: 'in'})
                    }
                }),

            updateEdge: (id, updater) =>
                set((state) => {
                    state.history = pushPastSnapshot(state.history, state.document)
                    state.history.future = []

                    const edge = state.document.edges.find(e => e.id === id)
                    if (!edge) return

                    Object.assign(edge, updater)

                    // remove existing edge refs
                    for (const node of state.document.nodes) {
                        node.edges = (node.edges ?? []).filter(edgeRef => edgeRef.id !== edge.id)
                    }

                    const source = state.document.nodes.find(n => n.id === edge.source?.nodeId)
                    const target = state.document.nodes.find(n => n.id === edge.target?.nodeId)

                    if (source) {
                        source.edges.push({
                            id: edge.id,
                            direction: 'out',
                        })
                    }

                    if (target && target.id !== source?.id) {
                        if (!target.edges) target.edges = []
                        target.edges.push({
                            id: edge.id,
                            direction: 'in',
                        })
                    }
                }),

            deleteEdge: (id) =>
                set((state) => {
                    state.history = pushPastSnapshot(state.history, state.document)
                    state.history.future = []

                    state.document.edges = state.document.edges.filter(edge => edge.id !== id)

                    for (const node of state.document.nodes) {
                        node.edges = (node.edges ?? []).filter(edgeRef => edgeRef.id !== id)
                    }
                }),

            deleteSelection: () =>
                set((state) => {
                    state.history = pushPastSnapshot(state.history, state.document)
                    state.history.future = []

                    const selected = new Set(state.selection.ids)

                    state.document.nodes = state.document.nodes.filter(node => !selected.has(node.id))

                    state.document.edges = state.document.edges.filter(edge => {
                        if (selected.has(edge.id)) return false
                        if (selected.has(edge.source?.nodeId ?? '')) return false
                        if (selected.has(edge.target?.nodeId ?? '')) return false
                        return true
                    })

                    for (const node of state.document.nodes) {
                        node.edges = (node.edges ?? []).filter(edgeRef =>
                            state.document.edges.some(edge => edge.id === edgeRef.id)
                        )
                    }

                    state.selection.ids = []
                }),

            selectNode: (id) =>
                set((state) => {
                    state.selection.ids = id ? [id] : []
                }),

            setViewport: (x, y, zoom) =>
                set((state) => {
                    state.viewport = {x, y, zoom}
                }),

            loadDocument: (document) =>
                set((state) => {
                    state.history = createEmptyHistory()
                    state.document = document
                }),

            clearDocument: () =>
                set((state) => {
                    state.history = createEmptyHistory()
                    state.document = {nodes: [], edges: []}
                    state.selection.ids = []
                }),

            setNodeDragActive: (active) =>
                set((state) => {
                    state.interaction.nodeDragActive = active
                }),

            setEdgeHandleDragActive: (active) =>
                set((state) => {
                    state.interaction.edgeHandleDragActive = active
                }),

            setHoveredEdgeId: (id) =>
                set((state) => {
                    state.interaction.hoveredEdgeId = id
                }),

            setAnchorHighlightNodeId: (id) =>
                set((state) => {
                    state.interaction.anchorHighlightNodeId = id
                }),
        },
    }))
)

export type {EditorState}

