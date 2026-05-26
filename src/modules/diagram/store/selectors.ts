//store/selectors
import { useEditorStore } from './editor.store'
import { useShallow } from 'zustand/shallow'

const useNodes = () =>
    useEditorStore(useShallow(s => {
        const nodes = s.document?.nodes ?? [];
        // ✅ Возвращаем только строковые ID
        return nodes.map(n => String(n.id));
    }));

const useEdges = () =>
    useEditorStore(useShallow(s => s.document?.edges ?? []));

const useViewport = () =>
    useEditorStore(useShallow(s => s.viewport))

const useSetViewport = () =>
    useEditorStore(useShallow(s => s.actions.setViewport))

const useSelectionIds = () =>
    useEditorStore(useShallow(s => s.selection?.ids ?? []))

const useEditorActions = () =>
    useEditorStore(useShallow(s => s.actions))

const useAddNode = () =>
    useEditorStore(useShallow(s => s.actions.addNode))
const useUpdateNode = () =>
    useEditorStore(useShallow(s => s.actions.updateNode))
const useSelectNodeAction = () =>
    useEditorStore(useShallow(s => s.actions.selectNode))

const useDocument = () =>
    useEditorStore(useShallow(s => s.document ?? { nodes: [], edges: [] }))

const useNodeById = (
    id: string
) =>
    useEditorStore(useShallow(s => s.document?.nodes?.find(
        n => n.id === id
    )))

const useSelectedNode = () =>
    useEditorStore(useShallow((state) => {

        const selectedId =
            state.selection?.ids?.[0]

        if (!selectedId) {
            return null
        }

        return state.document?.nodes?.find(
            node => node.id === selectedId
        ) ?? null
    }))

const useSelectedEdge = () =>
    useEditorStore(useShallow((state) => {

        const selectedId =
            state.selection?.ids?.[0]

        if (!selectedId) {
            return null
        }

        return state.document?.edges?.find(
            edge => edge.id === selectedId
        ) ?? null
    }))

const useSelectedNodes = () =>
    useEditorStore((state) => {
        const ids = state.selection?.ids ?? [];
        return state.document?.nodes?.filter(
            node =>
                ids.includes(
                    node.id
                )
        ) ?? []
    })

const useSelectionBox = () =>
    useEditorStore(useShallow(s => s.selection?.box ?? null));

const useRemoteUsers = () =>
    useEditorStore(useShallow(s => s.remoteUsers));


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
    useRemoteUsers
}
