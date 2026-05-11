import type { DiagramDocument }
    from '../types/document.types'
import type {DiagramNode} from '../types/node.types'
import type {DiagramEdge} from '../types/edge.types'

class DocumentSerializer {

    static serialize(
        document: DiagramDocument
    ) {

        return JSON.stringify(
            document,
            null,
            2
        )
    }

    static deserialize(
        raw: string
    ): DiagramDocument {

        const parsed =
            JSON.parse(raw)

        const nodes = (
            Array.isArray(parsed.nodes)
                ? parsed.nodes
                : Object.values(parsed.nodes ?? {})
        ).map(DocumentSerializer.normalizeNode)

        const edges = (
            Array.isArray(parsed.edges)
                ? parsed.edges
                : Object.values(parsed.edges ?? {})
        ).map(DocumentSerializer.normalizeEdge)

        nodes.forEach(node => {
            node.edges = []
        })

        edges.forEach(edge => {
            const source =
                nodes.find(node => node.id === edge.source.nodeId)

            const target =
                nodes.find(node => node.id === edge.target.nodeId)

            source?.edges.push({
                id: edge.id,
                direction: 'out',
            })

            if (target && target.id !== source?.id) {
                target.edges.push({
                    id: edge.id,
                    direction: 'in',
                })
            }
        })

        return {nodes, edges}
    }

    private static normalizeNode(
        node: DiagramNode,
    ): DiagramNode {
        return {
            ...node,
            edges: node.edges ?? [],
            style: Object.assign(
                {
                    fill: '#DBEAFE',
                    stroke: '#3B82F6',
                    strokeWidth: 2,
                    cornerRadius: 8,
                    opacity: 1,
                },
                node.style,
            ),
            textStyle: Object.assign(
                {
                    fill: '#111827',
                    fontSize: 13,
                    fontFamily: 'Arial',
                    fontStyle: 'normal',
                    fontWeight: 'normal',
                    align: 'center',
                },
                node.textStyle,
            ),
        }
    }

    private static normalizeEdge(
        edge: DiagramEdge,
    ): DiagramEdge {
        return {
            ...edge,
            type: edge.type ?? 'straight',
            controlPoints: edge.controlPoints ?? [],
            label: edge.label ?? '',
            style: Object.assign(
                {
                    stroke: '#111827',
                    strokeWidth: 2,
                },
                edge.style,
            ),
        }
    }
}

export {DocumentSerializer}
