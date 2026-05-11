//canvas/renderers/TemporaryEdge
import { Line } from 'react-konva'
import type {TempEdge} from "../../model/types/edge.types.ts";
import {useEffect, useRef} from "react";
import Konva from "konva";


interface Props {
    connectionRef:
        React.MutableRefObject<TempEdge>
}

const TemporaryEdge = ({connectionRef}: Props) => {

    const lineRef =
        useRef<Konva.Line>(null)

    useEffect(() => {

        let frame: number

        const update = () => {

            const line =
                lineRef.current

            const c =
                connectionRef.current

            if (!line) {
                frame =
                    requestAnimationFrame(update)

                return
            }

            if (!c.active) {

                line.visible(false)

                line.getLayer()?.batchDraw()

                frame =
                    requestAnimationFrame(update)

                return
            }

            line.visible(true)

            line.points([
                c.fromX,
                c.fromY,

                c.toX,
                c.toY,
            ])

            line.getLayer()?.batchDraw()

            frame =
                requestAnimationFrame(update)
        }

        update()

        return () => {
            cancelAnimationFrame(frame)
        }

    }, [])

    return (
        <Line
            ref={lineRef}

            stroke="#2563EB"

            strokeWidth={2}

            listening={false}
            visible={false}

            dash={[6, 6]}

            perfectDrawEnabled={false}
        />
    )
}

export {
    TemporaryEdge
}