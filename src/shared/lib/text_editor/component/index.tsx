import React, {useState} from 'react';
import {EBlockType, type IBlock, type IBlockEditorProps} from '../interface';
import Toolbar from "@shared/lib/text_editor/toolbar/component";
import {useTextEditor} from "@shared/lib/text_editor/presenter";
import {BlockRenderer} from "@shared/lib/text_editor/components";
import {useToolbar} from '../toolbar/presenter';


const EditorLayout = ({ children }) => {
    return (
        <div className="flex h-[calc(100vh-170px)] flex-col overflow-hidden">
            {children}
        </div>
    );
};

const EditorScroll = ({ children }) => {
    return (
        <div className="flex h-full w-full justify-center overflow-y-auto p-4">
            {children}
        </div>
    );
};

const EditorContainer = ({ children, onDragOver }) => {
    return (
        <div
            onDragOver={onDragOver}
            className="w-full max-w-[700px] min-h-[200px] h-fit bg-white border border-border rounded-md p-4"
        >
            {children}
        </div>
    );
};

const BlockEditor: React.FC<IBlockEditorProps> = (props) => {
    const defaultBlocks: IBlock[] = props.initialBlocks && props.initialBlocks.length > 0
        ? props.initialBlocks
        : [{ id: 'default', type: EBlockType.paragraph, content: '' }];

    const editor = useTextEditor({...props, initialBlocks: defaultBlocks})
    const toolbar = useToolbar(editor, props.toolbarItems);


    const [dragOverBlock, setDragOverBlock] = useState<string | null>(null);
    const [draggedBlock, setDraggedBlock] = useState<string | null>(null);
    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent, blockId: string) => {
        setDraggedBlock(blockId);
        e.dataTransfer.setData('text/plain', blockId);
        e.dataTransfer.effectAllowed = 'move';
    };
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };
    const handleDrop = (e: React.DragEvent, targetBlockId: string) => {
        e.preventDefault();
        const sourceBlockId = e.dataTransfer.getData('text/plain');

        if (sourceBlockId && sourceBlockId !== targetBlockId) {
            //editor.moveBlockBefore()

            // Находим индексы блоков
            const sourceIndex = editor.blocks.findIndex(b => b.id === sourceBlockId);
            const targetIndex = editor.blocks.findIndex(b => b.id === targetBlockId);

            if (sourceIndex !== -1 && targetIndex !== -1) {
                // Перемещаем блок
                const newBlocks = [...editor.blocks];
                const [movedBlock] = newBlocks.splice(sourceIndex, 1);
                newBlocks.splice(targetIndex, 0, movedBlock);

                // Обновляем состояние через presenter
                editor.blocks.forEach((block) => {
                    if (block.id === movedBlock.id) {
                        editor.rearrangeBlocks(newBlocks);
                        // Здесь нужно обновить порядок блоков в presenter'е
                        // Для этого добавим метод rearrangeBlocks в useTextEditor
                    }
                });
            }
        }

        setDragOverBlock(null);
        setDraggedBlock(null);
    };

    return (
        <EditorLayout>
            {/* Верхнее меню инструментов */}
            <Toolbar
                items={toolbar.items}
                onAction={toolbar.handleToolbarAction}
                canUndo={editor.canUndo}
                canRedo={editor.canRedo}
            />

            <EditorScroll>
                <EditorContainer onDragOver={handleDragOver}>
                    {editor.blocks.map(block => (
                        <BlockRenderer
                            block={block}
                            isFocused={editor.focusedBlockId === block.id}
                            onUpdateContent={(content) => editor.updateBlockContent(block.id, content)}
                            onUpdateData={(data) => editor.updateBlockData(block.id, data)}
                            updateBlockItems={(items) => editor.updateBlockItems(block.id, items)}
                            onKeyDown={(e) => editor.handleKeyDown(e, block.id)}
                            onAddBlockAfter={() => editor.addBlockAfter(block.id)}
                            deleteBlock={()=>editor.deleteBlock(block.id)}
                            onMoveBlock={editor.moveBlock}
                            onDragStart={handleDragStart}
                            onDragOver={handleDragOver}
                            onDrop={handleDrop}
                            blockRef={
                                (el) => { if (el) editor.blockRefs.current[block.id] = el; }
                            }
                            isDragging={draggedBlock === block.id}
                            dragOverBlock={dragOverBlock}
                        />
                    ))}
                </EditorContainer>
            </EditorScroll>

        </EditorLayout>
    );
};

export default BlockEditor;