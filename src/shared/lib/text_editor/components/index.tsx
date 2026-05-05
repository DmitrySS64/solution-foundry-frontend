import {EBlockType, type IBlock} from "@shared/lib/text_editor/interface";
import React from "react";
import {ParagraphBlock} from "./paragraph";
import TableBlock from "./table/component";
import CodeBlock from "./code";
import HeadingBlock from "./header";
import ListBlock from "@shared/lib/text_editor/components/list";
import {IconButton} from "@shared/ui/form/icon_button";
import {ICON_PATHS} from "@shared/enum/icons";
import {cn} from "@shared/ui/lib/cn";

interface IBlockRenderProps {
    block: IBlock;
    isFocused: boolean;
    onUpdateContent: (content: string) => void;
    onUpdateData: (data: unknown) => void;
    updateBlockItems: (data: string[]) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    onAddBlockAfter: (blockId: string) => void;
    onMoveBlock: (blockId: string, direction: 'up' | 'down') => void;
    onDragStart: (e: React.DragEvent, blockId: string) => void;
    onDragOver: (e: React.DragEvent) => void;
    onDrop: (e: React.DragEvent, targetBlockId: string) => void;
    blockRef?: (el: HTMLTextAreaElement | null) => void;
    isDragging?: boolean;
    dragOverBlock?: string | null;
    deleteBlock: () => void;
}


const BlockRenderer: React.FC<IBlockRenderProps> = ({
    block,
    isFocused,
    onUpdateContent,
    onUpdateData,
    onKeyDown,
    onAddBlockAfter,
    onDragStart,
    onDragOver,
    updateBlockItems,
    onDrop,
    blockRef,
    dragOverBlock = null, deleteBlock
}) => {
    const isDragOver = dragOverBlock === block.id;

    const commonProps = {
        block,
        isFocused,
        onUpdate: onUpdateContent,
        onKeyDown,
        blockRef,
    };

    const renderBlockContent = () => {
        switch (block.type) {
            case EBlockType.heading:
                return <HeadingBlock {...commonProps} />;

            case EBlockType.code:
                return <CodeBlock {...commonProps} />;

            case EBlockType.table:
                return (
                    <TableBlock
                        block={block}
                        isFocused={isFocused}
                        onUpdate={onUpdateData}
                        onKeyDown={onKeyDown}
                    />
                );

            case EBlockType.ol:
            case EBlockType.list:
                return <ListBlock
                    block={block}
                    isFocused={isFocused}
                    onKeyDown={(e) => onKeyDown(e)}
                    onUpdate={(_, items) => {
                        if (items) {
                            updateBlockItems(items);
                        }
                    }}
                    delBlock={deleteBlock}
                />

            case EBlockType.quote:
                return (
                    <blockquote className={'border-l-4 border-blue-500 pl-4 italic text-gray-600'}>
                        <ParagraphBlock {...commonProps} />
                    </blockquote>
                );

            case EBlockType.divider:
                return (
                    <div className={'my-4 flex items-center text-gray-300 cursor-pointer'}>
                        <hr className="flex-1 border-t border-gray-200"/>
                        <span className="mx-4 text-lg">―</span>
                        <hr className="flex-1 border-t border-gray-200" />
                    </div>
                );

            default:
                return <ParagraphBlock {...commonProps} />;
        }
    }

    return (
        <div
            //className="block-container"
            className={cn(
                "relative flex items-start rounded-md pr-16 transition group",
                isDragOver && "bg-blue-50 border-2 border-dashed border-blue-400 p-2"
            )}
            draggable
            onDragStart={(e) => onDragStart(e, block.id)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, block.id)}
        >
            <div className="mr-2 flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                {/* Кнопка добавления блока */}
                <IconButton
                    path={ICON_PATHS.ADD}
                    onClick={() => onAddBlockAfter(block.id)}
                    title="Добавить блок после"
                    tabIndex={-1}
                    className="hover:bg-blue-500 hover:text-black"
                />
                {/* Drag handle */}
                <IconButton
                    path={ICON_PATHS.MORE_VERT}
                    draggable
                    onDragStart={(e) => onDragStart(e, block.id)}
                    tabIndex={-1}
                    title="Переместить блок"
                />

            </div>

            {/* Content */}
            <div className="w-full">{renderBlockContent()}</div>

            {/* Индикатор перетаскивания */}
            {isDragOver && (
                <div className="absolute -bottom-2 left-0 h-1 w-full rounded bg-blue-500"/>
            )}
        </div>
    );
};

export {BlockRenderer};