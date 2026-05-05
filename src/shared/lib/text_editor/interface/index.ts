import type {IToolbarItem} from "@shared/lib/text_editor/toolbar/interface";

export enum EBlockType {
    paragraph = 'p',
    heading = 'h1',
    heading2 = 'h2',
    list = 'list',
    ol = 'ol',
    code = 'code',
    quote = 'quote',
    divider = 'divider',
    table = 'table'
}

interface IBlock {
    id: string;
    type: EBlockType;
    content: string;
    items?: string[];
    tableData?: string[][];
    data?: unknown;
}

interface IBlockEditorProps {
    initialBlocks?: IBlock[];
    onChange?: (blocks: IBlock[]) => void;
    toolbarItems?: IToolbarItem[];
}

interface IDraggableBlockProps {
    block: IBlock;
    index: number;
    moveBlock: (dragIndex: number, hoverIndex: number) => void;
    updateBlock: (id: string, content: string, items?: string[]) => void;
    deleteBlock: (id: string) => void;
    addBlockAfter: (index: number, type: EBlockType) => void;
    onKeyDown: (e: KeyboardEvent, index: number) => void;
}

interface ITableData {
    rows: number;
    cols: number;
    content: string[][];
}

export type {IBlock, IBlockEditorProps, IDraggableBlockProps, ITableData}