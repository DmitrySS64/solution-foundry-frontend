import type {DiagramEdge, DiagramNode} from "@/modules/diagram/model/types";

export interface IDocumentState {
    document: { nodes: DiagramNode[]; edges: DiagramEdge[] };
}

export interface IDocumentActions {
    addNode: (node: DiagramNode) => void;
    updateNode: (id: string, updater: Partial<DiagramNode>) => void;
    deleteNode: (id: string) => void;
    addEdge: (edge: DiagramEdge) => void;
    updateEdge: (id: string, updater: Partial<DiagramEdge>) => void;
    deleteEdge: (id: string) => void;
    setNodes: (nodes: DiagramNode[]) => void;
    setEdges: (edges: DiagramEdge[]) => void;
    loadDocument: (document: { nodes: DiagramNode[]; edges: DiagramEdge[] }) => void;
    clearDocument: () => void;
    updateNodeGranular: (id, updatedNode) => void;
    addNodeFromNetwork: (node) => void;
    deleteNodeFromNetwork: (id) => void;
    updateEdgeGranular: (id, updatedEdge) => void;
    addEdgeFromNetwork: (edge) => void;
    deleteEdgeFromNetwork: (id) => void;
}