//canvas/layers/TransformerLayer
import {
    Transformer,
} from 'react-konva'

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from 'react'

import Konva from 'konva'

import {
    useSelectionIds,
    useEditorActions,
    useDocument,
} from '../../store/selectors'

interface Props {
    stageRef: React.RefObject<Konva.Stage | null>
}

const TransformerLayer = ({
                              stageRef,
                          }: Props) => {

    const transformerRef = useRef<Konva.Transformer>(null)
    const selection = useSelectionIds()
    const { nodes = [], edges = [] } = useDocument();

    const safeNodes = Array.isArray(nodes) ? nodes : [];
    const { updateNode } = useEditorActions()

    const selectedNodes = useMemo(
        () => nodes.filter(node => selection.includes(node.id)),
        [nodes, selection]
    )

    const keepRatio = useMemo(() => {
        if (selectedNodes.length === 0) return false;

        return selectedNodes.every(node => {
            // Проверка preserveAspectRatio
            const preserve = (node as any)?.preserveAspectRatio;
            if (typeof preserve === 'boolean') return preserve;

            // ✅ Безопасная работа с primitives
            const primitives = node.notation?.primitives;

            // Если primitives — не массив, считаем что его нет
            if (!Array.isArray(primitives) || primitives.length === 0) {
                return node.type === 'circle';
            }

            const drawable = primitives.filter((p: any) =>
                p.type !== 'text' && p.type !== 'svg'
            );

            return drawable.length > 0 && drawable.every((p: any) => p.type === 'circle');
        });
    }, [selectedNodes]); // ✅ Добавили зависимость

    useEffect(() => {
        const transformer = transformerRef.current;
        const stage = stageRef.current;
        if (!transformer || !stage) return;

        const konvaNodes = selection
            .map(id => stage.findOne(`#${id}`))
            .filter((node): node is Konva.Node => node !== null);

        transformer.nodes(konvaNodes);
        transformer.getLayer()?.batchDraw();
    }, [selection, stageRef]);

    // ✅ Вынесли логику обновления в отдельную функцию
    const handleNodeTransform = useCallback((node: Konva.Node) => {
        const width = Math.max(40, node.width() * node.scaleX());
        const height = Math.max(40, node.height() * node.scaleY());
        const matchNode = safeNodes.find(n => n.id === node.id());
        const canStretch = (matchNode as any)?.canStretch;

        return {
            x: node.x(),
            y: node.y(),
            width: canStretch === false ? Math.max(40, node.width()) : width,
            height: canStretch === false ? Math.max(40, node.height()) : height,
        };
    }, [safeNodes]);

    return (
        <Transformer
            ref={transformerRef}
            rotateEnabled={false}
            anchorSize={8}
            keepRatio={keepRatio}
            enabledAnchors={[
                'top-left',
                'top-right',
                'bottom-left',
                'bottom-right',
            ]}
            onTransform={()=>{
                const transformer = transformerRef.current;
                if (!transformer) return;
                transformer.nodes().forEach(node => {
                    updateNode(node.id(), handleNodeTransform(node));
                });
            }}
            onTransformEnd={() => {
                const transformer = transformerRef.current;
                if (!transformer) return;
                transformer.nodes().forEach(node => {
                    updateNode(node.id(), handleNodeTransform(node));
                    // Сброс скейла после применения размеров
                    node.scaleX(1);
                    node.scaleY(1);
                });
            }}
        />
    )
}

export {
    TransformerLayer
}