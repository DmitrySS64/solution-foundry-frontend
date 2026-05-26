// modules/diagram/canvas/renderers/EditableLabel.tsx
import { Text } from 'react-konva';
import { Html } from 'react-konva-utils';
import type { NodeTextStyle } from '@/modules/diagram/model/types/node.types.ts';
import { useInlineEdit } from './hooks/useInlineEdit';
import { getKonvaFontStyle } from './labelStyleUtils';
import { stopEventPropagation } from './utils/eventHandlers';
import Konva from "konva";
import { useEffect } from 'react';

interface Props {
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    textStyle: NodeTextStyle;
    isEditable: boolean;
    onUpdate: (value: string) => void;
    nodeId?: string;
    onStartEditing?: () => void;
    onStopEditing?: () => void;
}

export const EditableLabel = ({
                                  x,
                                  y,
                                  width,
                                  height,
                                  text,
                                  textStyle,
                                  isEditable,
                                  onUpdate,
                                  nodeId,
                                  onStartEditing,
                                  onStopEditing,
                              }: Props) => {
    const {
        isEditing,
        value,
        setValue,
        inputRef,
        startEditing,
        commitEdit,
        handleKeyDown,
        cancelEdit,
    } = useInlineEdit({
        initialValue: text,
        isEditable,
        onSave: (val) => {
            onUpdate(val);
            onStopEditing?.();
        },
        onCancel: () => {
            onStopEditing?.();
        },
    });

    // Notify parent when editing starts/stops
    useEffect(() => {
        if (isEditing) {
            onStartEditing?.();
        }
    }, [isEditing, onStartEditing]);

    const konvaFontStyle = getKonvaFontStyle({
        fontStyle: textStyle.fontStyle,
        fontWeight: textStyle.fontWeight,
    });

    const textAlign = textStyle.align === 'center' ? 'center' :
        textStyle.align === 'right' ? 'right' : 'left';

    const inputStyles: React.CSSProperties = {
        width: '100%',
        height: '100%',
        border: '2px solid #3B82F6',
        borderRadius: '4px',
        padding: '4px 8px',
        fontSize: textStyle.fontSize,
        fontFamily: textStyle.fontFamily,
        color: textStyle.fill,
        background: 'rgba(255,255,255,0.95)',
        outline: 'none',
        boxSizing: 'border-box',
        textAlign,
    };

    if (isEditing) {
        return (
            <Html
                groupProps={{ x: 0, y: 0, width, height }}
                divProps={{
                    onPointerDown: stopEventPropagation,
                    onMouseDown: stopEventPropagation,
                    onClick: stopEventPropagation,
                }}
            >
                <input
                    ref={inputRef}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onBlur={commitEdit}
                    onKeyDown={handleKeyDown}
                    style={inputStyles}
                    onMouseDown={stopEventPropagation}
                    onPointerDown={stopEventPropagation}
                    onClick={stopEventPropagation}
                />
            </Html>
        );
    }

    return (
        <Text
            x={x}
            y={y}
            width={width}
            height={height}
            text={text}
            fill={textStyle.fill}
            fontSize={textStyle.fontSize}
            fontFamily={textStyle.fontFamily}
            fontStyle={konvaFontStyle}
            align={textStyle.align}
            verticalAlign="middle"
            listening={true}
            onDblClick={(e: Konva.KonvaEventObject<MouseEvent>) => {
                e.cancelBubble = true;
                startEditing();
            }}
            onMouseEnter={(e) => {
                if (isEditable) {
                    const stage = e.target.getStage();
                    if (stage) stage.container().style.cursor = 'text';
                }
            }}
            onMouseLeave={(e) => {
                const stage = e.target.getStage();
                if (stage) stage.container().style.cursor = 'default';
            }}
        />
    );
};
