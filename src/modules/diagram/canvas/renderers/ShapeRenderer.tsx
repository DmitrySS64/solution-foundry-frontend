//canvas/renderers/ShapeRenderer
import {
    Circle,
    Group,
    Image as KonvaImage,
    Rect,
    RegularPolygon,
    Text,
} from 'react-konva'
import type Konva from 'konva'
import type {
    DiagramNode,
    TempEdge
} from '../../model/types'
import type {
    NodeStyle,
    NodeTextStyle,
} from '../../model/types/node.types.ts'
import {
    useEditorActions,
    useSelectionIds,
} from '../../store/selectors.ts'
import {
    useEffect,
    useMemo,
    useState,
} from "react";
import {getNodeAnchors} from "../../model/factories/getNodeAnchors.ts";
import {AnchorOverlay} from "./AnchorOverlay.tsx";
import {nodeRegistry} from "@/modules/diagram/model/registry/nodeRegistry.ts";
import {useEditorStore} from "@/modules/diagram/store/editor.store.ts";
import {edgeRegistry} from "@/modules/diagram/model/registry/edgeRegistry.ts";
import {
    syncEdgeKonva,
} from "@/modules/diagram/model/util/syncEdgeKonva.ts";

const SvgNodeImage = ({
    svg,
    width,
    height,
}: {
    svg: string
    width: number
    height: number
}) => {
    const [image, setImage] =
        useState<HTMLImageElement | null>(null)

    useEffect(() => {
        const nextImage =
            new window.Image()

        nextImage.onload = () =>
            setImage(nextImage)

        nextImage.src =
            `data:image/svg+xml;charset=utf-8,${
                encodeURIComponent(svg)
            }`
    }, [svg])

    if (!image) {
        return null
    }

    return (
        <KonvaImage
            image={image}
            width={width}
            height={height}
            listening={false}
        />
    )
}

interface Props {
    node: DiagramNode,
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

const ShapeRenderer = ({
    node,
    tempConnectionRef,
    isConnectingRef,
    onStartConnection,
    onFinishConnection
}: Props) => {

    const selection = useSelectionIds()
    const anchorHighlight =
        useEditorStore(s =>
            s.interaction.anchorHighlightNodeId === node.id
        )
    const [hovered, setHovered] = useState(false)
    const { updateNode, selectNode, setNodeDragActive } =
        useEditorActions()

    const isSelected =
        selection.includes(node.id)

    const nodeStyle: NodeStyle =
        Object.assign(
            {
                fill: '#DBEAFE',
                stroke: '#3B82F6',
                strokeWidth: 2,
                cornerRadius: 8,
                opacity: 1,
            },
            node.style,
        )

    const textStyle: NodeTextStyle =
        Object.assign(
            {
                fill: '#111827',
                fontSize: 13,
                fontFamily: 'Arial',
                fontStyle: 'normal' as const,
                fontWeight: 'normal' as const,
                align: 'center' as const,
            },
            node.textStyle,
        )

    const konvaFontStyle =
        textStyle.fontStyle === 'italic' && textStyle.fontWeight === 'bold'
            ? 'italic bold'
            : textStyle.fontStyle === 'italic'
                ? 'italic'
                : textStyle.fontWeight === 'bold'
                    ? 'bold'
                    : 'normal'

    const anchors = useMemo(
        () => getNodeAnchors(node, true),
        [node.id, node.width, node.height]
    )

    const updateEdgesForNode = (nextNode: DiagramNode) => {
        const state = useEditorStore.getState()
        const edges = state.document.edges
        const allNodes = state.document.nodes.map(n =>
            n.id === nextNode.id ? nextNode : n
        )

        let edgeLayer: Konva.Layer | null = null

        const relatedEdges = edges.filter(
            e => e.source.nodeId === nextNode.id || e.target.nodeId === nextNode.id
        )

        for (const edge of relatedEdges) {
            const refs = edgeRegistry.get(edge.id)
            if (refs) {
                edgeLayer ??= refs.line.getLayer()
            }
            syncEdgeKonva(edge, allNodes)
        }

        edgeLayer?.batchDraw()
    };

    const scaleValue = (
        value: number | undefined,
        fallback: number,
        size: number,
    ) => {
        if (value === undefined) return fallback

        return Math.abs(value) <= 1
            ? value * size
            : value
    }

    const primitives =
        node.notation?.primitives
        ?? [
            {
                type: node.type,
                x: 0,
                y: 0,
                width: 1,
                height: 1,
            },
        ]

    return (
        <Group
            id={node.id}
            ref={(ref) => {
                if(!ref) {
                    nodeRegistry.delete(node.id)
                    return
                }
                nodeRegistry.set(node.id, ref)
            }}
            x={node.x}
            y={node.y}
            draggable={!isConnectingRef.current}
            onMouseDown={(e)=>{
                e.cancelBubble = true
            }}
            onDragStart={(e) => {
                if (isConnectingRef.current){
                    e.target.stopDrag()
                    return
                }
                e.cancelBubble = true;
                setNodeDragActive(true)
            }}
            onClick={() => selectNode(node.id)}
            onDragMove={(e) => {
                const pos = e.target.position();

                updateEdgesForNode({
                    ...node,
                    x: pos.x,
                    y: pos.y,
                });
            }}
            onDragEnd={(e) => {
                if (isConnectingRef.current){
                    return
                }
                setNodeDragActive(false)
                //e.cancelBubble = true
                updateNode(node.id, {
                    x: e.target.x(),
                    y: e.target.y(),
                })
            }}
            onMouseEnter={()=>setHovered(true)}
            onMouseLeave={() => {
                setHovered(false)
                }
            }
            onMouseUp={(e) => {
                if (!tempConnectionRef.current.active) return
                e.cancelBubble = true
                onFinishConnection(node.id)
            }}
        >
            {node.notation?.svg && (
                <SvgNodeImage
                    svg={node.notation.svg}
                    width={node.width}
                    height={node.height}
                />
            )}

            {!node.notation?.svg && primitives.map((primitive, index) => {
                const primitiveWidth =
                    scaleValue(
                        primitive.width,
                        node.width,
                        node.width,
                    )

                const primitiveHeight =
                    scaleValue(
                        primitive.height,
                        node.height,
                        node.height,
                    )

                const primitiveX =
                    scaleValue(
                        primitive.x,
                        0,
                        node.width,
                    )

                const primitiveY =
                    scaleValue(
                        primitive.y,
                        0,
                        node.height,
                    )

                const strokeWidth =
                    primitive.strokeWidth
                    ?? (
                        isSelected
                            ? nodeStyle.strokeWidth * 1.3
                            : nodeStyle.strokeWidth
                    )

                const commonProps = {
                    fill: primitive.fill ?? nodeStyle.fill,
                    stroke: primitive.stroke ?? nodeStyle.stroke,
                    strokeWidth,
                    opacity: nodeStyle.opacity,
                }

                if (primitive.type === 'circle') {
                    return (
                        <Circle
                            key={`${node.id}-primitive-${index}`}
                            x={primitiveX}
                            y={primitiveY}
                            radius={
                                scaleValue(
                                    primitive.radius,
                                    Math.min(node.width, node.height) / 2,
                                    Math.min(node.width, node.height),
                                )
                            }
                            {...commonProps}
                        />
                    )
                }

                if (primitive.type === 'diamond') {
                    return (
                        <RegularPolygon
                            key={`${node.id}-primitive-${index}`}
                            x={primitiveX + primitiveWidth / 2}
                            y={primitiveY + primitiveHeight / 2}
                            sides={4}
                            radius={Math.min(primitiveWidth, primitiveHeight) / Math.SQRT2}
                            rotation={45}
                            {...commonProps}
                        />
                    )
                }

                if (primitive.type === 'text') {
                    const boundText =
                        primitive.textKey
                            ? String(
                                node.notation?.properties.find(
                                    p => p.name === primitive.textKey
                                )?.value ?? ''
                            )
                            : (primitive.text ?? '')

                    return (
                        <Text
                            key={`${node.id}-primitive-${index}`}
                            x={primitiveX}
                            y={primitiveY}
                            width={primitiveWidth}
                            height={primitiveHeight}
                            text={boundText}
                            fill={primitive.fill ?? textStyle.fill}
                            fontSize={primitive.fontSize ?? textStyle.fontSize}
                            fontFamily={primitive.fontFamily ?? textStyle.fontFamily}
                            fontStyle={
                                primitive.fontStyle === 'italic' && primitive.fontWeight === 'bold'
                                    ? 'italic bold'
                                    : primitive.fontStyle === 'italic'
                                        ? 'italic'
                                        : primitive.fontWeight === 'bold'
                                            ? 'bold'
                                            : 'normal'
                            }
                            align={primitive.align ?? textStyle.align}
                            verticalAlign='middle'
                            listening={false}
                        />
                    )
                }

                return (
                    <Rect
                        key={`${node.id}-primitive-${index}`}
                        x={primitiveX}
                        y={primitiveY}
                        width={primitiveWidth}
                        height={primitiveHeight}
                        cornerRadius={nodeStyle.cornerRadius}
                        {...commonProps}
                    />
                )
            })}

            <Text
                width={node.width}
                height={node.height}

                text={node.label}

                fill={textStyle.fill}
                fontSize={textStyle.fontSize}
                fontFamily={textStyle.fontFamily}
                fontStyle={konvaFontStyle}
                align={textStyle.align}
                verticalAlign="middle"

                listening={false}
            />
            {(hovered || anchorHighlight) && (
                <>
                    {anchors.map(anchor => (
                        <AnchorOverlay
                            key={anchor.id}

                            x={anchor.x}
                            y={anchor.y}

                            onStartConnection={() => {
                                onStartConnection(
                                    node.id,
                                    anchor.id,

                                    node.x + anchor.x,
                                    node.y + anchor.y,
                                )
                            }}
                            onFinishConnection={() => {
                                onFinishConnection(
                                    node.id,
                                    anchor.id,
                                )
                            }}
                        />
                    ))}
                </>
            )}
        </Group>
    )
}

export {
    ShapeRenderer
}
