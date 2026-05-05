import { Arrow } from 'react-konva';
import type {IBaseElement, IElementDefinition, IEditableProperty, IEdgeRenderProps} from '../types';
import { v4 as uuidv4 } from 'uuid';
import {mdiArrowRight} from "@mdi/js";

interface IEdge extends IBaseElement {
    type: 'edge';
    fromId: string;
    toId: string;
    label?: string;
    stroke: string;
    strokeWidth: number;
    dash?: number[];
}

// Редактируемые свойства для связи
const edgeEditableProperties: IEditableProperty[] = [
    { name: 'label', label: 'Текст', type: 'text', defaultValue: '' },
    { name: 'stroke', label: 'Цвет', type: 'color', defaultValue: '#94a3b8' },
    { name: 'strokeWidth', label: 'Толщина', type: 'range', min: 1, max: 6, defaultValue: 2 },
];

// Фабрика создания связи
const createEdge = (
    position: { x: number; y: number },
    options: { fromId?: string; toId?: string; label?: string } = {}
): IEdge => {
    return {
        id: uuidv4(),
        type: 'edge',
        position: position,
        fromId: options.fromId || '',
        toId: options.toId || '',
        label: options.label,
        stroke: '#94a3b8',
        strokeWidth: 2,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
};

// Рендер связи (требует знания позиций фигур)
const renderEdge = (element: IEdge, props: IEdgeRenderProps) => {
    const { fromPosition, toPosition, onDelete } = props;

    if (!fromPosition || !toPosition) return null;

    return (
        <Arrow
            key={element.id}
            points={[fromPosition.x, fromPosition.y, toPosition.x, toPosition.y]}
            stroke={element.stroke}
            strokeWidth={element.strokeWidth}
            dash={element.dash}
            pointerLength={10}
            pointerWidth={8}
            onClick={() => onDelete?.(element.id)}
        />
    );
};

const edgeDefinition: IElementDefinition<IEdge> = {
    type: 'edge',
    name: 'Связь',
    icon: mdiArrowRight,
    create: createEdge,
    render: (element, props) => renderEdge(element as IEdge, props as IEdgeRenderProps),
    editableProperties: edgeEditableProperties,
    getPropertyValue: (element: IEdge, propName: string) => {
        const key = propName as keyof IEdge
        return element[key]
    },
    setPropertyValue: (element: IEdge, propName: string, value: any) => {
        return { ...element, [propName]: value };
    },
};

export {edgeDefinition}
export type {IEdge}