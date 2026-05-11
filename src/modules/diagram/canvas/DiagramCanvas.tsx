//canvas/DiagramCanvas.tsx
import {
    useEffect,
    useRef,
} from 'react'
import Konva from 'konva'
import {
    Stage,
    Layer,
} from 'react-konva'
import {
    GridLayer,
    EdgeLayer,
    NodeLayer,
    TransformerLayer,
    SelectionLayer,
} from './layers'
import type {ISelectionBox} from "../store/slices/selection.slice.ts";
import {TemporaryEdge, EdgeHandlesOverlay} from "./renderers";
import {useEditorStore} from "../store/editor.store.ts";
import type {DiagramEdge, TempEdge} from "../model/types";
import {getNodeAnchors} from "@/modules/diagram/model/factories/getNodeAnchors.ts";
import {closestPointOnRectPerimeter} from "@/modules/diagram/model/util/edgeGeometry.ts";

const DiagramCanvas = () => {
    const {
        setViewport,
        deleteSelection,
        setAnchorHighlightNodeId,
        selectNode,
        undo,
        redo,
    } = useEditorStore(state => state.actions)

    const pastLen = useEditorStore(state => state.history.past.length)
    const futureLen = useEditorStore(state => state.history.future.length)


    // STAGE

    const stageRef =
        useRef<Konva.Stage>(null)

    // LAYERS
    const gridLayerRef = useRef<Konva.Layer>(null)
    const edgeLayerRef = useRef<Konva.Layer>(null)
    const handlesLayerRef = useRef<Konva.Layer>(null)
    const nodeLayerRef = useRef<Konva.Layer>(null)
    const overlayLayerRef = useRef<Konva.Layer>(null)

    // VIEWPORT
    const viewportRef =
        useRef({
            x: 0,
            y: 0,
            zoom: 1,
        })

    // FLAGS
    const isDragging = useRef(false)
    const isConnecting = useRef(false)


    // POINTER
    const lastPointer =
        useRef({
            x: 0,
            y: 0,
        })

    // SELECTION
    const selectionStart = useRef<{
        x:number,
        y:number
    } | null>(null)
    const selectionBox =
        useRef<ISelectionBox>({
            active: false,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        })

    // TEMP CONNECTION
    const tempConnection =
        useRef<TempEdge>({
            active: false,

            fromX: 0,
            fromY: 0,

            toX: 0,
            toY: 0,
        })

    // RAF DRAW
    const animationFrame =
        useRef<number | null>(null)

    const requestDraw = (
        target:
            | 'grid'
            | 'edges'
            | 'handles'
            | 'nodes'
            | 'overlay'
            | 'all' = 'all'
    ) => {
        if (animationFrame.current) {
            return
        }

        animationFrame.current =
            requestAnimationFrame(() => {
                switch (target) {
                    case "grid":
                        gridLayerRef.current?.batchDraw()
                        break
                    case "edges":
                        edgeLayerRef.current?.batchDraw()
                        break
                    case "handles":
                        handlesLayerRef.current?.batchDraw()
                        break
                    case "nodes":
                        nodeLayerRef.current?.batchDraw()
                        break
                    case "overlay":
                        overlayLayerRef.current?.batchDraw()
                        break
                    default:
                        gridLayerRef.current?.batchDraw()
                        edgeLayerRef.current?.batchDraw()
                        handlesLayerRef.current?.batchDraw()
                        nodeLayerRef.current?.batchDraw()
                        overlayLayerRef.current?.batchDraw()
                }
                animationFrame.current = null
            })
    }


    // APPLY VIEWPORT
    const applyViewport = () => {

        const layers = [
            gridLayerRef.current,
            nodeLayerRef.current,
            edgeLayerRef.current,
            handlesLayerRef.current,
        ]

        layers.forEach(layer => {
            if (!layer) return

            layer.position({
                x: viewportRef.current.x,
                y: viewportRef.current.y,
            })

            layer.scale({
                x: viewportRef.current.zoom,
                y: viewportRef.current.zoom,
            })
        })

        setViewport(
            viewportRef.current.x,
            viewportRef.current.y,
            viewportRef.current.zoom
        )

        requestDraw('all')
    }

    // CONNECTIONS
    const startConnection = (
        nodeId: string,
        anchorId: string,
        x: number,
        y: number,
    ) => {

        isConnecting.current = true

        tempConnection.current = {

            active: true,

            fromNodeId: nodeId,
            fromAnchor: anchorId,

            fromX: x,
            fromY: y,

            toX: x,
            toY: y,
        }

        requestDraw('edges')
    }

    const finishConnection = (
        targetNodeId: string,
        targetAnchorId?: string,
    ) => {

        const c = tempConnection.current

        if (!c.active) {
            return
        }

        // same node cancel
        if (c.fromNodeId === targetNodeId) {
            cancelConnection()
            return
        }

        const nodes = useEditorStore
            .getState()
            .document
            .nodes

        const targetNode = nodes.find(n => n.id === targetNodeId)

        if (!targetNode) return

        const targetAnchors =
            getNodeAnchors(targetNode)

        const targetAnchor =
            targetAnchors.find(
                a => a.id === targetAnchorId
            )

        const targetPoint = targetAnchor
            ? {x: targetAnchor.x, y: targetAnchor.y}
            : closestPointOnRectPerimeter(
                targetNode,
                {x: c.fromX, y: c.fromY},
            )

        const edge : DiagramEdge = {

            id: crypto.randomUUID(),

            type: 'straight',

            source: {
                nodeId: c.fromNodeId,
                anchorId: c.fromAnchor,

                point: {
                    x: c.fromX,
                    y: c.fromY
                }
            },

            target: {
                nodeId: targetNodeId,
                anchorId: targetAnchorId,
                point: targetPoint,
            },

            controlPoints: [],

            style: {
                stroke: '#111827',
                strokeWidth: 2,
                startCap: 'none',
                endCap: 'arrow',
            },
            labelStyle: {
                fill: '#111827',
                fontSize: 12,
                fontFamily: 'Arial',
                fontStyle: 'normal',
                fontWeight: 'normal',
            },
        }

        useEditorStore
            .getState()
            .actions
            .addEdge(edge)

        cancelConnection()
    }

    const cancelConnection = () => {

        isConnecting.current = false

        tempConnection.current.active = false

        requestDraw('edges')
    }

    // MOUSE EVENTS
    const handleMouseDown = (
        e: Konva.KonvaEventObject<MouseEvent>
    ) => {

        const stage = stageRef.current
        if (!stage) return

        // PAN (middle mouse)
        if (e.evt.button === 1) {

            isDragging.current = true

            lastPointer.current = {
                x: e.evt.clientX,
                y: e.evt.clientY,
            }

            return
        }

        // click on empty canvas -> clear selection
        if (e.target === stage) {
            selectNode(null)
            deleteSelection()

            const pos = stage.getPointerPosition()
            if (!pos) return

            // selection box
            selectionStart.current = pos
            selectionBox.current = {
                active: true,
                x: pos.x,
                y: pos.y,
                width: 0,
                height: 0,
            }

            requestDraw('overlay')
            return
        }

    }

    const handleMouseMove = (
        e: Konva.KonvaEventObject<MouseEvent>
    ) => {

        const stage = stageRef.current

        if (!stage) return

        const pos =
            stage.getPointerPosition()

        if (!pos) return

        const worldX =
            (pos.x - viewportRef.current.x)
            / viewportRef.current.zoom

        const worldY =
            (pos.y - viewportRef.current.y)
            / viewportRef.current.zoom

        {
            const st = useEditorStore.getState()
            if (st.interaction.hoveredEdgeId) {
                const docNodes = st.document.nodes
                const over = docNodes.find(n =>
                    worldX >= n.x &&
                    worldX <= n.x + n.width &&
                    worldY >= n.y &&
                    worldY <= n.y + n.height
                )
                setAnchorHighlightNodeId(over?.id ?? null)
            } else {
                setAnchorHighlightNodeId(null)
            }
        }

        // CONNECTION DRAG
        if (isConnecting.current) {

            tempConnection.current.toX =
                worldX

            tempConnection.current.toY =
                worldY

            requestDraw('edges')

            return
        }

        // PAN
        if (isDragging.current) {

            const dx =
                e.evt.clientX -
                lastPointer.current.x

            const dy =
                e.evt.clientY -
                lastPointer.current.y

            viewportRef.current.x += dx
            viewportRef.current.y += dy

            applyViewport()

            lastPointer.current = {
                x: e.evt.clientX,
                y: e.evt.clientY,
            }

            return
        }

        // SELECTION
        if (selectionStart.current) {

            const start =
                selectionStart.current

            selectionBox.current = {
                active: true,
                x: Math.min(start.x, pos.x),
                y: Math.min(start.y, pos.y),
                width: Math.abs(pos.x - start.x),
                height: Math.abs(pos.y - start.y),
            }

            requestDraw('overlay')
        }
    }

    const handleMouseUp = () => {

        if (isConnecting.current) {
            cancelConnection()
        }
        isDragging.current = false
        selectionStart.current = null
        selectionBox.current = {
            active: false,
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        }

        requestDraw('overlay')
    }

    const handleWheel = (
        e: Konva.KonvaEventObject<WheelEvent>
    ) => {

        e.evt.preventDefault()

        // zoom
        if (e.evt.ctrlKey) {

            const scaleBy = 1.1

            viewportRef.current.zoom =
                e.evt.deltaY > 0
                    ? viewportRef.current.zoom / scaleBy
                    : viewportRef.current.zoom * scaleBy

            viewportRef.current.zoom =
                Math.max(
                    0.2,
                    Math.min(4, viewportRef.current.zoom)
                )

            applyViewport()

            return
        }

        // horizontal
        if (e.evt.shiftKey) {

            viewportRef.current.x -= e.evt.deltaY

            applyViewport()

            return
        }

        // vertical
        viewportRef.current.y -=
            e.evt.deltaY

        applyViewport()
    }

    // INIT
    useEffect(() => {
        applyViewport()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            // не перехватываем хоткеи при вводе в инпуты/контент-эдиторы
            const target = event.target as HTMLElement | null
            const tag = target?.tagName?.toLowerCase()
            if (tag === 'input' || tag === 'textarea' || target?.isContentEditable) {
                return
            }

            // Ctrl/Cmd+Z => Undo, Ctrl/Cmd+Y => Redo
            if ((event.ctrlKey || event.metaKey) && !event.shiftKey && event.key.toLowerCase() === 'z') {
                if (pastLen === 0) return
                event.preventDefault()
                undo()
                return
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
                if (futureLen === 0) return
                event.preventDefault()
                redo()
                return
            }

            if (event.key !== 'Delete') {
                return
            }

            event.preventDefault()
            deleteSelection()
        }

        window.addEventListener('keydown', onKeyDown)
        return () => {
            window.removeEventListener('keydown', onKeyDown)
        }
    }, [deleteSelection, pastLen, futureLen, undo, redo])


    // RENDER
    return (
        <Stage
            ref={stageRef}

            width={window.innerWidth}
            height={window.innerHeight}

            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
        >
            {/*GRID*/}
            <Layer ref={gridLayerRef}>
                <GridLayer />
            </Layer>
            {/*NODES*/}
            <Layer ref={nodeLayerRef}>
                <NodeLayer
                    tempConnectionRef={tempConnection}
                    isConnectingRef={isConnecting}
                    onStartConnection={startConnection}
                    onFinishConnection={finishConnection}
                />
                <TransformerLayer
                    stageRef={stageRef}
                />
            </Layer>
            {/*EDGES (above nodes for handles)*/}
            <Layer ref={edgeLayerRef}>
                <EdgeLayer />
                <TemporaryEdge
                    connectionRef={tempConnection}/>
            </Layer>
            <Layer ref={handlesLayerRef}>
                <EdgeHandlesOverlay />
            </Layer>
            {/*OVERLAY*/}
            <Layer
                ref={overlayLayerRef}
                listening={false}
            >
                <SelectionLayer
                    box={selectionBox.current}/>
            </Layer>
        </Stage>
    )
}

export {
    DiagramCanvas
}