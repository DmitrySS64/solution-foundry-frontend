import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
    Stage,
    Layer,
    Line, Transformer,
} from 'react-konva';
import type { ReactElement } from 'react';
import Konva from 'konva';
import './DiagramEditor.css'
import {
    mdiChevronLeft,
    mdiChevronRight,
    mdiTrashCan
} from "@mdi/js";
import {IconButton} from "@shared/ui/form/icon_button";
import {registerAllElements} from "@features/diagram-editor/lib/elements";
import {elementRegistry, type IBaseElement, type IRenderProps} from "@features/diagram-editor/lib/types.ts";
import Inspector from "@features/diagram-editor/ui/inspector.tsx";
import type {IEdge} from "@features/diagram-editor/lib/elements/edge.tsx";
import LibraryPanel from "@features/diagram-editor/ui/LibraryPanel.tsx";
import {useDiagramElements} from "@features/diagram-editor/lib/hooks/useDiagramElements.ts";
import {useConnection} from "@features/diagram-editor/lib/hooks/useConnection.ts";
import {useConvas} from "@features/diagram-editor/lib/hooks/useConvas.ts";
import type {IShape} from "@features/diagram-editor/lib/elements/shape.tsx";


// Регистрируем все типы элементов при загрузке
registerAllElements();

interface IDiagramEditorProps {
    initialElements?: IBaseElement[];
    onChange?: (elements: IBaseElement[]) => void;
    readOnly?: boolean;
}

export const DiagramEditor: React.FC<IDiagramEditorProps> = ({
    initialElements = [],
    onChange,
    readOnly = false
}) => {
    const {
        elements,
        selectedId,
        setSelectedId,
        addElement,
        addEdge,
        updateElement,
        deleteElement
    } = useDiagramElements(initialElements);

    const {
        layerRef,
        scale,
        stageOffset,
        bounds,
        handleStageMouseDown,
        handleStageMouseMove,
        handleStageMouseUp,
        handleWheel,
        expandBounds
    } = useConvas({readOnly});

    const {
        connectingFrom,
        mousePosition, setMousePosition,
        startConnection, endConnection
    } = useConnection(addEdge)

    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

    const stageRef = useRef<Konva.Stage>(null);
    const transformerRef = useRef<Konva.Transformer>(null);

    // Получение выбранного элемента
    const selectedElement = elements.find(el => el.id === selectedId) || null;
    const selectedType = selectedElement?.type || '';

    useEffect(() => {
        onChange?.(elements);
    }, [elements, onChange]);

    // При изменении selectedId обновляем трансформер
    useEffect(() => {
        const transformer = transformerRef.current;
        const stage = stageRef.current;
        if (!transformer || !stage) return;

        if (selectedId) {
            const selectedNode = stage.findOne(`#${selectedId}`);
            if (selectedNode) {
                transformer.nodes([selectedNode]);
            } else {
                transformer.nodes([]);
            }
        } else {
            transformer.nodes([]);
        }
        transformer.getLayer()?.batchDraw();
    }, [selectedId, elements]);

    const handleShapeDoubleClick = (id: string) => {
        const shape = elements.find(el => el.id === id) as IShape;
        if (shape) {
            const newLabel = prompt('Введите текст:', shape.label);
            if (newLabel !== null) {
                updateElement(id, { label: newLabel });
            }
        }
    };

    const handleShapeDragEnd = useCallback((id: string, x: number, y: number) => {
        updateElement(id, { position: { x, y } });
        expandBounds(x, y); // расширяем границы при необходимости
    }, [updateElement, expandBounds]);

    // Получение позиции фигуры для рендера связей
    const getElementPosition = useCallback((id: string): { x: number; y: number } | null => {
        const element = elements.find(el => el.id === id);
        if (!element) return null;
        // Проверяем, является ли элемент фигурой (имеет width/height)
        if ('width' in element && 'height' in element) {
            const shape = element as any;
            return {
                x: shape.position.x + shape.width / 2,
                y: shape.position.y + shape.height / 2,
            };
        }
        return element.position;
    }, [elements]);

    // Внутри слоя, до фигур
    const renderGrid = () => {
        const step = 24;
        const startX = Math.floor(bounds.minX / step) * step;
        const startY = Math.floor(bounds.minY / step) * step;
        const lines: ReactElement[] = [];
        for (let x = startX; x <= bounds.maxX; x += step) {
            lines.push(<Line key={`v-${x}`} points={[x, bounds.minY, x, bounds.maxY]} stroke="#ddd" strokeWidth={1} />);
        }
        for (let y = startY; y <= bounds.maxY; y += step) {
            lines.push(<Line key={`h-${y}`} points={[bounds.minX, y, bounds.maxX, y]} stroke="#ddd" strokeWidth={1} />);
        }
        return lines;
    };

    // Рендер всех элементов через их определения
    const renderElements = useCallback(() => {
        // Сначала рендерим связи (они должны быть под фигурами)
        const edges = elements.filter(el => el.type === 'edge');
        const shapes = elements.filter(el => el.type !== 'edge');

        return (
            <>
                {/* Связи */}
                {edges.map(edge => {
                    const definition = elementRegistry.get(edge.type);
                    if (!definition) return null;

                    const edgeElement = edge as IEdge;
                    const fromPos = getElementPosition(edgeElement.fromId);
                    const toPos = getElementPosition(edgeElement.toId);
                    return definition.render(edge, {
                        isSelected: edge.id === selectedId,
                        isConnecting: false,
                        onDragEnd: () => {},
                        onClick: (id) => setSelectedId(id),
                        onMouseDown: (id) => startConnection(id),
                        onMouseUp: (id) => endConnection(id),
                        fromPosition: fromPos || undefined,
                        toPosition: toPos || undefined,
                        onDelete: deleteElement,
                    });
                })}

                {/* Фигуры и другие элементы */}
                {shapes.map(element => {
                    const definition = elementRegistry.get(element.type);
                    if (!definition) return null;

                    const shapeProps : IRenderProps = {
                        isSelected: element.id === selectedId,
                        isConnecting: connectingFrom === element.id,
                        onDragEnd: handleShapeDragEnd,
                        onClick: (id) => setSelectedId(id),
                        onMouseDown: (id) => startConnection(id),
                        onMouseUp: (id) => endConnection(id),
                        onDblClick: (id) => handleShapeDoubleClick(id)
                    }

                    return definition.render(element, shapeProps);
                })}
            </>
        );
    }, [elements, getElementPosition, selectedId, deleteElement, setSelectedId, connectingFrom, handleShapeDragEnd, startConnection, endConnection]);

    // Временная линия при создании связи
    const renderTemporaryLine = useCallback(() => {
        if (!connectingFrom) return null;
        const from = getElementPosition(connectingFrom);
        if (!from) return null;
        return (
            <Line
                points={[from.x, from.y, mousePosition.x, mousePosition.y]}
                stroke="#3B82F6"
                strokeWidth={2}
                dash={[8, 4]}
            />
        );
    }, [connectingFrom, mousePosition, getElementPosition]);

    // Получение всех доступных типов для тулбара
    const availableElementTypes = elementRegistry.getAll();

    // Группировка по категориям (можно добавить в definition)
    const shapeTypes = availableElementTypes.filter(t => t.type === 'shape');

    return (
        <div className="flex-1 flex flex-col bg-zinc-50 dark:bg-zinc-900/50 overflow-hidden h-[calc(100vh-161px)]">
            {/* Панель инструментов */}
            <div className="h-12 border-b bg-white dark:bg-zinc-900 flex items-center px-3 gap-1">
                <IconButton path={mdiChevronLeft} onClick={() => setLeftSidebarOpen(!leftSidebarOpen)} />

                {shapeTypes.map(def => (
                    <IconButton
                        key={def.type}
                        path={def.icon}
                        onClick={() => addElement(def.type, {x: 40, y: 40})}
                        title={def.name}
                    />
                ))}

                {selectedId && (
                    <IconButton path={mdiTrashCan} onClick={()=>deleteElement(selectedId)} title="Удалить" />
                )}

                <div className="flex-1" />
                <IconButton path={mdiChevronRight} onClick={() => setRightSidebarOpen(!rightSidebarOpen)} />
            </div>

            {/* Основная область */}
            <div className="flex-1 flex overflow-hidden">
                {/* Левый сайдбар - библиотека */}
                {leftSidebarOpen && (
                    <div className="w-64 border-r bg-white dark:bg-zinc-900 flex flex-col">
                        <div className="p-3 border-b"><h3 className="font-semibold">Библиотека</h3></div>
                        <div className="flex-1 overflow-auto p-3">
                            <LibraryPanel
                                addElement={(type) => addElement(type, {x:40, y:40})}
                            />
                            {/*shapeTypes.map(def => (
                                <div
                                    key={def.type}
                                    className="p-3 border rounded-lg mb-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-zinc-800"
                                    onClick={() => addElement(def.type)}
                                >
                                    <div className="font-medium">{def.name}</div>
                                </div>
                            ))*/}
                        </div>
                    </div>
                )}

                {/* Холст */}
                <div className="flex-1 relative overflow-hidden">
                    {/*
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    */}

                    <Stage
                        ref={stageRef}
                        width={window.innerWidth - (leftSidebarOpen ? 256 : 0) - (rightSidebarOpen ? 320 : 0)}
                        height={window.innerHeight}
                        className="flex-1 bg-zinc-100 dark:bg-zinc-900"
                        onMouseDown={handleStageMouseDown}
                        onMouseMove={(e) => {
                            handleStageMouseMove(e);
                            const stage = e.target.getStage();
                            const pos = stage?.getPointerPosition();
                            if (pos) setMousePosition(pos);
                        }}
                        onWheel={handleWheel}
                        onMouseUp={handleStageMouseUp}
                    >
                        <Layer
                            ref={layerRef}
                            x={stageOffset.x}
                            y={stageOffset.y}
                            scaleX={scale}
                            scaleY={scale}
                        >
                            {renderGrid()}
                            {renderElements()}
                            <Transformer
                                ref={transformerRef}
                                anchorSize={8}
                                borderDash={[6, 2]}
                                keepRatio={false}
                                boundBoxFunc={(oldBox, newBox) => {
                                    // Минимальные размеры
                                    if (newBox.width < 40 || newBox.height < 30) return oldBox;
                                    return newBox;
                                }}
                                onTransform={(e) => {
                                    const node = e.target;
                                    const scaleX = node.scaleX();
                                    const scaleY = node.scaleY();

                                    // Обновляем размеры элемента
                                    const id = node.id();
                                    const newWidth = Math.round(Math.max(40, node.width() * scaleX));
                                    const newHeight = Math.round(Math.max(30, node.height() * scaleY));

                                    updateElement(id, { width: newWidth, height: newHeight });

                                    // Сбрасываем масштаб узла, чтобы не накапливать трансформации
                                    node.scaleX(1);
                                    node.scaleY(1);
                                }}
                            />
                            {renderTemporaryLine()}
                        </Layer>
                    </Stage>
                </div>

                {/* Правый сайдбар - инспектор */}
                {rightSidebarOpen && (
                    <div className="w-80 border-l bg-white dark:bg-zinc-900 flex flex-col">
                        <div className="p-3 border-b">
                            <h3 className="font-semibold">Свойства</h3>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <Inspector
                                element={selectedElement}
                                elementType={selectedType}
                                onChange={(updates) => selectedId && updateElement(selectedId, updates)}
                                readOnly={readOnly}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
