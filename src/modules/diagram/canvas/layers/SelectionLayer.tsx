//canvas/layers/SelectionLayer
import { Rect } from 'react-konva'
import type {ISelectionBox} from "../../store/slices/selection.slice.ts";

type Props = {
    box: ISelectionBox
}

const SelectionLayer = ({box}: Props) => {

    //const box = useSelectionBox()
    if (!box.active) {
        return null
    }
    if (!box) {
        return null
    }

    return (
        <Rect
            x={box.x}
            y={box.y}

            width={box.width}
            height={box.height}

            fill='rgba(37,99,235,0.1)'

            stroke='#2563EB'

            dash={[4, 4]}

            //listening={false}
        />
    )
}

export {
    SelectionLayer
}