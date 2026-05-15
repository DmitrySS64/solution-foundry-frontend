import type { NodeTextStyle } from '../../model/types/node.types'

type KonvaFontStyle =
    | 'normal'
    | 'italic'
    | 'bold'
    | 'italic bold'

export const getKonvaFontStyle = (
    style: Pick<NodeTextStyle, 'fontStyle' | 'fontWeight'>,
): KonvaFontStyle => {
    const fontStyle = style.fontStyle === 'italic' ? 'italic' : 'normal'
    const fontWeight = style.fontWeight === 'bold' ? 'bold' : 'normal'

    if (fontStyle === 'italic' && fontWeight === 'bold') {
        return 'italic bold'
    }

    if (fontStyle === 'italic') {
        return 'italic'
    }

    if (fontWeight === 'bold') {
        return 'bold'
    }

    return 'normal'
}

