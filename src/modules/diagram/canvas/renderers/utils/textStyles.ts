// modules/diagram/canvas/renderers/utils/textStyles.ts
import type { NodeTextStyle } from '@/modules/diagram/model/types/node.types';

/** Дефолтные стили для текста ноды */
export const DEFAULT_TEXT_STYLE: NodeTextStyle = {
    fill: '#111827',
    fontSize: 13,
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: 'normal',
    align: 'center',
};

/** Мердж стилей с дефолтными значениями */
export const mergeTextStyles = (custom?: Partial<NodeTextStyle>): NodeTextStyle => ({
    ...DEFAULT_TEXT_STYLE,
    ...custom,
});

/** Конвертация стилей в формат Konva */
export const getKonvaFontStyle = ({
                                      fontStyle,
                                      fontWeight,
                                  }: {
    fontStyle?: 'normal' | 'italic';
    fontWeight?: 'normal' | 'bold';
}): 'normal' | 'bold' | 'italic' | 'italic bold' => {
    if (fontStyle === 'italic' && fontWeight === 'bold') return 'italic bold';
    if (fontStyle === 'italic') return 'italic';
    if (fontWeight === 'bold') return 'bold';
    return 'normal';
};

/** Вычисление textAlign для HTML-инпута */
export const getTextAlignForInput = (align: NodeTextStyle['align']): 'left' | 'center' | 'right' => {
    if (align === 'center') return 'center';
    if (align === 'right') return 'right';
    return 'left';
};