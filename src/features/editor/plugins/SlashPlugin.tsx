// features/editor/plugins/SlashPlugin.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { $getSelection, $isRangeSelection, $createParagraphNode } from "lexical";
import { $createHeadingNode } from "@lexical/rich-text";
import {
    INSERT_TABLE_COMMAND,
} from "@lexical/table";

export const SlashPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        return editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                const selection = $getSelection();

                if ($isRangeSelection(selection)) {
                    const anchor = selection.anchor;
                    const text = anchor.getNode().getTextContent().slice(0, anchor.offset);

                    if (text.endsWith("/")) {
                        setOpen(true);
                    } else {
                        setOpen(false);
                    }
                }
            });
        });
    }, [editor]);

    const apply = (type: string) => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const block = selection.anchor.getNode().getTopLevelElement();

            let newNode;

            switch (type) {
                case "heading":
                    newNode = $createHeadingNode("h1");
                    break;
                default:
                    newNode = $createParagraphNode();
            }

            block?.replace(newNode);
            newNode.select();
        });

        setOpen(false);
    };

    const handleInsertTable = () => {
        editor.dispatchCommand(INSERT_TABLE_COMMAND, {
            columns: '3',
            rows: '3',
            includeHeaders: { rows: true, columns: false },
        });
        setOpen(false);
    };



    if (!open) return null;

    return (
        <div className="absolute mt-2 ms-20  bg-white shadow rounded border border-border">
            <div onClick={() => apply("heading")} className="cursor-pointer p-2 px-4 hover:bg-gray-100">
                Заголовок
            </div>
            <div onClick={() => apply("paragraph")} className="cursor-pointer p-2 px-4 hover:bg-gray-100">
                Текст
            </div>
            <div
                onClick={handleInsertTable}
                className="cursor-pointer p-2 px-4 hover:bg-gray-100 rounded"
            >
                Таблица 3x3
            </div>
        </div>
    );
};