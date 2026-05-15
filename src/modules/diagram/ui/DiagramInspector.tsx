//ui/DiagramInspector
import type {ReactNode} from 'react'
import type {
    DiagramEdge,
    EdgePoint,
} from '../model/types'
import type {
    DiagramNode,
    NodeStyle,
    NodeTextStyle,
} from '../model/types/node.types'
import {
    useEditorActions,
    useSelectedEdge,
    useSelectedNode,
} from '../store/selectors'

const fieldClass =
    'w-full border rounded-md px-3 py-2 text-sm bg-white h-min-6'

const labelClass =
    'text-sm mb-1 block text-zinc-600'

const Section = ({
    title,
    children,
}: {
    title: string
    children: ReactNode
}) => (
    <section className='space-y-3'>
        <h4 className='font-semibold text-sm text-zinc-900'>
            {title}
        </h4>
        {children}
    </section>
)

const PropertyField = ({
    label,
    children,
}: {
    label: string
    children: ReactNode
}) => (
    <label className='block'>
        <span className={labelClass}>
            {label}
        </span>
        {children}
    </label>
)

const DiagramInspector = () => {

    const node =
        useSelectedNode()

    const edge =
        useSelectedEdge()

    const {
        updateNode,
        updateEdge,
    } = useEditorActions()

    if (edge) {
        return (
            <EdgeInspector
                edge={edge}
                updateEdge={updateEdge}
            />
        )
    }

    if (node) {
        return (
            <NodeInspector
                node={node}
                updateNode={updateNode}
            />
        )
    }

    return (
        <div className='p-4 text-sm text-zinc-500'>
            Ничего не выбрано
        </div>
    )
}

const NodeInspector = ({
    node,
    updateNode,
}: {
    node: DiagramNode
    updateNode: (id: string, updater: Partial<DiagramNode>) => void
}) => {
    const style: NodeStyle =
        Object.assign(
            {
                fill: '#DBEAFE',
                stroke: '#3B82F6',
                strokeWidth: 2,
                cornerRadius: 8,
                opacity: 1,
            },
            node.style,
        )

    const textStyle: NodeTextStyle =
        Object.assign(
            {
                fill: '#111827',
                fontSize: 13,
                fontFamily: 'Arial',
                fontStyle: 'normal' as const,
                fontWeight: 'normal' as const,
                align: 'center' as const,
            },
            node.textStyle,
        )

    return (
        <>
            <div className='p-3 border-b border-border font-semibold'>
                Свойства блока
            </div>

            <div className='p-4 space-y-5 overflow-auto'>
                <Section title='Контент'>
                    <PropertyField label='Label'>
                        <input
                            value={node.label}
                            onChange={(e) =>
                                updateNode(node.id, {
                                    label: e.target.value,
                                })
                            }
                            className={fieldClass}
                        />
                    </PropertyField>
                </Section>

                <Section title='Блок'>
                    <PropertyField label='Заливка'>
                        <input
                            type='color'
                            value={style.fill}
                            onChange={(e) =>
                                updateNode(node.id, {
                                    style: {
                                        ...style,
                                        fill: e.target.value,
                                    },
                                })
                            }
                        />
                    </PropertyField>

                    <PropertyField label='Контур'>
                        <input
                            type='color'
                            value={style.stroke}
                            onChange={(e) =>
                                updateNode(node.id, {
                                    style: {
                                        ...style,
                                        stroke: e.target.value,
                                    },
                                })
                            }
                        />
                    </PropertyField>

                    <PropertyField label='Толщина контура'>
                        <input
                            type='number'
                            min={0}
                            value={style.strokeWidth}
                            onChange={(e) =>
                                updateNode(node.id, {
                                    style: {
                                        ...style,
                                        strokeWidth: Number(e.target.value),
                                    },
                                })
                            }
                            className={fieldClass}
                        />
                    </PropertyField>

                    <PropertyField label='Скругление'>
                        <input
                            type='number'
                            min={0}
                            value={style.cornerRadius}
                            onChange={(e) =>
                                updateNode(node.id, {
                                    style: {
                                        ...style,
                                        cornerRadius: Number(e.target.value),
                                    },
                                })
                            }
                            className={fieldClass}
                        />
                    </PropertyField>
                </Section>

                <Section title='Текст'>
                    <PropertyField label='Цвет'>
                        <input
                            type='color'
                            value={textStyle.fill}
                            onChange={(e) =>
                                updateNode(node.id, {
                                    textStyle: {
                                        ...textStyle,
                                        fill: e.target.value,
                                    },
                                })
                            }
                        />
                    </PropertyField>

                    <PropertyField label='Размер'>
                        <input
                            type='number'
                            min={8}
                            value={textStyle.fontSize}
                            onChange={(e) =>
                                updateNode(node.id, {
                                    textStyle: {
                                        ...textStyle,
                                        fontSize: Number(e.target.value),
                                    },
                                })
                            }
                            className={fieldClass}
                        />
                    </PropertyField>

                    <PropertyField label='Начертание'>
                        <select
                            value={`${textStyle.fontStyle}-${textStyle.fontWeight}`}
                            onChange={(e) => {
                                const [fontStyle, fontWeight] =
                                    e.target.value.split('-') as [
                                        'normal' | 'italic',
                                        'normal' | 'bold',
                                    ]

                                updateNode(node.id, {
                                    textStyle: {
                                        ...textStyle,
                                        fontStyle,
                                        fontWeight,
                                    },
                                })
                            }}
                            className={fieldClass}
                        >
                            <option value='normal-normal'>Обычный</option>
                            <option value='normal-bold'>Жирный</option>
                            <option value='italic-normal'>Курсив</option>
                            <option value='italic-bold'>Жирный курсив</option>
                        </select>
                    </PropertyField>

                    <PropertyField label='Выравнивание'>
                        <select
                            value={textStyle.align}
                            onChange={(e) =>
                                updateNode(node.id, {
                                    textStyle: {
                                        ...textStyle,
                                        align: e.target.value as 'left' | 'center' | 'right',
                                    },
                                })
                            }
                            className={fieldClass}
                        >
                            <option value='left'>Слева</option>
                            <option value='center'>По центру</option>
                            <option value='right'>Справа</option>
                        </select>
                    </PropertyField>
                </Section>

                {node.notation && (
                    <Section title='Нотация'>
                        <PropertyField label='Тип'>
                            <input
                                value={node.notation.name}
                                readOnly
                                className={fieldClass}
                            />
                        </PropertyField>

                        {node.notation.properties.map(property => (
                            <PropertyField
                                key={property.name}
                                label={property.label}
                            >
                                {property.editable === false ? (
                                    <div className='pt-2 text-sm text-zinc-900'>
                                        {String(property.value)}
                                    </div>
                                ) : (
                                    <input
                                        value={String(property.value)}
                                        onChange={(e) =>
                                            updateNode(node.id, {
                                                notation: {
                                                    ...node.notation!,
                                                    properties:
                                                        node.notation!.properties.map(item =>
                                                            item.name === property.name
                                                                ? {
                                                                    ...item,
                                                                    value: e.target.value,
                                                                }
                                                                : item
                                                        ),
                                                },
                                            })
                                        }
                                        className={fieldClass}
                                        aria-label={property.label}
                                    />
                                )}
                            </PropertyField>
                        ))}
                    </Section>
                )}
            </div>
        </>
    )
}

const EdgeInspector = ({
    edge,
    updateEdge,
}: {
    edge: DiagramEdge
    updateEdge: (id: string, updater: Partial<DiagramEdge>) => void
}) => {
    const updateControlPoint = (
        index: number,
        point: Partial<EdgePoint>,
    ) => {
        updateEdge(edge.id, {
            controlPoints: edge.controlPoints.map(
                (current, currentIndex) =>
                    currentIndex === index
                        ? {
                            ...current,
                            ...point,
                        }
                        : current
            ),
        })
    }

    const labelStyle = Object.assign(
        {
            fill: '#111827',
            fontSize: 12,
            fontFamily: 'Arial',
            fontStyle: 'normal' as const,
            fontWeight: 'normal' as const,
        },
        edge.labelStyle,
    )

    return (
        <>
            <div className='p-3 border-b border-border font-semibold'>
                Свойства связи
            </div>

            <div className='p-4 space-y-5 overflow-auto'>
                <Section title='Контент'>
                    <PropertyField label='Label'>
                        <input
                            value={edge.label ?? ''}
                            onChange={(e) =>
                                updateEdge(edge.id, {
                                    label: e.target.value,
                                })
                            }
                            className={fieldClass}
                        />
                    </PropertyField>
                </Section>

                <Section title='Текст'>
                    <PropertyField label='Цвет'>
                        <input
                            type='color'
                            value={labelStyle.fill}
                            onChange={(e) =>
                                updateEdge(edge.id, {
                                    labelStyle: {
                                        ...labelStyle,
                                        fill: e.target.value,
                                    },
                                })
                            }
                        />
                    </PropertyField>

                    <PropertyField label='Размер'>
                        <input
                            type='number'
                            min={8}
                            value={labelStyle.fontSize}
                            onChange={(e) =>
                                updateEdge(edge.id, {
                                    labelStyle: {
                                        ...labelStyle,
                                        fontSize: Number(e.target.value),
                                    },
                                })
                            }
                            className={fieldClass}
                        />
                    </PropertyField>
                </Section>

                <Section title='Линия'>
                    <PropertyField label='Тип'>
                        <select
                            value={edge.type}
                            onChange={(e) =>
                                updateEdge(edge.id, {
                                    type: e.target.value as DiagramEdge['type'],
                                })
                            }
                            className={fieldClass}
                        >
                            <option value='straight'>Прямая</option>
                            <option value='orthogonal'>Ломаная</option>
                            <option value='bezier'>Bezier</option>
                        </select>
                    </PropertyField>

                    <PropertyField label='Цвет'>
                        <input
                            type='color'
                            value={edge.style.stroke}
                            onChange={(e) =>
                                updateEdge(edge.id, {
                                    style: {
                                        ...edge.style,
                                        stroke: e.target.value,
                                    },
                                })
                            }
                        />
                    </PropertyField>

                    <PropertyField label='Толщина'>
                        <input
                            type='number'
                            min={1}
                            value={edge.style.strokeWidth}
                            onChange={(e) =>
                                updateEdge(edge.id, {
                                    style: {
                                        ...edge.style,
                                        strokeWidth: Number(e.target.value),
                                    },
                                })
                            }
                            className={fieldClass}
                        />
                    </PropertyField>
                </Section>

                <Section title='Концы'>
                    <PropertyField label='Начало линии'>
                        <select
                            value={edge.style.startCap ?? 'none'}
                            onChange={(e) =>
                                updateEdge(edge.id, {
                                    style: {
                                        ...edge.style,
                                        startCap: e.target.value as 'none' | 'arrow',
                                    },
                                })
                            }
                            className={fieldClass}
                        >
                            <option value='none'>Линия</option>
                            <option value='arrow'>Стрелка</option>
                        </select>
                    </PropertyField>

                    <PropertyField label='Конец линии'>
                        <select
                            value={edge.style.endCap ?? 'arrow'}
                            onChange={(e) =>
                                updateEdge(edge.id, {
                                    style: {
                                        ...edge.style,
                                        endCap: e.target.value as 'none' | 'arrow',
                                    },
                                })
                            }
                            className={fieldClass}
                        >
                            <option value='none'>Линия</option>
                            <option value='arrow'>Стрелка</option>
                        </select>
                    </PropertyField>
                </Section>

                <Section title='Точки перегиба'>
                    <button
                        type='button'
                        className='w-full border rounded-md px-3 py-2 text-sm hover:bg-zinc-100'
                        onClick={() =>
                            updateEdge(edge.id, {
                                type: 'orthogonal',
                                controlPoints: [
                                    ...edge.controlPoints,
                                    {
                                        x: (
                                            edge.source.point.x +
                                            edge.target.point.x
                                        ) / 2,
                                        y: (
                                            edge.source.point.y +
                                            edge.target.point.y
                                        ) / 2,
                                    },
                                ],
                            })
                        }
                    >
                        Добавить точку
                    </button>

                    {edge.controlPoints.map((point, index) => (
                        <div
                            key={`${edge.id}-${index}`}
                            className='grid grid-cols-[1fr_1fr_auto] gap-2'
                        >
                            <input
                                type='number'
                                value={Math.round(point.x)}
                                onChange={(e) =>
                                    updateControlPoint(index, {
                                        x: Number(e.target.value),
                                    })
                                }
                                className={fieldClass}
                            />
                            <input
                                type='number'
                                value={Math.round(point.y)}
                                onChange={(e) =>
                                    updateControlPoint(index, {
                                        y: Number(e.target.value),
                                    })
                                }
                                className={fieldClass}
                            />
                            <button
                                type='button'
                                className='border rounded-md px-3 text-sm hover:bg-zinc-100'
                                onClick={() =>
                                    updateEdge(edge.id, {
                                        controlPoints:
                                            edge.controlPoints.filter(
                                                (_, currentIndex) =>
                                                    currentIndex !== index
                                            ),
                                    })
                                }
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </Section>
            </div>
        </>
    )
}

export {
    DiagramInspector
}
