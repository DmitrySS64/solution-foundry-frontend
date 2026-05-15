import type {
    NodeNotation,
    NodeType,
} from '../types/node.types'


import type {
    NotationBoxRules,
} from './notationRegistry'

import {notations} from './notationRegistry'


interface NodeDefinition {
    type: NodeType
    label: string
    notation: NodeNotation
    notationGroupId?: string
    box: NotationBoxRules
    renderLabel: boolean
}


const defaultProperties = [

    {
        name: 'description',
        label: 'Описание',
        type: 'text' as const,
        value: '',
    },
]

const baseDefinitions: NodeDefinition[] = [

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
        box: {
            initialWidth: 160,
            initialHeight: 80,
            canStretch: true,
            preserveAspectRatio: false,
        },
        renderLabel: true,
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
        box: {
            initialWidth: 160,
            initialHeight: 160,
            canStretch: false,
            preserveAspectRatio: true,
        },
        renderLabel: true,
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
        box: {
            initialWidth: 160,
            initialHeight: 80,
            canStretch: true,
            preserveAspectRatio: false,
        },
        renderLabel: true,
    },
]

const nodeDefinitions: NodeDefinition[] = [
    ...baseDefinitions.map(d => ({
        ...d,
        notationGroupId: undefined,
    })),
    ...notations.map(n => ({
        type: n.type,
        label: n.label,
        notation: n.notation,
        notationGroupId: n.notationId,
        box: n.box,
        renderLabel: n.renderLabel ?? true,
    })),

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
        primitive => ({
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
