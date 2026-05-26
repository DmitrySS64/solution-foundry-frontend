//canvas/renderers/ShapeRenderer
import { Circle, Group, Rect, RegularPolygon, Text, } from 'react-konva'
import type Konva from 'konva'
import type { DiagramNode, TempEdge } from '../../model/types'
import { useEditorActions, useSelectionIds,} from '../../store/selectors.ts'
import React, {useCallback, useEffect, useMemo, useState, useRef} from "react";
import {getNodeAnchors} from "../../model/factories/getNodeAnchors.ts";
import {AnchorOverlay} from "./AnchorOverlay.tsx";
import {nodeRegistry} from "@/modules/diagram/model/registry/nodeRegistry.ts";
import {useEditorStore} from "@/modules/diagram/store/editor.store.ts";
import {edgeRegistry} from "@/modules/diagram/model/registry/edgeRegistry.ts";
import { syncEdgeKonva, } from "@/modules/diagram/model/util/syncEdgeKonva.ts";
import { customRendererRegistry } from '@/modules/diagram/canvas/customRenderers';
import {EditableLabel} from "@/modules/diagram/canvas/renderers/EditableLabel.tsx";
import {NotationImage} from "@/modules/diagram/canvas/renderers/NotationImage.tsx";
import {getPreserveAspectRatio, resolveImageSource} from "@/modules/diagram/canvas/renderers/utils/imageUtils.ts";
import {getKonvaFontStyle, mergeTextStyles} from "@/modules/diagram/canvas/renderers/utils/textStyles.ts";
import {stopKonvaPropagation} from "@/modules/diagram/canvas/renderers/utils/eventHandlers.ts";
import { debounce, DebouncedFunc } from 'lodash';

// === CONSTANTS ===
const DEFAULT_NODE_STYLE = {
    fill: '#DBEAFE',
    stroke: '#3B82F6',
    strokeWidth: 2,
    cornerRadius: 8,
    opacity: 1,
} as const;

const MIN_NODE_SIZE = 40;

// === TYPES ===
interface Props {
    nodeId: string;
    isEditable: boolean;
    tempConnectionRef: React.MutableRefObject<TempEdge>;
    isConnectingRef: React.MutableRefObject<boolean>;
    onStartConnection: (nodeId: string, anchorId: string, x: number, y: number) => void;
    onFinishConnection: (nodeId: string, anchorId?: string) => void;
    onStartEditing?: (nodeId: string) => void;
    onStopEditing?: () => void;
}


// === COMPONENT ===
export const ShapeRenderer = ({
                                  nodeId,
                                  isEditable,
                                  tempConnectionRef,
                                  isConnectingRef,
                                  onStartConnection,
                                  onFinishConnection,
                                  onStartEditing,
                                  onStopEditing,
                              }: Props) => {
    // === SELECTORS ===
    const node = useEditorStore(s => s.document?.nodes?.find(n => n.id === nodeId));
    const selection = useSelectionIds();
    const { updateNode, selectNode, setNodeDragActive } = useEditorActions();
    const anchorHighlight = useEditorStore(s =>
        node ? s.interaction.anchorHighlightNodeId === node.id : false
    );
    const [hovered, setHovered] = useState(false);

    // === DERIVED STATE ===
    const isSelected = useMemo(() =>
            node ? (selection ?? []).includes(node.id) : false,
        [node?.id, selection]
    );

    const nodeStyle = useMemo(() => ({
        ...DEFAULT_NODE_STYLE,
        ...node?.style,
    }), [node?.style]);

    const textStyle = useMemo(() =>
            mergeTextStyles(node?.textStyle),
        [node?.textStyle]
    );

    const anchors = useMemo(() =>
            node ? getNodeAnchors(node, true) : [],
        [node?.id, node?.width, node?.height]
    );

    const primitives = useMemo(() =>
            node?.notation?.primitives ?? [{ type: node?.type, x: 0, y: 0, width: 1, height: 1 }],
        [node?.type, node?.notation?.primitives]
    );

    // === EDGE SYNC ===
    const updateEdgesForNode = useCallback((nextNode: DiagramNode) => {
        const state = useEditorStore.getState();

        // ✅ Защита: если edges undefined — используем пустой массив
        const edges = state.document?.edges ?? [];
        const nodes = state.document?.nodes ?? [];

        // Находим слой для перерисовки
        const edgeLayer = edges
            .filter(e => e.source?.nodeId === nextNode.id || e.target?.nodeId === nextNode.id)
            .reduce<Konva.Layer | null>((layer, edge) => {
                const refs = edgeRegistry.get(edge.id);
                if (refs && !layer) return refs.line.getLayer();
                return layer;
            }, null);

        // Создаём массив всех нод с обновлённой текущей
        const allNodes = nodes.map(n =>
            n.id === nextNode.id ? nextNode : n
        );

        // Пересчитываем геометрию рёбер
        for (const edge of edges) {
            if (edge.source?.nodeId === nextNode.id || edge.target?.nodeId === nextNode.id) {
                syncEdgeKonva(edge, allNodes);
            }
        }

        // Перерисовываем слой, если нашли
        edgeLayer?.batchDraw();
    }, []);

    // Sync edges when node position/size changes (from network or local)
    useEffect(() => {
        if (node && node.x !== undefined && node.y !== undefined) {
            updateEdgesForNode(node);
        }
    }, [node?.x, node?.y, node?.width, node?.height, updateEdgesForNode]);

    // Cleanup on unmount
    useEffect(() => () => {
        const konvaGroup = nodeRegistry.get(nodeId);
        if (konvaGroup) {
            konvaGroup.destroy();
            nodeRegistry.delete(nodeId);
        }
    }, [nodeId]);

    // === EVENT HANDLERS ===
    const dragState = useRef<{ x: number; y: number } | null>(null);

    const handleDragMove = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
        if (!node) return;
        const pos = e.target.position();

        // 1. Локально обновляем позицию для плавного UI (без Zustand/Yjs)
        dragState.current = { x: pos.x, y: pos.y };

        // 2. Мгновенно перерисовываем только привязанные рёбра (Konva layer)
        updateEdgesForNode({ ...node, x: pos.x, y: pos.y });

        // 3. Debounced-отправка в сеть (не чаще 1 раза в 100-150мс)
        debouncedNetworkSync.current?.();
    }, [node, updateEdgesForNode]);

// Debounce для сетевой синхронизации
    const debouncedNetworkSync = useRef<DebouncedFunc<(() => void)> | null>(null);

    useEffect(() => {
        const debounced = debounce(() => {
            if (dragState.current && node) {
                updateNode(node.id, { x: dragState.current.x, y: dragState.current.y });
                dragState.current = null;
            }
        }, 150); // 150мс — баланс между плавностью и нагрузкой на сеть

        debouncedNetworkSync.current = debounced;

        return () => {
            debouncedNetworkSync.current?.cancel();
        };
    }, [node?.id, updateNode]);

    const handleDragEnd = useCallback(() => {
        setNodeDragActive(false);

        // Финальный синк, если остались незаписанные изменения
        if (dragState.current && node) {
            updateNode(node.id, { x: dragState.current.x, y: dragState.current.y });
            dragState.current = null;
            debouncedNetworkSync.current?.cancel();
        }
    }, [node, updateNode, setNodeDragActive]);

    const handleDragStart = useCallback((e: Konva.KonvaEventObject<DragEvent>) => {
        if (isConnectingRef.current) {
            e.target.stopDrag();
            return;
        }
        stopKonvaPropagation(e);
        setNodeDragActive(true);
    }, [isConnectingRef, setNodeDragActive]);

    const handleMouseUp = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
        if (!node || !tempConnectionRef.current.active) return;
        stopKonvaPropagation(e);
        onFinishConnection(node.id);
    }, [node, tempConnectionRef, onFinishConnection]);

    const handleLabelUpdate = useCallback((newLabel: string) => {
        if (node) updateNode(node.id, { label: newLabel });
    }, [node, updateNode]);

    // === RENDER HELPERS ===
    const scaleValue = useCallback((
        value: number | undefined,
        fallback: number,
        size: number
    ): number => {
        if (value === undefined) return fallback;
        return Math.abs(value) <= 1 ? value * size : value;
    }, []);

    const renderPrimitive = useCallback((primitive: any, index: number) => {
        if (!node) return null;

        const primitiveWidth = scaleValue(primitive.width, node.width, node.width);
        const primitiveHeight = scaleValue(primitive.height, node.height, node.height);
        const primitiveX = scaleValue(primitive.x, 0, node.width);
        const primitiveY = scaleValue(primitive.y, 0, node.height);
        const strokeWidth = primitive.strokeWidth ?? (isSelected ? nodeStyle.strokeWidth * 1.3 : nodeStyle.strokeWidth);

        const commonProps = {
            fill: primitive.fill ?? nodeStyle.fill,
            stroke: primitive.stroke ?? nodeStyle.stroke,
            strokeWidth,
            opacity: nodeStyle.opacity,
        };

        switch (primitive.type) {
            case 'circle':
                return (
                    <Circle
                        key={`${node.id}-primitive-${index}`}
                        x={primitiveX}
                        y={primitiveY}
                        radius={scaleValue(primitive.radius, Math.min(node.width, node.height) / 2, Math.min(node.width, node.height))}
                        {...commonProps}
                    />
                );
            case 'diamond':
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
                );
            case 'text': {
                const boundText = primitive.textKey
                    ? primitive.textKey === 'label'
                        ? node.label
                        : String(node.notation?.properties.find(p => p.name === primitive.textKey)?.value ?? '')
                    : (primitive.text ?? '');

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
                        fontStyle={getKonvaFontStyle({
                            fontStyle: primitive.fontStyle,
                            fontWeight: primitive.fontWeight,
                        })}
                        align={primitive.align ?? textStyle.align}
                        verticalAlign="middle"
                        listening={false}
                    />
                );
            }
            case 'image':
            case 'svg': {
                const source = primitive.type === 'svg'
                    ? { svg: primitive.svg, src: primitive.src, url: primitive.url, href: primitive.href }
                    : { src: primitive.src, url: primitive.url, href: primitive.href, svg: primitive.svg };

                const resolved = resolveImageSource(source);
                if (!resolved) return null;

                return (
                    <NotationImage
                        key={`${node.id}-primitive-${index}`}
                        source={source}
                        x={primitiveX}
                        y={primitiveY}
                        width={primitiveWidth}
                        height={primitiveHeight}
                        preserveAspectRatio={primitive.preserveAspectRatio ?? true}
                    />
                );
            }
            default:
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
                );
        }
    }, [node, isSelected, nodeStyle, textStyle, scaleValue]);

    // === EARLY RETURN ===
    if (!node) return null;

    // === RENDER ===
    return (
        <Group
            id={node.id}
            ref={(ref) => {
                if (!ref) {
                    nodeRegistry.delete(node.id);
                    return;
                }
                nodeRegistry.set(node.id, ref);
            }}
            x={node.x}
            y={node.y}
            draggable={!isConnectingRef.current}
            onMouseDown={stopKonvaPropagation}
            onDragStart={handleDragStart}
            onClick={() => selectNode(node.id)}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseUp={handleMouseUp}
        >
            {/* Hit area for easier selection */}
            <Rect
                width={node.width}
                height={node.height}
                fill="transparent"
                strokeWidth={0}
            />

            {/* Custom renderer override */}
            {node.customRendererId && customRendererRegistry.get(node.customRendererId)?.({ node })}

            {/* Image/SVG notation */}
            {!node.customRendererId && (node.notation?.image || node.notation?.svg) && (
                <NotationImage
                    source={node.notation.image ?? node.notation.svg!}
                    width={node.width}
                    height={node.height}
                    preserveAspectRatio={getPreserveAspectRatio(node.notation.image ?? node.notation.svg)}
                />
            )}

            {/* Primitives rendering */}
            {!node.customRendererId && !node.notation?.svg && !node.notation?.image && (
                primitives.map((primitive, index) => renderPrimitive(primitive, index))
            )}

            {/* Editable label */}
            {node.renderLabel !== false && !node.textOutsideGroup && (
                <EditableLabel
                    x={0}
                    y={0}
                    width={node.width}
                    height={node.height}
                    text={node.label}
                    textStyle={textStyle}
                    isEditable={isEditable}
                    onUpdate={handleLabelUpdate}
                    nodeId={nodeId}
                    onStartEditing={() => onStartEditing?.(nodeId)}
                    onStopEditing={() => onStopEditing?.()}
                />
            )}

            {/* Anchor overlays on hover */}
            {(hovered || anchorHighlight) && anchors.map(anchor => (
                <AnchorOverlay
                    key={anchor.id}
                    x={anchor.x}
                    y={anchor.y}
                    onStartConnection={() => onStartConnection(
                        node.id,
                        anchor.id,
                        node.x + anchor.x,
                        node.y + anchor.y
                    )}
                    onFinishConnection={() => onFinishConnection(node.id, anchor.id)}
                />
            ))}
        </Group>
    );
};
