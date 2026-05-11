import type {
    NodeNotation,
    NodePrimitive,
    NodeType,
} from '../types/node.types'

interface NodeDefinition {
    type: NodeType
    label: string
    notation: NodeNotation
}

const defaultProperties = [
    {
        name: 'description',
        label: 'Описание',
        type: 'text' as const,
        value: '',
    },
]

const nodeDefinitions: NodeDefinition[] = [
    {
        type: 'rectangle',
        label: 'Rectangle',
        notation: {
            id: 'base.rectangle',
            name: 'Rectangle',
            properties: defaultProperties,
            primitives: [
                {
                    type: 'rect',
                    x: 0,
                    y: 0,
                    width: 1,
                    height: 1,
                },
            ],
        },
    },
    {
        type: 'circle',
        label: 'Circle',
        notation: {
            id: 'base.circle',
            name: 'Circle',
            properties: defaultProperties,
            primitives: [
                {
                    type: 'circle',
                    x: 0.5,
                    y: 0.5,
                    radius: 0.5,
                },
            ],
        },
    },
    {
        type: 'diamond',
        label: 'Diamond',
        notation: {
            id: 'base.diamond',
            name: 'Diamond',
            properties: defaultProperties,
            primitives: [
                {
                    type: 'diamond',
                    x: 0,
                    y: 0,
                    width: 1,
                    height: 1,
                },
            ],
        },
    },
    {
        type: 'bpmn.start-event',
        label: 'BPMN Start Event',
        notation: {
            id: 'bpmn.start-event',
            name: 'BPMN Start Event',
            properties: defaultProperties,
            primitives: [
                {
                    type: 'circle',
                    x: 0.5,
                    y: 0.5,
                    radius: 0.45,
                    fill: '#FFFFFF',
                    stroke: '#16A34A',
                    strokeWidth: 3,
                },
            ],
        },
    },
    {
        type: 'bpmn.task',
        label: 'BPMN Task',
        notation: {
            id: 'bpmn.task',
            name: 'BPMN Task',
            properties: [
                ...defaultProperties,
                {
                    name: 'title',
                    label: 'Заголовок',
                    type: 'text' as const,
                    value: 'Task',
                },
                {
                    name: 'assignee',
                    label: 'Исполнитель',
                    type: 'text' as const,
                    value: '',
                },
            ],
            primitives: [
                {
                    type: 'rect',
                    x: 0.5,
                    y: 0,
                    width: 1,
                    height: 0.6,
                    fill: '#EEF2FF',
                    stroke: '#4F46E5',
                    strokeWidth: 2,
                },
                {
                    type: 'circle',
                    x: 0.5,
                    y: 0.5,
                    radius: 0.2,
                    fill: '#FFFFFF',
                    stroke: '#16A34A',
                    strokeWidth: 3,
                },
                {
                    type: 'text',
                    x: 0.06,
                    y: 0.1,
                    width: 0.88,
                    height: 0.5,
                    textKey: 'title',
                    fill: '#111827',
                    fontSize: 14,
                    fontWeight: 'bold',
                    align: 'center',
                },
                {
                    type: 'text',
                    x: 0.06,
                    y: 0.62,
                    width: 0.88,
                    height: 0.28,
                    textKey: 'assignee',
                    fill: '#334155',
                    fontSize: 11,
                    align: 'center',
                },
            ],
        },
    },
    {
        type: 'bpmn.gateway',
        label: 'BPMN Gateway',
        notation: {
            id: 'bpmn.gateway',
            name: 'BPMN Gateway',
            properties: defaultProperties,
            primitives: [
                {
                    type: 'diamond',
                    x: 0,
                    y: 0,
                    width: 1,
                    height: 1,
                    fill: '#FFFBEB',
                    stroke: '#D97706',
                    strokeWidth: 2,
                },
            ],
        },
    },
]

const getNodeDefinition = (
    type: NodeType,
) => nodeDefinitions.find(
    definition => definition.type === type
)

const cloneNotation = (
    notation: NodeNotation,
): NodeNotation => ({
    ...notation,
    properties: notation.properties.map(property => ({
        ...property,
        options: property.options
            ? [...property.options]
            : undefined,
    })),
    primitives: notation.primitives?.map(
        (primitive: NodePrimitive) => ({
            ...primitive,
        }),
    ),
})

export {
    nodeDefinitions,
    getNodeDefinition,
    cloneNotation,
}

export type {
    NodeDefinition,
}
