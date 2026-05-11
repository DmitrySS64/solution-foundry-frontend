type NodeId = string
type EdgeId = string

interface Node {
    id: NodeId

    x: number
    y: number
    width: number
    height: number

    version: number // 🔥 важно для кеша
}

interface Edge {
    id: EdgeId

    source: {
        nodeId?: NodeId
        anchor?: string
        point?: { x: number; y: number }
    }

    target: {
        nodeId?: NodeId
        anchor?: string
        point?: { x: number; y: number }
    }

    controlPoints: { x: number; y: number }[]
}

interface GraphIndex {
    nodeToEdges: Map<NodeId, Set<EdgeId>>
}

export class DiagramEngine {

    nodes = new Map<string, Node>()
    edges = new Map<string, Edge>()

    index: GraphIndex = {
        nodeToEdges: new Map()
    }

    viewport = {
        x: 0,
        y: 0,
        zoom: 1
    }

    raf = 0
    dirty = false

    markDirty() {
        this.dirty = true
        this.schedule()
    }

    schedule() {
        if (this.raf) return

        this.raf = requestAnimationFrame(() => {
            this.raf = 0
            this.render()
        })
    }

    render() {
        if (!this.dirty) return
        this.dirty = false

        this.renderEdges()
        this.renderNodes()
    }

    renderEdges() {
        // Rendering is owned by React/Konva layers for now.
    }

    renderNodes() {
        // Rendering is owned by React/Konva layers for now.
    }
}
