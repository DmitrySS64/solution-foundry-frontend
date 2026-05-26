// modules/diagram/canvas/renderers/utils/imageUtils.ts
import type { NodeImageSource } from '@/modules/diagram/model/types/node.types';

export const isInlineSvg = (value: string): boolean =>
    value.trimStart().startsWith('<svg');

export const resolveImageSource = (source: string | NodeImageSource | undefined): string | undefined => {
    if (!source) return undefined;

    if (typeof source === 'string') {
        if (source.startsWith('/') || source.startsWith('http')) return source;
        if (isInlineSvg(source)) {
            return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
        }
        return source;
    }

    const rawSource = source.svg ?? source.src ?? source.url ?? source.href;
    if (!rawSource) return undefined;

    return source.svg || isInlineSvg(rawSource)
        ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(rawSource)}`
        : rawSource;
};

export const getPreserveAspectRatio = (source: string | NodeImageSource | undefined): boolean =>
    typeof source === 'object' ? source.preserveAspectRatio ?? true : true;