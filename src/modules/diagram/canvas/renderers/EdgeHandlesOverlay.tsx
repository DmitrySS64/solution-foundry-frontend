//canvas/renderers/EdgeHandlesOverlay.tsx
import {Circle, Group} from 'react-konva'
import {useMemo} from 'react'
import type {DiagramEdge, EdgePoint} from '../../model/types'
import {useEditorActions, useEdges, useNodes, useSelectionIds} from '../../store/selectors'
import {useEditorStore} from '@/modules/diagram/store/editor.store.ts'
import {resolveEdgePoints} from '@/modules/diagram/model/util/edgeGeometry.ts'
import {snapEdgeEndpointToGraph} from '@/modules/diagram/model/util/edgeEndpointSnap.ts'
import {syncEdgeKonva} from '@/modules/diagram/model/util/syncEdgeKonva.ts'

const EdgeHandlesOverlay = () => {
    const edges = useEdges()
    const nodes = useNodes()
    const selectionIds = useSelectionIds()
    const nodeDragActive = useEditorStore(s => s.interaction.nodeDragActive)
    const {updateEdge, selectNode} = useEditorActions()

    const selectedEdge = useMemo(() => {
        const id = selectionIds.find(sid => edges.some(e => e.id === sid))
        if (!id) return null
        return edges.find(e => e.id === id) ?? null
    }, [edges, selectionIds])

    if (!selectedEdge || nodeDragActive) {
        return null
    }

    const edge = selectedEdge

    const resolvedPoints = resolveEdgePoints(edge, nodes)
    const startPoint = resolvedPoints[0]
    const endPoint = resolvedPoints[resolvedPoints.length - 1]

    const mergeEdge = (patch: Partial<DiagramEdge>) =>
        ({...edge, ...patch} as DiagramEdge)

    const updateControlPoint = (index: number, point: EdgePoint) => {
        updateEdge(edge.id, {
            controlPoints: edge.controlPoints.map((c, i) =>
                i === index ? point : c),
        })
    }

    const insertControlPoint = (segmentIndex: number, point: EdgePoint) => {
        const insertAt = Math.max(
            0,
            Math.min(segmentIndex, edge.controlPoints.length),
        )
        updateEdge(edge.id, {
            type: 'orthogonal',
            controlPoints: [
                ...edge.controlPoints.slice(0, insertAt),
                point,
                ...edge.controlPoints.slice(insertAt),
            ],
        })
    }

    return (
        <Group listening={true}>
            {edge.controlPoints.map((point, index) => (
                <Circle
                    key={`${edge.id}-ctrl-${index}`}
                    x={point.x}
                    y={point.y}
                    radius={6}
                    fill="#FFFFFF"
                    stroke="#2563EB"
                    strokeWidth={2}
                    draggable
                    onDragStart={() => {
                        useEditorStore.getState().actions.setEdgeHandleDragActive(true)
                    }}
                    onDragMove={(e) => {
                        const next = [...edge.controlPoints]
                        next[index] = {x: e.target.x(), y: e.target.y()}
                        syncEdgeKonva(mergeEdge({controlPoints: next}), nodes)
                    }}
                    onDragEnd={(e) => {
                        useEditorStore.getState().actions.setEdgeHandleDragActive(false)
                        updateControlPoint(index, {
                            x: e.target.x(),
                            y: e.target.y(),
                        })
                    }}
                    onClick={(e) => {
                        e.cancelBubble = true
                        selectNode(edge.id)
                    }}
                />
            ))}

            {resolvedPoints.slice(0, -1).map((p, i) => {
                const next = resolvedPoints[i + 1]
                const mid = {
                    x: (p.x + next.x) / 2,
                    y: (p.y + next.y) / 2,
                }
                return (
                    <Circle
                        key={`${edge.id}-mid-${i}`}
                        x={mid.x}
                        y={mid.y}
                        radius={5}
                        fill="rgba(37,99,235,0.2)"
                        stroke="#2563EB"
                        strokeWidth={1}
                        onClick={(e) => {
                            e.cancelBubble = true
                            insertControlPoint(i, mid)
                        }}
                    />
                )
            })}

            <Circle
                x={startPoint.x}
                y={startPoint.y}
                radius={7}
                fill="#FFFFFF"
                stroke="#16A34A"
                strokeWidth={2}
                draggable
                onDragStart={() => {
                    useEditorStore.getState().actions.setEdgeHandleDragActive(true)
                }}
                onDragMove={(e) => {
                    const point = {x: e.target.x(), y: e.target.y()}
                    const tempEdge = {
                        ...edge,
                        source: {
                            ...edge.source,
                            nodeId: undefined,
                            point,
                        },
                    };
                    syncEdgeKonva(
                        tempEdge,
                        //mergeEdge({
                        //    source: {
                        //        ...edge.source,
                        //        point,
                        //    },
                        //}),
                        nodes,
                    )
                }}
                onDragEnd={(e) => {
                    useEditorStore.getState().actions.setEdgeHandleDragActive(false)
                    const point = {x: e.target.x(), y: e.target.y()}
                    const newSource = snapEdgeEndpointToGraph(point, nodes)
                    updateEdge(edge.id, { source: newSource,})
                }}
                onClick={(e) => {
                    e.cancelBubble = true
                    selectNode(edge.id)
                }}
            />

            <Circle
                x={endPoint.x}
                y={endPoint.y}
                radius={7}
                fill="#FFFFFF"
                stroke="#16A34A"
                strokeWidth={2}
                draggable
                onDragStart={() => {
                    useEditorStore.getState().actions.setEdgeHandleDragActive(true)
                }}
                onDragMove={(e) => {
                    const point = {x: e.target.x(), y: e.target.y()}
                    const tempEdge = {
                        ...edge,
                        target: {
                            ...edge.target,
                            nodeId: undefined, // убираем привязку
                            point,
                        },
                    };
                    syncEdgeKonva(
                        tempEdge,
                        //mergeEdge({
                        //    target: {
                        //        ...edge.target,
                        //        point,
                        //    },
                        //}),
                        nodes,
                    )
                }}
                onDragEnd={(e) => {
                    useEditorStore.getState().actions.setEdgeHandleDragActive(false)
                    const point = {x: e.target.x(), y: e.target.y()}
                    updateEdge(edge.id, {
                        target: snapEdgeEndpointToGraph(point, nodes),
                    })
                }}
                onClick={(e) => {
                    e.cancelBubble = true
                    selectNode(edge.id)
                }}
            />
        </Group>
    )
}

export {EdgeHandlesOverlay}
