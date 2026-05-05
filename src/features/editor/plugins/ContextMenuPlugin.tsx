import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useState } from "react";
import { setBlockType } from "../lib/blockActions";
import {
    INSERT_TABLE_COMMAND,
} from "@lexical/table";

export const ContextMenuPlugin = () => {
    const [editor] = useLexicalComposerContext();
    const [isEditable, setIsEditable] = useState(editor.isEditable());

    useEffect(() => {
        return editor.registerEditableListener((editable) => {
            setIsEditable(editable);
        });
    }, [editor]);

    const [menu, setMenu] = useState<{
        x: number;
        y: number;
        open: boolean;
    }>({ x: 0, y: 0, open: false });

    useEffect(() => {
        const root = editor.getRootElement();
        if (!root) return;

        const handleContext = (e: MouseEvent) => {
            e.preventDefault();

            setMenu({
                x: e.clientX,
                y: e.clientY,
                open: true,
            });
        };

        const close = () => setMenu((m) => ({ ...m, open: false }));

        root.addEventListener("contextmenu", handleContext);
        window.addEventListener("click", close);

        return () => {
            root.removeEventListener("contextmenu", handleContext);
            window.removeEventListener("click", close);
        };
    }, [editor]);

    if (!menu.open || !isEditable) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: menu.y,
                left: menu.x,
                zIndex: 999,
            }}
            className="bg-white border shadow rounded p-2 w-48"
        >
            <Item onClick={() => setBlockType(editor, "paragraph")}>Text</Item>
            <Item onClick={() => setBlockType(editor, "heading")}>Heading</Item>
            <Item onClick={() => setBlockType(editor, "code")}>Code</Item>
            <Item
                onClick={() => editor.dispatchCommand(INSERT_TABLE_COMMAND, { columns: '3', rows: '3' })}
            >
                Таблица
            </Item>
            <div className="border-t my-1" />

            <Item onClick={() => setBlockType(editor, "ul")}>Bullet List</Item>
            <Item onClick={() => setBlockType(editor, "ol")}>Numbered List</Item>
        </div>
    );
};

const Item = ({ children, onClick }: any) => (
    <div
        onClick={onClick}
        className="p-1 cursor-pointer hover:bg-gray-100 rounded"
    >
        {children}
    </div>
);