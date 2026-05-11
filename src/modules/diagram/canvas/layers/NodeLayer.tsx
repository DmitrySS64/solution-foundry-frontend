//canvas/layers/NodeLayer
import { ShapeRenderer } from '../renderers'
import { useNodes } from '../../store/selectors.ts'
import type {TempEdge} from "../../model/types";

interface Props {
    tempConnectionRef: React.MutableRefObject<TempEdge>
    isConnectingRef: React.MutableRefObject<boolean>
    onStartConnection: (
        nodeId: string,
        anchorId: string,
        x: number,
        y: number,
    ) => void

    onFinishConnection: (
        nodeId: string,
        anchorId?: string,
    ) => void
}

const NodeLayer = ({
    tempConnectionRef,
    isConnectingRef,
    onStartConnection,
    onFinishConnection,
}: Props) => {

    const nodes = useNodes()

    return (
        <>
            {nodes.map(node => (
                <ShapeRenderer
                    key={node.id}
                    node={node}
                    tempConnectionRef={tempConnectionRef}
                    isConnectingRef={isConnectingRef}
                    onStartConnection={onStartConnection}
                    onFinishConnection={onFinishConnection}
                />
            ))}
        </>
    )
}

export {NodeLayer}
