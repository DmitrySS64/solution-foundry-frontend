import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {useCallback, useEffect, useState} from "react";
import {
    INDENT_CONTENT_COMMAND,
    OUTDENT_CONTENT_COMMAND,
    FORMAT_TEXT_COMMAND,
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    $createTextNode
} from "lexical";
import {IconButton} from "@shared/ui/form/icon_button";
import {ICON_PATHS} from "@shared/enum/icons";
import { TableToolbarPlugin } from "./TableToolbarPlugin";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import { $createQuoteNode } from "@lexical/rich-text";
import {
    $createListNode,
    $createListItemNode,
} from "@lexical/list";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import {
    $getTableCellNodeFromLexicalNode,
} from "@lexical/table";


type ToolbarBlockType =  'paragraph' | 'h1' | 'h2' | 'h3' | 'ul' | 'ol' | 'quote' | 'code' | 'table';

export const ToolbarPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const [isInTable, setIsInTable] = useState(false);
    const [, setCurrentBlockType] = useState<ToolbarBlockType>('paragraph');
    const [isEditable, setIsEditable] = useState(editor.isEditable());

    useEffect(() => {
        return editor.registerEditableListener((editable) => {
            setIsEditable(editable);
        });
    }, [editor]);

    const [formats, setFormats] = useState({
        bold: false,
        italic: false,
        underline: false,
        code: false,
    });

    // Определение текущего типа блока
    const updateCurrentBlockType = useCallback(() => {
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const node = selection.anchor.getNode();
                const topLevelElement = node.getTopLevelElement();

                if (!topLevelElement) return;

                const nodeType = topLevelElement.getType();

                switch (nodeType) {
                    case 'heading':
                    {
                        const headingTag = (topLevelElement as any).getTag?.();
                        if (headingTag === 'h1') setCurrentBlockType('h1');
                        else if (headingTag === 'h2') setCurrentBlockType('h2');
                        else setCurrentBlockType('paragraph');
                        break;
                    }
                    case 'code':
                        setCurrentBlockType('code');
                        break;
                    case 'quote':
                        setCurrentBlockType('quote');
                        break;
                    case 'list': {
                        const listType = (topLevelElement as any).getListType?.();
                        setCurrentBlockType(listType === 'number' ? 'ol' : 'ul');
                        break;
                    }
                    case 'table':
                        setCurrentBlockType('table');
                        break;
                    default:
                        setCurrentBlockType('paragraph');
                }
            }
        });
    }, [editor]);

    // Проверка нахождения в таблице и форматирование
    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                    const cellNode = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                    setIsInTable(!!cellNode);

                    setFormats({
                        bold: selection.hasFormat("bold"),
                        italic: selection.hasFormat("italic"),
                        underline: selection.hasFormat("underline"),
                        code: selection.hasFormat("code"),
                    });
                } else {
                    setIsInTable(false);
                }
            });
            updateCurrentBlockType();
        });
    }, [editor]);

    if (!isEditable) return;

    const applyFormat = (type: "bold" | "italic" | "underline" | "code") => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, type);
    };

    // Создание блока
    const createBlock = (type: ToolbarBlockType) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const currentBlock = selection.anchor.getNode().getTopLevelElement();
            if (!currentBlock) return;

            let newBlock;
            const text = selection.anchor.getNode().getTextContent();

            switch (type) {
                case 'h1':
                    newBlock = $createHeadingNode('h1');
                    break;
                case 'h2':
                    newBlock = $createHeadingNode('h2');
                    break;
                case 'h3':
                    newBlock = $createHeadingNode('h3');
                    break;
                case 'quote':
                    newBlock = $createQuoteNode();
                    break;
                case 'code':
                    newBlock = $createCodeNode();
                    break;
                case 'ul': {
                    newBlock = $createListNode('bullet');
                    const listItem = $createListItemNode();
                    const paragraph = $createParagraphNode();
                    paragraph.append($createTextNode(''));
                    listItem.append(paragraph);
                    newBlock.append(listItem);
                    break;
                }
                case 'ol': {
                    newBlock = $createListNode('number');
                    const olListItem = $createListItemNode();
                    const olParagraph = $createParagraphNode();
                    olParagraph.append($createTextNode(''));
                    olListItem.append(olParagraph);
                    newBlock.append(olListItem);
                    break;
                }
                case 'table':
                    // Таблицу лучше вставлять через команду
                    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
                        columns: '3',
                        rows: '3',
                        includeHeaders: true,
                    });
                    return;
                default:
                    newBlock = $createParagraphNode();
            }

            if (newBlock) {
                // Сохраняем текст, если он был
                if (text && type !== 'ul' && type !== 'ol') {
                    const textNode = $createTextNode(text);
                    newBlock.append(textNode);
                }
                currentBlock.replace(newBlock);
                newBlock.selectEnd();
            }
        });
    };

    // Вставка таблицы
    const insertTable = () => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: '3',
            rows: '3',
            includeHeaders: true,
        });
    };

    // Функции для обработки нажатий кнопок
    const handleIndent = () => {
        editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined);
    };

    const handleOutdent = () => {
        editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined);
    };


    return (
        <div className="flex gap-2 mb-4 p-2 border border-border bg-white shadow-sm">
            {/* Группа форматирования текста */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-gray-200">
                <IconButton
                    path={ICON_PATHS.FORMAT_BOLD}
                    padding
                    onClick={() => applyFormat("bold")}
                    active={formats.bold}
                />
                <IconButton
                    path={ICON_PATHS.FORMAT_ITALIC}
                    padding
                    onClick={() => applyFormat("italic")}
                    active={formats.italic}
                />
                <IconButton
                    path={ICON_PATHS.FORMAT_UNDERLINE}
                    padding
                    active={formats.underline}
                    onClick={() => applyFormat("underline")}
                />
                <IconButton
                    path={ICON_PATHS.FORMAT_CODE}
                    padding
                    active={formats.code}
                    onClick={() => applyFormat("code")}
                />
            </div>


            {/* Группа заголовков */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-gray-200">
                <IconButton
                    path={ICON_PATHS.FORMAT_HEADER_1}
                    padding
                    onClick={() => createBlock("h1")}
                />
                <IconButton
                    path={ICON_PATHS.FORMAT_HEADER_2}
                    padding
                    onClick={() => createBlock("h2")}
                />
                <IconButton
                    path={ICON_PATHS.FORMAT_HEADER_3}
                    padding
                    onClick={() => createBlock("h3")}
                />
                <IconButton
                    path={ICON_PATHS.FORMAT_PARAGRAPH}
                    padding
                    onClick={() => createBlock("paragraph")}
                />
            </div>
            {/* Группа списков */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-gray-200">
                <IconButton
                    path={ICON_PATHS.FORMAT_LIST_UNNUMBERED}
                    padding
                    onClick={() => createBlock("ul")}
                    title="Маркированный список"
                />
                <IconButton
                    path={ICON_PATHS.FORMAT_LIST_NUMBERED}
                    padding
                    onClick={() => createBlock("ol")}
                    title="Нумерованный список"
                />
                <IconButton
                    path={ICON_PATHS.FORMAT_ALIGN_LEFT}
                    padding
                    onClick={handleOutdent}
                    title="Уменьшить отступ"
                />
                <IconButton
                    path={ICON_PATHS.FORMAT_ALIGN_RIGHT}
                    padding
                    onClick={handleIndent}
                    title="Увеличить отступ"
                />
            </div>

            {/* Группа блоков */}
            <div className="flex items-center gap-0.5 pr-2 border-r border-gray-200">
                <IconButton
                    path={ICON_PATHS.FORMAT_QUOTE}
                    padding
                    onClick={() => createBlock("quote")}
                    title="Цитата"
                />
                <IconButton
                    path={ICON_PATHS.FORMAT_CODE}
                    padding
                    onClick={() => createBlock("code")}
                    title="Блок кода"
                />
                <IconButton
                    path={ICON_PATHS.FORMAT_TABLE}
                    padding
                    onClick={insertTable}
                    title="Таблица 3x3"
                />
            </div>

            {isInTable && (
                <div className="ml-auto bg-blue-50 px-2 py-1 rounded">
                    <TableToolbarPlugin/>
                </div>
            )}
        </div>
    );
};