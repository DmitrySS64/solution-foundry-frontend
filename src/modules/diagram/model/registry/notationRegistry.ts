import type {
    NodeType,
    NodeNotation,
} from '../types/node.types'

import nodeBpmnRaw from '@/../public/notations/bpmn.json'
import nodeUmlRaw from '@/../public/notations/uml.json'
import nodeC4Raw from '@/../public/notations/c4.json'

export type NotationBoxRules = {
    initialWidth: number
    initialHeight: number
    canStretch: boolean
    preserveAspectRatio: boolean
}

export type NotationDefinition = {
    type: NodeType
    label: string
    defaultLabel?: string
    notation: NodeNotation
    notationId: string
    box: NotationBoxRules
    renderLabel?: boolean
    textOutsideGroup?: boolean
}

type RawNotationProperty = {
    name: string
    label: string
    type: string
    default?: unknown
    options?: unknown
    editable?: boolean
}

type RawNotationElement = {
    type: NodeType
    name: string
    properties?: RawNotationProperty[]
    defaults?: {
        width?: number
        height?: number
        shapeType?: string
        renderLabel?: boolean
    }
    image?: unknown
    preview?: unknown
    primitives?: any[]
    renderLabel?: boolean
}

type RawNotation = {
    elements: RawNotationElement[]
}

const normalizeProperties = (
    rawProperties: RawNotationProperty[],
) => {
    return rawProperties

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

            const value = p.default ?? (
                normalizedType === 'boolean'
                    ? false
                    : normalizedType === 'number'
                        ? 0
                        : normalizedType === 'select'
                            ? p.options?.[0] ?? ''
                            : ''
            )

            return {
                name: p.name,
                label: p.label,
                type: normalizedType,
                value,
                options: normalizedType === 'select' ? p.options : undefined,
                editable: p.editable ?? true,
            }
        })
}

const mapNotationElements = (
    notationId: string,
    raw: RawNotation,
): NotationDefinition[] => {

    return ((raw as any).elements as any[]).map((el: any) => {
        const type = el.type as NodeType

        const rawProperties = (el.properties ?? []) as any[]
        const properties = normalizeProperties(rawProperties)
        const labelProperty =
            rawProperties.find(p => p?.name === 'label')

        const shapeType = el.defaults?.shapeType as string | undefined
        const primitives = (el.primitives ?? undefined) as any[] | undefined
        const hasImage =
            Boolean(el.image)
            || Boolean((el as any).svg)
            || primitives?.some(
                primitive =>
                    primitive?.type === 'image'
                    || primitive?.type === 'svg',
            )
            || false

        return {
                    type,
                    label: String(el.name),
                    defaultLabel: String(labelProperty?.default ?? el.name ?? 'Node'),
                    notationId,
                    box: {
                        initialWidth: Number(el.defaults?.width ?? 160),
                        initialHeight: Number(el.defaults?.height ?? 80),
                        canStretch: true,
                        preserveAspectRatio: false,
                    },
                    renderLabel: Boolean(
                        el.renderLabel
                        ?? el.defaults?.renderLabel
                        ?? hasImage,
                    ),
                    textOutsideGroup: Boolean(el.textOutsideGroup),
                    notation: {
                id: `${notationId}.${String(el.type)}`,
                name: String(el.name),
                image: el.image as any,
                preview: el.preview as any,
                svg: (el as any).svg,
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
    })
}

const notations: NotationDefinition[] = [
    ...mapNotationElements('bpmn', nodeBpmnRaw),
    ...mapNotationElements('uml', nodeUmlRaw),
    ...mapNotationElements('c4', nodeC4Raw),
]

export {
    notations,
}

