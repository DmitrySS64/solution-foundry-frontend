//canvas/layers/TextLayer
import { Text } from 'react-konva'
import {useDocument} from '../../store/selectors.ts'

const TextLayer = () => {
    const { nodes } = useDocument()

    return (
        <>
            {nodes
                .filter(node => node.textOutsideGroup && node.renderLabel !== false)
                .map(node => (
                    <Text
                        key={`${node.id}-text`}
                        x={node.x}
                        y={node.y + node.height + 10} // Добавлено 10px для визуального отделения
                        width={node.width}
                        height={20}
                        text={node.label}
                        fill={node.textStyle.fill}
                        fontSize={node.textStyle.fontSize}
                        fontFamily={node.textStyle.fontFamily}
                        fontStyle={node.textStyle.fontStyle}
                        align={node.textStyle.align}
                        verticalAlign="top"
                        listening={false}
                    />
                ))}
        </>
    )
}

export { TextLayer }