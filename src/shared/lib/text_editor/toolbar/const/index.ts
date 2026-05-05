import type {IToolbarItem} from "@shared/lib/text_editor/toolbar/interface";
import {ICON_PATHS} from "@shared/enum/icons";
import {EBlockType} from "@shared/lib/text_editor/interface";

const defaultToolbarItems: IToolbarItem[] = [
    { id: 'undo', type: 'action', itemType: 'button', title: 'Отменить', action: 'undo', icon: ICON_PATHS.UNDO, size: 'small' },
    { id: 'redo', type: 'action', itemType: 'button', title: 'Повторить', action: 'redo', icon: ICON_PATHS.REDO, size: 'small' },
    { id: 'divider1', type: 'divider', label: '' },
    //{
    //    id: 'blocks',
    //    type: 'block',
    //    label: 'Добавить',
    //    icon: '📝',
    //    children: [
            { id: 'paragraph', type: 'block', itemType: 'button', label: 'Текст', blockType: EBlockType.paragraph, icon: ICON_PATHS.FORMAT_PARAGRAPH },
            { id: 'heading', type: 'block', itemType: 'button', label: 'Заголовок', blockType: EBlockType.heading, icon: ICON_PATHS.FORMAT_HEADER_1 },
            { id: 'list', type: 'block', itemType: 'button', label: 'Список', blockType: EBlockType.list, icon: ICON_PATHS.FORMAT_LIST_UNNUMBERED },
            { id: 'ol', type: 'block', itemType: 'button', label: 'Список нумерованный', blockType: EBlockType.ol, icon: ICON_PATHS.FORMAT_LIST_NUMBERED },
            { id: 'code', type: 'block', itemType: 'button', label: 'Код', blockType: EBlockType.code, icon: ICON_PATHS.FORMAT_CODE },
            { id: 'quote', type: 'block', itemType: 'button', label: 'Цитата', blockType: EBlockType.quote, icon: ICON_PATHS.FORMAT_QUOTE },
            { id: 'table', type: 'block', itemType: 'button', label: 'Таблица', blockType: EBlockType.table, icon: ICON_PATHS.FORMAT_TABLE },
            { id: 'divider-block', type: 'block', itemType: 'button', label: 'Разделитель', blockType: EBlockType.divider, icon: ICON_PATHS.FORMAT_DIVIDER },
    //    ]
    //},
    { id: 'divider2', type: 'divider'},
    { id: 'bold', type: 'format', itemType: 'button', label: 'Жирный', action: 'bold', icon: ICON_PATHS.FORMAT_BOLD },
    { id: 'italic', type: 'format', itemType: 'button', label: 'Курсив', action: 'italic', icon: ICON_PATHS.FORMAT_ITALIC },
    { id: 'underline', type: 'format', itemType: 'button', label: 'Подчеркивание', action: 'underline', icon: ICON_PATHS.FORMAT_UNDERLINE },

    //{ id: 'divider3', type: 'divider', label: '' },
    //{
    //    id: 'actions',
    //    type: 'action',
    //    label: 'Действия',
    //    icon: '⚙️',
    //    children: [
    //        { id: 'export', type: 'action', label: 'Экспорт', action: 'export', icon: '📤' },
    //        { id: 'clear', type: 'action', label: 'Очистить', action: 'clear', icon: '🗑️' },
    //        { id: 'duplicate', type: 'action', label: 'Дублировать', action: 'duplicate', icon: '⎘' }
    //    ]
    //}
];

export {defaultToolbarItems}