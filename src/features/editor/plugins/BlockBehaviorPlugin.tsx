import {
    KEY_ENTER_COMMAND,
    KEY_BACKSPACE_COMMAND,
    $getRoot,
    $getSelection,
    $createTextNode,
    $isRangeSelection,
    $createParagraphNode
} from "lexical";
import { ElementNode } from 'lexical';
import { $isListNode, $isListItemNode, $createListItemNode } from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { BlockNode } from "@/entities/editor/nodes/BlockNode";

export const BlockBehaviorPlugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        editor.update(() => {
            const root = $getRoot();

            if (root.getChildren().length === 0) {
                const block = new BlockNode("paragraph");
                block.append($createTextNode(""));
                root.append(block);
                block.select();
            }
        });
    }, [editor]);

    useEffect(() => {
        // Enter → новый блок
        const removeEnter = editor.registerCommand(
            KEY_ENTER_COMMAND,
            (e) => {
                if (!e?.shiftKey) {
                    e?.preventDefault();

                    editor.update(() => {
                        const selection = $getSelection();
                        if (!$isRangeSelection(selection)) return;

                        const currentBlock = selection.anchor.getNode().getTopLevelElement();
                        if (!currentBlock) return;

                        // Если мы внутри элемента списка
                        if ($isListItemNode(currentBlock)) {
                            const listNode = currentBlock.getParent();
                            if (listNode && $isListNode(listNode)) {
                                const children = listNode.getChildren();
                                const currentIndex = children.findIndex(child => child === currentBlock);
                                const isLastItem = currentIndex === children.length - 1;

                                const isEmpty = currentBlock.getChildrenSize() === 0;

                                // Если последний элемент пустой, выходим из списка
                                if (isLastItem && isEmpty) {
                                    const paragraph = $createParagraphNode();
                                    const text = $createTextNode('');
                                    paragraph.append(text);
                                    listNode.insertAfter(paragraph);
                                    paragraph.select();
                                    listNode.remove();
                                    return;
                                }

                                // Создаем новый элемент списка
                                const newListItem = $createListItemNode();
                                const paragraph = $createParagraphNode();
                                const text = $createTextNode('');
                                paragraph.append(text);
                                newListItem.append(paragraph);

                                // Вставляем после текущего
                                listNode.insertAfter(newListItem, !!currentBlock);
                                newListItem.select();
                                return;
                            }
                        }

                        // Обычная логика для BlockNode
                        if (currentBlock instanceof BlockNode) {
                            const newBlock = new BlockNode("paragraph");
                            newBlock.append($createTextNode(""));
                            currentBlock.insertAfter(newBlock);
                            newBlock.select();
                        } else if (currentBlock.getType() === 'paragraph') {
                            // Для стандартных параграфов
                            const newBlock = $createParagraphNode();
                            const text = $createTextNode('');
                            newBlock.append(text);
                            currentBlock.insertAfter(newBlock);
                            newBlock.select();
                        }
                    });

                    return true;
                }
                return false;
            },
            0
        );

        // Backspace → merge или удаление списка
        const removeBackspace = editor.registerCommand(
            KEY_BACKSPACE_COMMAND,
            () => {
                editor.update(() => {
                    const selection = $getSelection();
                    if (!$isRangeSelection(selection)) return;

                    const currentNode = selection.anchor.getNode();
                    const currentBlock = currentNode.getTopLevelElement();

                    if (!currentBlock) return;

                    // Для элементов списка
                    if ($isListItemNode(currentBlock)) {
                        const isEmpty = currentBlock.getChildrenSize() === 0;
                        const listNode = currentBlock.getParent();

                        if (isEmpty && listNode && $isListNode(listNode)) {
                            const siblings = listNode.getChildren();
                            const currentIndex = siblings.findIndex(child => child === currentBlock);
                            const isOnlyItem = siblings.length === 1;

                            if (isOnlyItem) {
                                // Удаляем список и создаем параграф
                                const paragraph = $createParagraphNode();
                                const text = $createTextNode('');
                                paragraph.append(text);
                                listNode.replace(paragraph);
                                paragraph.select();
                            } else if (currentIndex > 0) {
                                // Удаляем текущий элемент, фокус на предыдущий
                                currentBlock.remove();
                                const prevItem = siblings[currentIndex - 1];
                                if (prevItem) {
                                    prevItem.selectEnd();
                                }
                            } else if (siblings.length > 1) {
                                // Удаляем первый элемент, фокус на следующий
                                currentBlock.remove();
                                const nextItem = siblings[1];
                                if (nextItem) {
                                    nextItem.selectStart();
                                }
                            }
                            return;
                        }

                        // Если не пустой, но курсор в начале элемента
                        if (selection.anchor.offset === 0 && selection.focus.offset === 0 && !isEmpty) {
                            const listNode = currentBlock.getParent();
                            if (listNode && $isListNode(listNode)) {
                                const siblings = listNode.getChildren();
                                const currentIndex = siblings.findIndex(child => child === currentBlock);

                                // Если это не первый элемент, переносим контент в предыдущий
                                if (currentIndex > 0) {
                                    const prevItem = siblings[currentIndex - 1];
                                    if (prevItem && $isListItemNode(prevItem)) {
                                        const children = currentBlock.getChildren();
                                        children.forEach(child => {
                                            const clonedChild = child;
                                            prevItem.append(clonedChild);
                                        });
                                        currentBlock.remove();
                                        prevItem.selectEnd();
                                        return;
                                    }
                                }
                            }
                        }
                        return;
                    }

                    // Обычная логика для BlockNode
                    const isEmpty = currentBlock instanceof BlockNode
                        ? currentBlock.getChildrenSize() === 0
                        : currentBlock.getTextContentSize() === 0;

                    const isAtStart = selection.anchor.offset === 0 && selection.focus.offset === 0;

                    if (isEmpty || isAtStart) {
                        const prev = currentBlock.getPreviousSibling();

                        if (prev) {
                            // Переносим все дочерние элементы в предыдущий блок
                            const children = currentBlock.getChildren();
                            children.forEach((child) => {
                                (prev as ElementNode).append(child);
                            });

                            currentBlock.remove();

                            // Выбираем конец предыдущего блока
                            if ($isListItemNode(prev)) {
                                prev.selectEnd();
                            } else {
                                prev.selectEnd();
                            }
                            return;
                        }
                    }
                });

                return false;
            },
            0
        );

        return () => {
            removeEnter();
            removeBackspace();
        };
    }, [editor]);

    return null;
};
