// plugins/TableToolbarPlugin.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import {
    $getTableCellNodeFromLexicalNode,
    //$insertTableRowAtSelection,
    //$insertTableColumnAtSelection,
    //$deleteTableRowAtSelection,
    //$deleteTableColumnAtSelection,
} from "@lexical/table";
import {Button} from "@shared/ui/form/button";

export const TableToolbarPlugin = () => {
    const [editor] = useLexicalComposerContext();

    const isInTable = (): boolean => {
        let result = false;
        editor.getEditorState().read(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
                const cellNode = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
                result = !!cellNode;
            }
        });
        return result;
    };

    const handleAddRow = () => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const cellNode = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
            if (!cellNode) return;

            // Вставляем строку после текущей
            //$insertTableRowAtSelection(true);
        });
    };

    const handleAddColumn = () => {
        editor.update(() => {
            const selection = $getSelection();
            if (!$isRangeSelection(selection)) return;

            const cellNode = $getTableCellNodeFromLexicalNode(selection.anchor.getNode());
            if (!cellNode) return;

            // Вставляем колонку после текущей
            //$insertTableColumnAtSelection(true);
        });
    };

    const handleDeleteRow = () => {
        editor.update(() => {
            //$deleteTableRowAtSelection();
        });
    };

    const handleDeleteColumn = () => {
        editor.update(() => {
            //$deleteTableColumnAtSelection();
        });
    };

    if (!isInTable()) return null;

    return (
        <div className="flex gap-2">
            <Button
                onClick={handleAddRow}
                size={'small'}
                decoration={'ghost'}
                title="Добавить строку"
            >
                + Строка
            </Button>
            <Button
                onClick={handleAddColumn}
                size={'small'}
                decoration={'ghost'}
                title="Добавить колонку"
            >
                + Колонка
            </Button>
            <Button
                onClick={handleDeleteRow}
                intent={'destructive'}
                size={'small'}
                decoration={'ghost'}
                title="Удалить строку"
            >
                - Строка
            </Button>
            <Button
                onClick={handleDeleteColumn}
                intent={'destructive'}
                size={'small'}
                decoration={'ghost'}
                title="Удалить колонку"
            >
                - Колонка
            </Button>
        </div>
    );
};