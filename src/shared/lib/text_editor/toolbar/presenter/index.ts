import type {IToolbarItem} from "@shared/lib/text_editor/toolbar/interface";
import {useCallback} from 'react';
import type {useTextEditor} from "@shared/lib/text_editor/presenter";
import {defaultToolbarItems} from "../const";
import {EBlockType} from "@shared/lib/text_editor/interface";


const useToolbar = (
    editor: ReturnType<typeof useTextEditor>,
    customItems?: IToolbarItem[]
) => {
    const items = customItems || defaultToolbarItems;

    const handleToolbarAction = useCallback((item: IToolbarItem) => {
        switch (item.type) {
            case 'block':
                if (item.blockType) {
                    if (item.blockType === 'table') {
                        editor.addTableBlock(3, 3);
                    } else {
                        editor.addBlock(item.blockType);
                    }
                }
                break;

            case 'format':
                if (item.action) {
                    editor.formatText(item.action);
                }
                break;

            case 'action':
                if (item.action) {
                    switch (item.action) {
                        case 'undo':
                            editor.undo();
                            break;
                        case 'redo':
                            editor.redo();
                            break;
                        case 'export': {
                            const content = editor.handleExport();
                            console.log('Экспорт:', content);
                            alert('Контент экспортирован в консоль');
                            break;
                        }
                        case 'clear':
                            if (window.confirm('Очистить весь документ?')) {
                                editor.addBlock(EBlockType.paragraph);
                            }
                            break;
                        case 'duplicate': {
                            // Реализация дублирования текущего блока
                            const focusedBlock = editor.getFocusedBlock();
                            if (focusedBlock) {
                                editor.addBlock(focusedBlock.type, focusedBlock.data);
                            }
                            break;
                        }
                    }
                }
                break;
        }
    }, [editor]);

    return {
        items,
        handleToolbarAction
    };
};

export { useToolbar, defaultToolbarItems };