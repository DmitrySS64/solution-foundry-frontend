// model/util/updateEdgeVisual.ts
import type {DiagramEdge, DiagramNode} from '../types';
import {useEditorStore} from '@/modules/diagram/store/editor.store.ts';
import {syncEdgeKonva} from './syncEdgeKonva';

export const updateEdgeVisual = (edge: DiagramEdge, node: DiagramNode) => {
    void node
    const nodes = useEditorStore.getState().document.nodes
    syncEdgeKonva(edge, nodes)
};