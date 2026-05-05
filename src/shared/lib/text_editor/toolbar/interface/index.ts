import type {IBlock} from "@shared/lib/text_editor/interface";

interface IToolbarItem {
    id: string;
    type: 'block' | 'format' | 'action' | 'divider';
    itemType?: 'button'|'select';
    label?: string;
    title?: string;
    icon?: string;
    action?: string;
    blockType?: IBlock['type'];
    children?: IToolbarItem[];
    size?: 'small' | 'medium' | 'large';
}

interface IToolbarProps {
    items: IToolbarItem[];
    onAction: (item: IToolbarItem) => void;
    canUndo: boolean;
    canRedo: boolean;
}

export type {IToolbarItem, IToolbarProps}