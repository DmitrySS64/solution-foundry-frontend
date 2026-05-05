import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { ToolbarPlugin } from "@/features/editor/plugins/ToolbarPlugin";
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';

import { BlockNode } from "../nodes/BlockNode";
import { SlashPlugin } from "@/features/editor/plugins/SlashPlugin";
import { BlockBehaviorPlugin } from "@/features/editor/plugins/BlockBehaviorPlugin";
import { DragPlugin } from "@/features/editor/plugins/DragPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { ListNode, ListItemNode } from "@lexical/list";
import { TableNode, TableRowNode, TableCellNode } from "@lexical/table";

import {ContextMenuPlugin} from "@features/editor/plugins/ContextMenuPlugin.tsx";
import {TableToolbarPlugin} from "@features/editor/plugins/TableToolbarPlugin.tsx";
import {cn} from "@shared/ui/lib/cn";
import {ProjectHeader} from "@shared/ui/project_page/header/component";
import {ToggleReadOnlyButton} from "@entities/editor/hook/ToggleReadOnly.tsx";


const theme = {
    // Базовые стили блоков
    paragraph: 'editor-paragraph',

    heading: {
        h1: 'editor-heading-h1',
        h2: 'editor-heading-h2',
    },

    list: {
        ul: 'editor-list-ul',
        ol: 'editor-list-ol',
        listitem: 'editor-listitem',
        listitemChecked: 'editor-listitem-checked',
        listitemUnchecked: 'editor-listitem-unchecked',
        nested: {
            list: 'editor-nested-list',
            listitem: 'editor-nested-listitem',
        },
    },
    code: 'editor-code',
    quote: 'editor-quote',

    table: 'editor-table',
    tableRow: 'editor-table-row',
    tableCell: 'editor-table-cell',
    tableCellHeader: 'editor-table-cell-header',
};

const config = {
    namespace: "notion-clone",
    nodes: [
        BlockNode,
        HeadingNode,
        QuoteNode,
        CodeNode,
        ListNode,
        ListItemNode,
        TableNode,
        TableRowNode,
        TableCellNode,
    ],
    theme,
    editable: false,
    onError: (e: Error) => { throw e; },
};

export const Editor = () => {
    return (
        <LexicalComposer initialConfig={config}>
            <ProjectHeader>
                <ToggleReadOnlyButton text="Редактировать" />
            </ProjectHeader>
            <ToolbarPlugin />
            <SlashPlugin/>
            <div className={cn("max-w-2xl max-h-[calc(100vh-250px)] overflow-y-auto mx-auto mt-4 py-4 px-10",
                    "bg-white mb-6 rounded rounded-lg border border-border relative")}>
                <RichTextPlugin
                    contentEditable={<ContentEditable className="editor-content-editable"/>}
                    placeholder={<div className={'editor-placeholder'}>Начни писать...</div>}
                    ErrorBoundary={LexicalErrorBoundary}
                />
                <ContextMenuPlugin/>
                <HistoryPlugin/>
                <ListPlugin/>
                <BlockBehaviorPlugin/>
                <TablePlugin />
                <DragPlugin/>
                <TableToolbarPlugin/>
            </div>
        </LexicalComposer>
    );
};