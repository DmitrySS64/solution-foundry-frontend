//canvas/renderers/EdgeRenderer.tsx
import {Arrow, Group, Line, Text} from 'react-konva'
import type {DiagramEdge, EdgePoint} from '../../model/types'
import Konva from 'konva'
import {useEffect, useLayoutEffect, useRef} from 'react'
import {edgeRegistry} from '@/modules/diagram/model/registry/edgeRegistry.ts'
import {syncEdgeKonva} from '@/modules/diagram/model/util/syncEdgeKonva.ts'
import {useEditorActions, useNodes} from '@/modules/diagram/store/selectors.ts'
import {getKonvaFontStyle} from './labelStyleUtils'

import {
    flattenEdgePoints,
    resolveEdgePoints,
} from '@/modules/diagram/model/util/edgeGeometry.ts'

interface Props {
    edge: DiagramEdge
}

const EdgeRenderer = ({
    edge,
}: Props) => {
    const lineRef = useRef<Konva.Line>(null)
    const startCapRef = useRef<Konva.Arrow>(null)
    const endCapRef = useRef<Konva.Arrow>(null)
    const hoverLeaveTimer = useRef<number>(0)

    const nodes = useNodes()
    const {selectNode, updateEdge, setHoveredEdgeId} = useEditorActions()

    const clearHoverLeave = () => {
        if (hoverLeaveTimer.current) {
            window.clearTimeout(hoverLeaveTimer.current)
            hoverLeaveTimer.current = 0
        }
    }

    useEffect(() => {
        return () => {
            edgeRegistry.delete(edge.id)
            clearHoverLeave()
        }
    }, [edge.id])

    useLayoutEffect(() => {
        const line = lineRef.current
        if (!line) return

        edgeRegistry.set(edge.id, {
            line,
            startCap: startCapRef.current ?? undefined,
            endCap: endCapRef.current ?? undefined,
        })

        syncEdgeKonva(edge, nodes)
    }, [edge, nodes])

    const resolvedPoints =
        resolveEdgePoints(edge, nodes)

    // React-рендер стрелок использует points напрямую, но Line/Arrow не должны
    // получать «промежуточные» значения во время динамического обновления связи.
    // Поэтому, если geometry выглядит некорректно (например, всего 1 точка),
    // прячем точки и оставляем объекты невидимыми.
    const points =
        flattenEdgePoints(resolvedPoints)


    const getPointerInLayer = (
        target: Konva.Node,
    ): EdgePoint | null => {
        const stage =
            target.getStage()

        const layer =
            target.getLayer()

        const pointer =
            stage?.getPointerPosition()

        if (!pointer || !layer) {
            return null
        }

        const transform =
            layer.getAbsoluteTransform().copy()

        transform.invert()

        return transform.point(pointer)
    }

    const addControlPoint = (
        point: EdgePoint,
    ) => {
        updateEdge(edge.id, {
            type: 'orthogonal',
            controlPoints: [
                ...edge.controlPoints,
                point,
            ],
        })
    }

    const labelPoint =
        resolvedPoints[
            Math.floor(resolvedPoints.length / 2)
        ]

    const labelStyle = Object.assign(
        {
            fill: edge.style.stroke,
            fontSize: 12,
            fontFamily: 'Arial',
            fontStyle: 'normal' as const,
            fontWeight: 'normal' as const,
        },
        edge.labelStyle,
    )

    return (
        <Group
            onMouseEnter={() => {
                clearHoverLeave()
                setHoveredEdgeId(edge.id)
            }}
            onMouseLeave={() => {
                clearHoverLeave()
                hoverLeaveTimer.current = window.setTimeout(() => {
                    setHoveredEdgeId(null)
                    hoverLeaveTimer.current = 0
                }, 140)
            }}
        >
            <Line
                ref={lineRef}
                points={points}
                stroke={edge.style.stroke}
                strokeWidth={edge.style.strokeWidth}
                dash={edge.style.dash}
                hitStrokeWidth={8}
                lineCap="round"
                lineJoin="round"
                perfectDrawEnabled={false}
                onClick={(e) => {
                    e.cancelBubble = true
                    selectNode(edge.id)
                }}
                onDblClick={(e) => {
                    e.cancelBubble = true
                    const point =
                        getPointerInLayer(e.target)

                    if (point) {
                        addControlPoint(point)
                    }
                }}
            />

            {edge.style.startCap === 'arrow' && (

                <Arrow
                    ref={startCapRef}
                    points={[
                        resolvedPoints[1].x,
                        resolvedPoints[1].y,
                        resolvedPoints[0].x,
                        resolvedPoints[0].y,
                    ]}
                    stroke={edge.style.stroke}
                    fill={edge.style.stroke}
                    strokeWidth={edge.style.strokeWidth}
                    pointerLength={10}
                    pointerWidth={8}
                    listening={false}
                />
            )}

            {edge.style.endCap === 'arrow' && (

                <Arrow
                    ref={endCapRef}
                    points={[
                        resolvedPoints[resolvedPoints.length - 2].x,
                        resolvedPoints[resolvedPoints.length - 2].y,
                        resolvedPoints[resolvedPoints.length - 1].x,
                        resolvedPoints[resolvedPoints.length - 1].y,
                    ]}
                    stroke={edge.style.stroke}
                    fill={edge.style.stroke}
                    strokeWidth={edge.style.strokeWidth}
                    pointerLength={10}
                    pointerWidth={8}
                    listening={false}
                />
            )}



            {edge.label && labelPoint && (
                <Text
                    x={labelPoint.x + 8}
                    y={labelPoint.y - 20}
                    text={edge.label}
                    fontSize={labelStyle.fontSize}
                    fontFamily={labelStyle.fontFamily}
                    fontStyle={
                        getKonvaFontStyle({
                            fontStyle: labelStyle.fontStyle as any,
                            fontWeight: labelStyle.fontWeight as any,
                        })
                    }
                    fill={labelStyle.fill}
                    listening={false}
                />
            )}

        </Group>
    )
}

export {
    EdgeRenderer
}
