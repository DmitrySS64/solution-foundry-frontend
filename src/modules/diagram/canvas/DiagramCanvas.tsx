//modules/diagram/canvas/DiagramCanvas.tsx
import {
    useCallback,
    useEffect, useMemo,
    useRef,
    useState,
} from 'react'
import Konva from 'konva'
import { Stage, Layer,} from 'react-konva'
import { GridLayer, EdgeLayer, NodeLayer, TransformerLayer, SelectionLayer,} from './layers'
import {TemporaryEdge, EdgeHandlesOverlay} from "./renderers";
import {useEditorStore} from "../store/editor.store.ts";
import { useDiagramCollaboration } from '../store/useDiagramCollaboration.ts';
import { RemoteCursorsLayer } from './layers/RemoteCursorsLayer.tsx';

import { useDrawScheduler } from './hooks/useDrawScheduler';
import { useViewportManagement } from './hooks/useViewportManagement';
import { useConnectionManagement } from './hooks/useConnectionManagement';
import { useMouseHandlers } from './hooks/useMouseHandlers';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDragDrop } from './hooks/useDragDrop';
import { useCollaborationSync } from './hooks/useCollaborationSync';
import {useSelectionBox, useViewport} from "@/modules/diagram/store/selectors.ts";

interface DiagramCanvasProps {
    documentId: string;
}

const useToggleReadOnly = () => {
    const [isReadOnly, setIsReadOnly] = useState(true);
    const toggle = () => setIsReadOnly(!isReadOnly)
    return {
        isReadOnly, toggle
    }
}

const DiagramCanvas = ({ documentId }: DiagramCanvasProps) => {
    // === STATE ===
    const { isReadOnly } = useToggleReadOnly();
    const { setViewport: setViewportAction, setEditable } = useEditorStore(s => s.actions);
    useEffect(()=>{ setEditable(!isReadOnly) }, [isReadOnly, setEditable])
    const isEditable = useEditorStore(s => s.isEditable);

    // === REFS ===
    const stageRef = useRef<Konva.Stage>(null);
    const layerRefs = {
        grid: useRef<Konva.Layer>(null),
        edges: useRef<Konva.Layer>(null),
        handles: useRef<Konva.Layer>(null),
        nodes: useRef<Konva.Layer>(null),
        overlay: useRef<Konva.Layer>(null),
    };

    // === HOOKS ===
    const { requestDraw, cleanup: cleanupDraw } = useDrawScheduler(layerRefs);
    const { viewportRef, applyViewport, zoomAtPointer, panBy } = useViewportManagement(
        { x: 0, y: 0, zoom: 1 },
        { layers: layerRefs, requestDraw }
    );

    const applyViewportWithSync = useCallback(() => {
        applyViewport();
        const { x, y, zoom } = viewportRef.current;
        setViewportAction(x, y, zoom);
    }, [applyViewport, viewportRef, setViewportAction]);

    const { tempConnection, isConnecting, startConnection, finishConnection, cancelConnection, updateTempConnection } =
        useConnectionManagement({ requestDraw });

    const { handleMouseDown, handleMouseMove, handleMouseUp, selectionBoxRef } = useMouseHandlers({
        stageRef, viewportRef, requestDraw,
        onWorldPosition: (worldX, worldY) => {
            const state = useEditorStore.getState();
            if (state.interaction.hoveredEdgeId) {
                const over = state.document.nodes.find(n =>
                    worldX >= n.x && worldX <= n.x + n.width &&
                    worldY >= n.y && worldY <= n.y + n.height
                );
                useEditorStore.getState().actions.setAnchorHighlightNodeId(over?.id ?? null);
            }
        },
        onSelectStart: () => {
            useEditorStore.getState().actions.selectNode(null);
            useEditorStore.getState().actions.deleteSelection();
        },
        onPanMove: panBy,
    });

    const { handleDragOver, handleDrop } = useDragDrop({ stageRef, viewportRef });

    // === COLLABORATION ===
    // Room name derived from document ID in URL → shared editing session
    const collab = useDiagramCollaboration(`diagram:${documentId}`, "ws://localhost:1234");

    const { throttledCursorUpdate, startFieldEdit, endFieldEdit } = useCollaborationSync({
        viewportRef,
        updateLocalCursor: collab.updateLocalCursor,
        updateLocalSelection: collab.updateLocalSelection,
        updateLocalInteraction: collab.updateLocalInteraction,
        updateEditingField: collab.updateEditingField,
    });

    // Синхронизация курсора
    const _handleMouseMove = useCallback((e: Konva.KonvaEventObject<MouseEvent>) => {
        handleMouseMove(e);
        const pos = stageRef.current?.getPointerPosition();
        if (pos && typeof collab.updateLocalCursor === 'function') {
            const worldX = (pos.x - viewportRef.current.x) / viewportRef.current.zoom;
            const worldY = (pos.y - viewportRef.current.y) / viewportRef.current.zoom;
            throttledCursorUpdate?.(worldX, worldY);
        }
    }, [collab, viewportRef, handleMouseMove, throttledCursorUpdate]);

    // === KEYBOARD ===
    const isCollab = useEditorStore(s => !!s.yjsContext);
    const pastLen = useEditorStore(s => isCollab ? (window as any).diagramUndoManager?.undoStack?.length || 0 : s.history.past.length);
    const futureLen = useEditorStore(s => isCollab ? (window as any).diagramUndoManager?.redoStack?.length || 0 : s.history.future.length);

    useKeyboardShortcuts({
        onUndo: useEditorStore(s => s.actions.undo),
        onRedo: useEditorStore(s => s.actions.redo),
        onDelete: useEditorStore(s => s.actions.deleteSelection),
        pastLen, futureLen,
    });

    // === WHEEL ===
    const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
        e.evt.preventDefault();
        const stage = stageRef.current;
        if (!stage) return;

        if (e.evt.ctrlKey) {
            const pointer = stage.getPointerPosition();
            if (pointer) {
                zoomAtPointer(pointer, e.evt.deltaY);
                setTimeout(() => {
                    const { x, y, zoom } = viewportRef.current;
                    setViewportAction(x, y, zoom);
                }, 0);
            }
            return;
        }
        if (e.evt.shiftKey) {
            panBy(-e.evt.deltaY, 0);
        } else {
            panBy(0, -e.evt.deltaY);
        }
    };

    // === INIT ===
    useEffect(() => {
        applyViewportWithSync();
        return () => { cleanupDraw(); };
    }, [applyViewportWithSync, cleanupDraw]);

    const selectionBox = useSelectionBox();
    const viewport = useViewport();

    // RENDER
    return (
        <Stage
            ref={stageRef}
            width={window.innerWidth}
            height={window.innerHeight}
            onMouseDown={handleMouseDown}
            onMouseMove={_handleMouseMove}
            onMouseUp={handleMouseUp}
            onWheel={handleWheel}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <Layer ref={layerRefs.grid}><GridLayer /></Layer>
            <Layer ref={layerRefs.nodes}>
                <NodeLayer
                    isEditable={isEditable}
                    tempConnectionRef={tempConnection}
                    isConnectingRef={isConnecting}
                    onStartConnection={startConnection}
                    onFinishConnection={finishConnection}
                    onStartEditing={(nodeId) => startFieldEdit(nodeId, 'label')}
                    onStopEditing={endFieldEdit}
                />
                <TransformerLayer stageRef={stageRef}/>
            </Layer>
            <Layer ref={layerRefs.edges}>
                <EdgeLayer />
                <TemporaryEdge connectionRef={tempConnection}/>
            </Layer>
            <Layer ref={layerRefs.handles}><EdgeHandlesOverlay /></Layer>
            <Layer ref={layerRefs.overlay} listening={false}>
                <SelectionLayer box={selectionBox}/>
            </Layer>
            <RemoteCursorsLayer viewport={viewport} />
        </Stage>
    )
}

export {
    DiagramCanvas
}
