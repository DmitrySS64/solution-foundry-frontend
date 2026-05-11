//canvas/renderers/AnchorOverlay
import { Circle } from 'react-konva'

interface Props {
    x: number
    y: number
    onStartConnection: () => void
    onFinishConnection?: () => void
}

const AnchorOverlay = ({
                           x,
                           y,
                           onStartConnection,
                           onFinishConnection,
                       }: Props) => {

    return (
        <Circle
            x={x}
            y={y}

            radius={7}

            fill="#2563EB"

            stroke="white"
            strokeWidth={2}

            perfectDrawEnabled={false}
            onMouseDown={(e)=>{
                e.cancelBubble = true
                //const stage = e.target.getStage()

                //if (!stage) return;

                //stage.draggable(false)
                onStartConnection()
            }}
            onMouseUp={(e) => {
                e.cancelBubble = true
                onFinishConnection?.()
            }}
        />
    )
}

export {
    AnchorOverlay
}
