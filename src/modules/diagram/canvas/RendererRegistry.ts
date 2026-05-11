import type { DiagramNode } from '../model/types'

interface NodeRenderer {
    type: string

    render: (
        node: DiagramNode
    ) => React.ReactNode
}

class RendererRegistry {

    private renderers = new Map<string, NodeRenderer>()

    register(renderer: NodeRenderer) {
        this.renderers.set(renderer.type, renderer)
    }

    get(type: string) {
        return this.renderers.get(type)
    }
}

const rendererRegistry =
    new RendererRegistry()

export type {NodeRenderer}
export {rendererRegistry}