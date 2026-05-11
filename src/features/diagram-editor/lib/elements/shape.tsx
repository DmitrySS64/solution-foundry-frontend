import React from 'react';
import { Rect, Circle, Group, Text as KonvaText } from 'react-konva';
import type {IBaseElement, IElementDefinition, IEditableProperty, IRenderProps} from '../types';
import { v4 as uuidv4 } from 'uuid';
import {mdiSquare} from "@mdi/js";


interface IShapeStyle {
    fill: string;
    stroke: string;
    strokeWidth: number;
    opacity: number;
    shadow?: boolean;
    dashed?: boolean;
}

interface IShape extends IBaseElement {
    type: 'shape';
    shapeType: 'rectangle' | 'circle' | 'diamond';
    width: number;
    height: number;
    label: string;
    style: IShapeStyle;
    fontSize: number;
    fontColor: string;
    notation?: string; // 'bpmn', 'uml', 'c4', 'er'
    notationSpecific?: Record<string, unknown>; // любые дополнительные данные
}

// Редактируемые свойства для фигуры
const shapeEditableProperties: IEditableProperty[] = [
    { name: 'label', label: 'Текст', type: 'text', defaultValue: 'Новый блок' },
    { name: 'width', label: 'Ширина', type: 'range', min: 40, max: 400, defaultValue: 140 },
    { name: 'height', label: 'Высота', type: 'range', min: 30, max: 300, defaultValue: 70 },
    { name: 'style.fill', label: 'Цвет заливки', type: 'color', defaultValue: '#DBEAFE' },
    { name: 'style.stroke', label: 'Цвет контура', type: 'color', defaultValue: '#3B82F6' },
    { name: 'style.strokeWidth', label: 'Толщина контура', type: 'range', min: 1, max: 8, defaultValue: 2 },
    { name: 'fontSize', label: 'Размер шрифта', type: 'range', min: 10, max: 24, defaultValue: 14 },
    { name: 'fontColor', label: 'Цвет текста', type: 'color', defaultValue: '#1e293b' },
];

// Фабрика создания фигуры
const createShape = (
    position: { x: number; y: number },
    options: { shapeType?: 'rectangle' | 'circle' | 'diamond'; label?: string } = {}
): IShape => {
    const shapeType = options.shapeType || 'rectangle';
    const colors: Record<string, { fill: string; stroke: string }> = {
        rectangle: { fill: '#DBEAFE', stroke: '#3B82F6' },
        circle: { fill: '#F3E8FF', stroke: '#9333EA' },
        diamond: { fill: '#FEF3C7', stroke: '#F59E0B' },
    };

    return {
        id: uuidv4(),
        type: 'shape',
        position,
        shapeType,
        width: shapeType === 'diamond' ? 120 : 140,
        height: shapeType === 'diamond' ? 100 : 70,
        label: options.label || (shapeType === 'rectangle' ? 'Прямоугольник' : shapeType === 'circle' ? 'Круг' : 'Ромб'),
        style: {
            fill: colors[shapeType].fill,
            stroke: colors[shapeType].stroke,
            strokeWidth: 2,
            opacity: 1,
        },
        fontSize: 14,
        fontColor: '#1e293b',
        createdAt: Date.now(),
        updatedAt: Date.now(),
    };
};

// Получение значения свойства по пути (например, 'style.fill')
//const getNestedValue = (obj: Record<string, unknown>, path: string): unknown => {
//    return path.split('.').reduce((current, key) => {
//        if (current && typeof current === 'object') {
//            return (current as Record<string, unknown>)[key];
//        }
//        return undefined;
//    }, obj as Record<string, unknown>);
//};
//
//// Установка значения свойства по пути
//const setNestedValue = (obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> => {
//    const keys = path.split('.');
//    const lastKey = keys.pop()!;
//    const target = keys.reduce((current, key) => {
//        if (!current[key] || typeof current[key] !== 'object') {
//            current[key] = {};
//        }
//        return current[key] as Record<string, unknown>;
//    }, obj);
//    target[lastKey] = value;
//    return obj;
//};

// Рендер фигуры
const renderShape = (element: IShape, props: IRenderProps): React.ReactNode => {
    const { isConnecting, onDragEnd, onClick, onMouseDown, onMouseUp, onDblClick} = props;
    const fill = isConnecting ? '#ff0000' : element.style.fill;
    const stroke = isConnecting ? '#ff0000' : element.style.stroke;
    const strokeWidth = isConnecting ? 3 : element.style.strokeWidth;

    // Координаты группы — позиция элемента
    const groupX = element.position.x;
    const groupY = element.position.y;

    // Центр фигуры относительно группы (локальные координаты)
    const centerX = element.width / 2;
    const centerY = element.height / 2;

    const commonProps = {
        id: element.id,
        width: element.width,
        height: element.height,
        fill,
        stroke,
        strokeWidth,
    };

    let shape: React.ReactNode = null;

    if (element.shapeType === 'rectangle') {
        shape = <Rect {...commonProps} cornerRadius={8} />;
    } else if (element.shapeType === 'circle') {
        shape = <Circle {...commonProps} radius={element.width / 2} />;
    } else if (element.shapeType === 'diamond') {
        shape = (
            <Rect
                {...commonProps}
                transform={`rotate(45 ${centerX} ${centerY})`}
            />
        );
    }

    return (
        <Group
            id={element.id}
            key={element.id}
            x={groupX}
            y={groupY}
            width={element.width}
            height={element.height}
            draggable={!props.isConnecting} // u можно перетаскивать всегда, кроме режима соединения
            onDragEnd={(e) => onDragEnd(element.id, e.target.x(), e.target.y())}
            onClick={() => onClick(element.id)}
            onMouseDown={() => onMouseDown?.(element.id)}
            onMouseUp={() => onMouseUp?.(element.id)}
            onDblClick={() => onDblClick?.(element.id)}
        >
            {shape}
            <KonvaText
                x={centerX}
                y={centerY}
                text={element.label}
                fontSize={element.fontSize}
                fontFamily="sans-serif"
                fill={element.fontColor}
                align="center"
                verticalAlign="middle"
                offsetX={element.label.length * (element.fontSize / 2.5)}
                offsetY={element.fontSize / 2}
                listening={false} // текст не перехватывает события мыши
            />
        </Group>
    );
};


// Экспорт определения фигуры
//const shapeDefinition: IElementDefinition<IShape> = {
//    type: 'shape',
//    name: 'Фигура',
//    icon: mdiSquare,
//    create: createShape,
//    render: (element, props) => renderShape(element as IShape, props as IRenderProps),
//    editableProperties: shapeEditableProperties,
//    getPropertyValue: (element: IShape, propName: string): unknown => {
//        return getNestedValue(element as unknown as Record<string, unknown>, propName);
//    },
//    setPropertyValue: (element: IShape, propName: string, value: unknown): IShape => {
//        const newElement = { ...element } as unknown as Record<string, unknown>;
//        setNestedValue(newElement, propName, value);
//        return newElement as IShape;
//    },
//};

const shapeDefinition: IElementDefinition<IShape> = {
    type: 'shape',
    name: 'Фигура',
    icon: mdiSquare,
    create: createShape,
    render: (element, props) => renderShape(element as IShape, props as IRenderProps),
    editableProperties: shapeEditableProperties,
    getPropertyValue: (element: IShape, propName: string): unknown => {
        if (propName === 'label') return element.label;
        if (propName === 'width') return element.width;
        if (propName === 'height') return element.height;
        if (propName === 'style.fill') return element.style.fill;
        if (propName === 'style.stroke') return element.style.stroke;
        if (propName === 'style.strokeWidth') return element.style.strokeWidth;
        if (propName === 'fontSize') return element.fontSize;
        if (propName === 'fontColor') return element.fontColor;
        if (propName.startsWith('notationSpecific.')) {
            const key = propName.split('.')[1];
            return element.notationSpecific?.[key];
        }
        return undefined;
    },
    setPropertyValue: (element: IShape, propName: string, value: unknown): IShape => {
        if (propName === 'position') {
            return { ...element, position: value as { x: number; y: number }, updatedAt: Date.now() };
        }
        if (propName === 'width') {
            return { ...element, width: Math.max(40, value as number), updatedAt: Date.now() };
        }
        if (propName === 'height') {
            return { ...element, height: Math.max(30, value as number), updatedAt: Date.now() };
        }
        // Прямые свойства
        if (propName === 'label') return { ...element, label: value as string };
        if (propName === 'fontSize') return { ...element, fontSize: value as number };
        if (propName === 'fontColor') return { ...element, fontColor: value as string };

        // Вложенные свойства style
        if (propName === 'style.fill') {
            return { ...element, style: { ...element.style, fill: value as string } };
        }
        if (propName === 'style.stroke') {
            return { ...element, style: { ...element.style, stroke: value as string } };
        }
        if (propName === 'style.strokeWidth') {
            return { ...element, style: { ...element.style, strokeWidth: value as number } };
        }

        // Поддержка notationSpecific
        if (propName.startsWith('notationSpecific.')) {
            const key = propName.split('.')[1];
            return {
                ...element,
                notationSpecific: { ...element.notationSpecific, [key]: value }
            };
        }

        return element;
    },
};

export {
    shapeDefinition
}

export type {
    IShapeStyle,
    IShape
}
