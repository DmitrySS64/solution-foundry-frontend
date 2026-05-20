
import { Text as KonvaText } from 'react-konva';

import type { DiagramNode } from '@/modules/diagram/model/types/node.types';

type Props = {
    node: DiagramNode;
};

/**
 * Простой кастомный пример: рисуем label в центре с увеличенным шрифтом.
 * Нужен только для демонстрации контракта.
 */
export const KonvaTextLabelRenderer = ({ node }: Props) => {
    return (
        <KonvaText
            width={node.width}
            height={node.height}
            text={node.label}
            fill={node.textStyle.fill}
            fontSize={Math.max(node.textStyle.fontSize, 18)}
            fontFamily={node.textStyle.fontFamily}
            fontStyle={node.textStyle.fontStyle === 'italic' ? 'italic' : 'normal'}
            fontWeight={node.textStyle.fontWeight}
            align={node.textStyle.align}
            verticalAlign="middle"
            listening={false}
        />
    );
};

