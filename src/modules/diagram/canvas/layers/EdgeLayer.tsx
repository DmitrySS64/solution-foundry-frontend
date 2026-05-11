//canvas/layers/EdgeLayer.tsx
import { EdgeRenderer }
    from '../renderers'

import { useEdges }
    from '../../store/selectors.ts'

const EdgeLayer = () => {

    const edges = useEdges() // TODO сделать через ref

    return (
        <>
            {/*<ListeningLayer
                listening={false}
            />*/}
            {edges.map(edge => (
                <EdgeRenderer
                    key={edge.id}
                    edge={edge}
                />
            ))}
        </>
    )
}

export {EdgeLayer}