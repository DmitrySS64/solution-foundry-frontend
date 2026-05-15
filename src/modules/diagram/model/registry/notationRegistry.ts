import type {
    NodeType,
    NodeNotation,
} from '../types/node.types'

import nodeBpmnRaw from '@/../public/notations/bpmn.json'

export type NotationBoxRules = {
    initialWidth: number
    initialHeight: number
    canStretch: boolean
    preserveAspectRatio: boolean
}

export type NotationDefinition = {
    type: NodeType
    label: string
    notation: NodeNotation
    notationId: string
    box: NotationBoxRules
    renderLabel?: boolean
}

const notations: NotationDefinition[] = [
    ...((nodeBpmnRaw as any).elements as any[]).map((el: any) => {
        const type = el.type as NodeType

        // Label лишний: убираем соответствующее поле из properties.
        const rawProperties = (el.properties ?? []) as any[]
        const properties = rawProperties
            .filter(p => p?.name !== 'label')
            .map((p: any) => {
                const t = p.type
                const normalizedType = t === 'boolean'
                    ? 'boolean'
                    : t === 'select'
                        ? 'select'
                        : t === 'color'
                            ? 'color'
                            : t === 'number'
                                ? 'number'
                                : 'text'

                const value = p.default ?? (normalizedType === 'boolean'
                    ? false
                    : normalizedType === 'number'
                        ? 0
                        : normalizedType === 'select'
                            ? p.options?.[0] ?? ''
                            : '')

                return {
                    name: p.name,
                    label: p.label,
                    type: normalizedType,
                    value,
                    options: normalizedType === 'select' ? p.options : undefined,
                    editable: p.editable ?? true,
                }

            })

        const shapeType = el.defaults?.shapeType as string | undefined
        const primitives = (el.primitives ?? undefined) as any[] | undefined

        return {
            type,
            label: String(el.name),
            notationId: 'bpmn',
            box: {
                initialWidth: Number(el.defaults?.width ?? 160),
                initialHeight: Number(el.defaults?.height ?? 80),
                canStretch: true,
                preserveAspectRatio: false,
            },
            renderLabel: false,
            notation: {
                id: `bpmn.${String(el.type)}`,
                name: String(el.name),
                properties: properties as any,
                primitives: (primitives && primitives.length > 0)
                    ? primitives
                    : (shapeType
                        ? [
                            {
                                type: shapeType === 'rectangle'
                                    ? 'rect'
                                    : shapeType === 'diamond'
                                        ? 'diamond'
                                        : 'rect',
                                x: 0,
                                y: 0,
                                width: 1,
                                height: 1,
                            } as any,
                        ]
                        : []),
            },
        }
    }),
]


export {
    notations,
}

