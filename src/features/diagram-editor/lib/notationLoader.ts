import { elementRegistry, type IElementDefinition, type IBaseElement } from './types';
import { shapeDefinition } from './elements/shape';
import { edgeDefinition } from './elements/edge';
//import { zoneDefinition } from './elements/zone';

interface IPropertySchema {
    name: string;
    label: string;
    type: 'text' | 'color' | 'number' | 'range' | 'boolean' | 'select';
    options?: string[];
    default?: string | number | boolean;
}

interface IElementSchema {
    type: string;
    name: string;
    extends: 'shape' | 'zone' | 'edge';
    icon: string;
    defaults: Record<string, unknown>;
    properties: IPropertySchema[];
}

interface INotationSchema {
    id: string;
    name: string;
    version: string;
    elements: IElementSchema[];
    connections: {
        allowedTypes: string[];
        edgeDefaults: Record<string, unknown>;
    };
    validationRules?: Array<{ rule: string; message: string }>;
}

// Базовые определения, от которых можно наследоваться
const baseDefinitions: Record<string, IElementDefinition> = {
    shape: shapeDefinition,
    //zone: zoneDefinition,
    edge: edgeDefinition,
};

// Создание IElementDefinition из JSON-схемы
const createDefinitionFromSchema = (schema: IElementSchema): IElementDefinition => {
    const baseDef = baseDefinitions[schema.extends];
    if (!baseDef) {
        throw new Error(`Unknown base type: ${schema.extends}`);
    }

    // Фабрика создания элемента
    const create = (position: { x: number; y: number }, options?: Record<string, unknown>) => {
        const element = baseDef.create(position, {
            ...schema.defaults,
            ...options,
        });
        // Объединяем дополнительные поля из схемы
        const extraFields: Record<string, unknown> = {};
        for (const prop of schema.properties) {
            extraFields[prop.name] = options?.[prop.name] ?? prop.default;
        }
        // Добавляем метаданные нотации
        return {
            ...element,
            notationType: schema.type,
            notationId: schema.name,
            ...Object.fromEntries(
                schema.properties.map(prop => [prop.name, options?.[prop.name] ?? prop.default])
            ),
        };
    };

    // Рендер (можно переопределить, если нужен кастомный)
    const render = baseDef.render;

    // Редактируемые свойства из JSON
    const editableProperties = schema.properties.map(prop => ({
        name: prop.name,
        label: prop.label,
        type: prop.type,
        options: prop.options?.map(opt => ({ value: opt, label: opt })),
        defaultValue: prop.default ?? '',
    }));

    // Получение значения свойства
    const getPropertyValue = (element: IBaseElement, propName: string) => {
        if (propName === 'position') return element.position;
        // Доступ к дополнительным полям через квадратные скобки, но без приведения к Record
        if (propName in element) {
            return (element as any)[propName];
        }
        return undefined;
    };

    // Установка значения свойства
    const setPropertyValue = (element: IBaseElement, propName: string, value: unknown): IBaseElement => {
        if (propName === 'position') {
            return { ...element, position: value as { x: number; y: number }, updatedAt: Date.now() };
        }
        // Используем Object.assign, чтобы избежать ошибки индексной сигнатуры
        const newElement = Object.assign({}, element, { [propName]: value, updatedAt: Date.now() });
        return newElement as IBaseElement;
    };

    return {
        type: schema.type,
        name: schema.name,
        icon: schema.icon,
        create,
        render,
        editableProperties,
        getPropertyValue,
        setPropertyValue,
    };
};

// Загрузка всех нотаций из JSON-файлов
export const loadNotations = async (): Promise<void> => {
    const notationFiles = [
        '/notations/bpmn.json',
        //'/notations/uml.json',
        //'/notations/c4.json',
        //'/notations/er.json',
    ];

    for (const file of notationFiles) {
        try {
            const response = await fetch(file);
            if (!response.ok) continue;

            const schema: INotationSchema = await response.json();

            for (const elementSchema of schema.elements) {
                const definition = createDefinitionFromSchema(elementSchema);
                elementRegistry.register(definition);
            }

            console.log(`Loaded notation: ${schema.name} (${schema.version})`);
        } catch (error) {
            console.error(`Failed to load ${file}:`, error);
        }
    }
};