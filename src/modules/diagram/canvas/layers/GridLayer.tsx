//canvas/layres/GridLayer
import { Line } from 'react-konva'
import type { ReactElement } from 'react'

const GridLayer = () => {

    const lines: ReactElement[] = []

    const size = 5000
    const step = 24

    for (let x = -size; x <= size; x += step) {

        lines.push(
            <Line
                key={`v-${x}`}
                points={[x, -size, x, size]}
                stroke="#E4E4E7"
                strokeWidth={1}
            />
        )
    }

    for (let y = -size; y <= size; y += step) {

        lines.push(
            <Line
                key={`h-${y}`}
                points={[-size, y, size, y]}
                stroke="#E4E4E7"
                strokeWidth={1}
            />
        )
    }

    return <>{lines}</>
}

export {
    GridLayer
}
