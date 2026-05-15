//canvas/layers/TransformerLayer
import {
    Transformer,
} from 'react-konva'

import {
    useEffect,
    useMemo,
    useRef,
} from 'react'

import Konva from 'konva'

import {
    useSelectionIds,
    useEditorActions,
    useNodes,
} from '../../store/selectors'

interface Props {
    stageRef: React.RefObject<Konva.Stage | null>
}

const TransformerLayer = ({
                              stageRef,
                          }: Props) => {

    const transformerRef =
        useRef<Konva.Transformer>(null)

    const selection =
        useSelectionIds()
    const nodes =
        useNodes()

    const { updateNode } =
        useEditorActions()

    const selectedNodes = useMemo(
        () => nodes.filter(node => selection.includes(node.id)),
        [nodes, selection]
    )

    const keepRatio =
        selectedNodes.length > 0
            && selectedNodes.every(node => {
                    const preserve = (selectedNodes.find(n => n.id === (node as any).id) as any)?.preserveAspectRatio

                if (typeof preserve === 'boolean') {
                    return preserve
                }

                const primitives = node.notation?.primitives
                if (!primitives || primitives.length === 0) {
                    return node.type === 'circle'
                }
                const drawable = primitives.filter(p => p.type !== 'text' && p.type !== 'svg')
                return drawable.length > 0 && drawable.every(p => p.type === 'circle')
            })

    useEffect(() => {

        const transformer =
            transformerRef.current

        const stage =
            stageRef.current

        if (!transformer || !stage) {
            return
        }

        const nodes =
            selection
                .map(id =>
                    stage.findOne(`#${id}`)
                )
                .filter(Boolean)

        transformer.nodes(
            nodes as Konva.Node[]
        )

        transformer.getLayer()?.batchDraw()

    }, [selection, stageRef])

    return (
        <Transformer
            ref={transformerRef}
            rotateEnabled={false}
            anchorSize={8}
            keepRatio={keepRatio}
            enabledAnchors={[
                'top-left',
                //'top-center',
                'top-right',
                //'middle-left',
                //'middle-right',
                'bottom-left',
                //'bottom-center',
                'bottom-right',
            ]}

            onTransformEnd={() => {

                const transformer =
                    transformerRef.current

                if (!transformer) return

                transformer.nodes().forEach((node) => {

                    const box =
                        node.getClientRect()




                    const width =
                        Math.max(
                            40,
                            box.width
                        )

                    const height =
                        Math.max(
                            40,
                            box.height
                        )

                    const canStretch = (selectedNodes.find(n => n.id === (node as any).id()) as any)?.canStretch

                    updateNode(node.id(), {
                        width: canStretch === false ? Math.max(40, node.width()) : width,
                        height: canStretch === false ? Math.max(40, node.height()) : height,

                        rotation: node.rotation(),
                    })

                    node.scaleX(1)
                    node.scaleY(1)
                })
            }}
        />
    )
}

export {
    TransformerLayer
}