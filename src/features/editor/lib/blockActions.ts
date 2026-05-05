import {
    $getSelection,
    $isRangeSelection,
    $createParagraphNode,
    type LexicalEditor,
    $getRoot,
    $createTextNode
} from "lexical";
import {
    INSERT_UNORDERED_LIST_COMMAND,
    INSERT_ORDERED_LIST_COMMAND,
    $isListNode,
    $isListItemNode,
} from "@lexical/list";
import { $createHeadingNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import type {BlockType} from "@entities/editor/const";

export const setBlockType = (editor: LexicalEditor, type: BlockType) => {
    if (type === 'ul') {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        return;
    }
    if (type === 'ol') {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        return;
    }

    editor.update(() => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) return;

        const block = selection.anchor.getNode().getTopLevelElement();
        if (!block) return;

        if ($isListItemNode(block)) return;

        let newNode;
        switch (type) {
            case "paragraph":
                newNode = $createParagraphNode();
                break;
            case "heading":
                newNode = $createHeadingNode("h1");
                break;
            case "code":
                newNode = $createCodeNode();
                break;
            default:
                newNode = $createParagraphNode();
        }
        block.replace(newNode);
        newNode.select();
    });
};

export const ensureEmptyBlock = (editor: LexicalEditor) => {
    editor.update(() => {
        const root = $getRoot();
        const lastChild = root.getLastChild();

        if (!lastChild || ($isListNode(lastChild) && lastChild.getChildrenSize() === 0)) {
            const paragraph = $createParagraphNode();
            const text = $createTextNode('');
            paragraph.append(text);
            root.append(paragraph);
            paragraph.select();
        }
    });
};