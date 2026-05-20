import React from 'react';
import type { DiagramNode } from '@/modules/diagram/model/types/node.types';

import { KonvaTextLabelRenderer } from './KonvaTextLabelRenderer';

/**
 * Минимальная реализация p.4.
 * Рендерер выбирается через node.customRendererId.
 * Пока здесь один пример, чтобы контракт был рабочим.
 */

type CustomRendererProps = {
    node: DiagramNode;
};

type CustomRenderer = (props: CustomRendererProps) => React.ReactNode;

const customRendererRegistry = new Map<string, CustomRenderer>([
    ['example.label', ({ node }) => <KonvaTextLabelRenderer node={node} />],
]);

export { customRendererRegistry };



