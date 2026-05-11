//store/selectors
import { useEditorStore } from './editor.store'

const useNodes = () =>
    useEditorStore(s => s.document.nodes)

const useEdges = () =>
    useEditorStore(s => s.document.edges)

const useViewport = () =>
    useEditorStore(s => s.viewport)

const useSetViewport = () =>
    useEditorStore(s => s.actions.setViewport)

const useSelectionIds = () =>
    useEditorStore(s => s.selection.ids)

const useEditorActions = () =>
    useEditorStore(s => s.actions)

const useAddNode = () =>
    useEditorStore(s => s.actions.addNode)
const useUpdateNode = () =>
    useEditorStore(s => s.actions.updateNode)
const useSelectNodeAction = () =>
    useEditorStore(s => s.actions.selectNode)

const useDocument = () =>
    useEditorStore(s => s.document)

const useNodeById = (
    id: string
) =>
    useEditorStore(
        s => s.document.nodes.find(
            n => n.id === id
        )
    )

const useSelectedNode = () =>
    useEditorStore((state) => {

        const selectedId =
            state.selection.ids[0]

        if (!selectedId) {
            return null
        }

        return state.document.nodes.find(
            node => node.id === selectedId
        ) || null
    })

const useSelectedEdge = () =>
    useEditorStore((state) => {

        const selectedId =
            state.selection.ids[0]

        if (!selectedId) {
            return null
        }

        return state.document.edges.find(
            edge => edge.id === selectedId
        ) || null
    })

const useSelectedNodes = () =>
    useEditorStore((state) => {

        return state.document.nodes.filter(
            node =>
                state.selection.ids.includes(
                    node.id
                )
        )
    })

const useSelectionBox = () =>
    useEditorStore(s => s.interaction.selectionBox)


export {
    useNodes,
    useEdges,
    useViewport,
    useSetViewport,
    useSelectionIds,
    useEditorActions,
    useAddNode,
    useSelectNodeAction,
    useUpdateNode,
    useDocument,
    useNodeById,
    useSelectedNode,
    useSelectedEdge,
    useSelectedNodes,
    useSelectionBox,
}
