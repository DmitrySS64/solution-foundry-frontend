import type {DiagramEdge, EdgeAnchor} from "@/modules/diagram/model/types";

export const createEdge = (
    source: EdgeAnchor,
    target: EdgeAnchor,
): DiagramEdge => {
    return {
        id: crypto.randomUUID(),
        source,
        target,
        type: 'straight',
        controlPoints: [],
        style:{
            stroke: '#000',
            strokeWidth: 1,
            startCap: 'none',
            endCap: 'arrow',
        },
        label: '',
        labelStyle: {
            fill: '#111827',
            fontSize: 12,
            fontFamily: 'Arial',
            fontStyle: 'normal',
            fontWeight: 'normal',
        },
    }
}
