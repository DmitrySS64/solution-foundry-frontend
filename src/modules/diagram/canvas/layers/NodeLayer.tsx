//canvas/layers/NodeLayer
import { ShapeRenderer } from '../renderers'
import { useNodes } from '../../store/selectors.ts'
import type {TempEdge} from "../../model/types";

interface Props {
    tempConnectionRef: React.MutableRefObject<TempEdge>
    isConnectingRef: React.MutableRefObject<boolean>
    isEditable: boolean
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

    onStartEditing?: (nodeId: string) => void
    onStopEditing?: () => void
}

const NodeLayer = ({
    isEditable,
    onStartEditing,
    onStopEditing,
    ...rest
}: Props) => {
    const nodeIds = useNodes()
    return (
        <>
            {nodeIds.map(id => (
                <ShapeRenderer
                    key={String(id)}
                    nodeId={id}
                    isEditable={isEditable}
                    onStartEditing={onStartEditing}
                    onStopEditing={onStopEditing}
                    {...rest}
                />
            ))}
        </>
    )
}

export {NodeLayer}
