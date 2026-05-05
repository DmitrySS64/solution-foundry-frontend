import {EBlockType, type IBlock, type IBlockEditorProps, type ITableData} from "@shared/lib/text_editor/interface";
import React, {useCallback, useEffect, useRef, useState} from "react";


const useTextEditor = ({
    initialBlocks = [],
    onChange,
}:IBlockEditorProps) => {
    const [blocks, setBlocks] = useState<IBlock[]>(initialBlocks);
    const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
    const [history, setHistory] = useState<IBlock[][]>([initialBlocks]);
    const [historyStep, setHistoryStep] = useState(0);
    const blockRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

    const focusBlock = (id: string) => {
        setFocusedBlockId(id);

        requestAnimationFrame(() => {
            const el = blockRefs.current[id];
            if (el) {
                el.focus();

                const len = el.value.length;
                el.setSelectionRange(len, len); // курсор в конец
            }
        });
    };

    // Сохранение в историю
    const saveToHistory = useCallback((newBlocks: IBlock[]) => {
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push(newBlocks);
        setHistory(newHistory);
        setHistoryStep(newHistory.length - 1);
    }, [history, historyStep]);

    // Перестановка блоков (для Drag & Drop)
    const rearrangeBlocks = useCallback((newBlocksOrder: IBlock[]) => {
        setBlocks(newBlocksOrder);
        saveToHistory(newBlocksOrder);
    }, [saveToHistory]);

    // Отмена действия
    const undo = useCallback(() => {
        if (historyStep > 0) {
            const newStep = historyStep - 1;
            setHistoryStep(newStep);
            setBlocks(history[newStep].map(block => ({...block})));
            return true;
        }
        return false;
    }, [history, historyStep]);

    // Повтор действия
    const redo = useCallback(() => {
        if (historyStep < history.length - 1) {
            const newStep = historyStep + 1;
            setHistoryStep(newStep);
            setBlocks(history[newStep].map(block => ({...block})));
            return true;
        }
        return false;
    }, [history, historyStep]);

    // Уведомление об изменениях
    useEffect(() => {
        onChange?.(blocks);
    }, [blocks, onChange]);

    // Создание нового блока
    const createBlock = useCallback(( type: IBlock['type'] = EBlockType.paragraph, content: string = '', data?: unknown): IBlock => {
        const blockContent = type === 'divider' ? '--' : content;
        return {
            id: crypto.randomUUID(),
            type,
            content: blockContent,
            items: type === EBlockType.list || type === EBlockType.ol ? [''] : undefined,
            data
        };
    }, []);

    // Добавление блока в конец
    const addBlock = useCallback((type: IBlock['type'], data?: unknown) => {
        const newBlock = createBlock(type, '', data);
        setBlocks(currentBlocks => {
            const newBlocks = [...currentBlocks, newBlock];
            saveToHistory(newBlocks);
            return newBlocks;
        });
        focusBlock(newBlock.id);

    }, [blocks, createBlock, saveToHistory]);


    // Добавление блока после текущего
    const addBlockAfter = useCallback((afterId: string, type?: IBlock['type']) => {
        setBlocks(currentBlocks => {
            const newBlock = createBlock(type || EBlockType.paragraph);
            const index = currentBlocks.findIndex(block => block.id === afterId);

            if (index === -1) return [...currentBlocks, newBlock];

            const newBlocks = [...currentBlocks];
            newBlocks.splice(index + 1, 0, newBlock);
            saveToHistory(newBlocks);

            focusBlock(newBlock.id);

            return newBlocks;
        });
    }, [blocks, createBlock, saveToHistory]);

    // Удаление блока
    const deleteBlock = useCallback((blockId: string) => {
        if (blocks.length <= 1) return false;

        setBlocks(currentBlocks => {
            const index = currentBlocks.findIndex(block => block.id === blockId);
            if (index === -1) return currentBlocks;

            const newBlocks = currentBlocks.filter(block => block.id !== blockId);
            saveToHistory(newBlocks);

            // Фокусируем предыдущий блок после удаления
            if (index > 0) {
                setTimeout(() => {
                    const prevBlock = newBlocks[index - 1];
                    blockRefs.current[prevBlock.id]?.focus();
                }, 0);
            }

            return newBlocks;
        });
    }, [blocks.length, saveToHistory]);

    // Обновление содержимого блока
    const updateBlockContent = useCallback((blockId: string, content: string) => {
        setBlocks(currentBlocks => {
                const newBlocks = currentBlocks.map(block =>
                    block.id === blockId ? {...block, content} : block
                );
                saveToHistory(newBlocks);
                return newBlocks;
            }
        );
    }, [saveToHistory]);

    // Обновление данных блока
    const updateBlockData = useCallback((blockId: string, data: unknown) => {
        setBlocks(currentBlocks => {
            const newBlocks = currentBlocks.map(block =>
                block.id === blockId ? { ...block, data } : block
            );
            saveToHistory(newBlocks);
            return newBlocks;
        });
    }, [saveToHistory]);

    const updateBlockItems = useCallback((blockId: string, items: string[]) => {
        setBlocks(currentBlocks => {
            const newBlocks = currentBlocks.map(block =>
                block.id === blockId ? { ...block, items } : block
            );
            saveToHistory(newBlocks);
            return newBlocks;
        });
    }, [saveToHistory]);

    // Изменение типа блока
    const updateBlockType = useCallback((blockId: string, type: IBlock['type']) => {
        setBlocks(currentBlocks => {
                const newBlock = currentBlocks.map(block =>
                    block.id === blockId ? {...block, type} : block
                )
                saveToHistory(newBlock);
                return newBlock;
            }
        );
    }, [saveToHistory]);

    // Форматирование текста
    const formatText = useCallback((format: string) => {
        if (!focusedBlockId) return;
//
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) return;
//
        const range = selection.getRangeAt(0);
        const span = document.createElement('span');
//
        switch(format) {
            case 'bold':
                span.style.fontWeight = 'bold';
                break;
            case 'italic':
                span.style.fontStyle = 'italic';
                break;
            case 'underline':
                span.style.textDecoration = 'underline';
                break;
        }
//
        range.surroundContents(span);
        // Сохраняем изменения
        updateBlockContent(focusedBlockId, document.getElementById(focusedBlockId)?.innerHTML || '');
//
        return true;
    }, [focusedBlockId, updateBlockContent]);

    // Перемещение блока
    const moveBlock = useCallback((blockId: string, direction: 'up' | 'down') => {
        setBlocks(currentBlocks => {
            const index = currentBlocks.findIndex(block => block.id === blockId);
            if (index === -1) return currentBlocks;

            const newBlocks = [...currentBlocks];

            if (direction === 'up' && index > 0) {
                [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
            } else if (direction === 'down' && index < newBlocks.length - 1) {
                [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
            } else {
                return currentBlocks;
            }

            saveToHistory(newBlocks);
            return newBlocks;
        });
    }, [saveToHistory]);

    // Табличные операции
    const createTableData = useCallback((rows: number = 3, cols: number = 3): ITableData => {
        const content = Array(rows).fill(null).map(() =>
            Array(cols).fill('')
        );
        return { rows, cols, content };
    }, []);

    const addTableBlock = useCallback((rows: number = 3, cols: number = 3) => {
        const tableData = createTableData(rows, cols);
        addBlock(EBlockType.table, tableData);
    }, [createTableData, addBlock]);

    const updateTableCell = useCallback((blockId: string/*, row: number, col: number, content: string*/) => {
        const block = blocks.find(b => b.id === blockId);
        if (!block || block.type !== 'table' || !block.data) return false;

        //const newData = { ...block.data };
        //TODO: Доделать!
        //if (!newData.content[row]) newData.content[row] = [];
        //if (newData.content[row][col] !== undefined) {
        //    newData.content[row][col] = content;
        //    updateBlockData(blockId, newData);
        //    return true;
        //}
        return false;
    }, [blocks, updateBlockData]);

    // Обработка нажатий клавиш
    const handleKeyDown = useCallback((e: React.KeyboardEvent, blockId: string) => {
        const block = blocks.find(b => b.id === blockId);
        if (!block) return;

        // Глобальные горячие клавиши
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'z':
                    e.preventDefault();
                    undo();
                    return;
                case 'y':
                    e.preventDefault();
                    redo();
                    return;
                case 'b':
                    e.preventDefault();
                    formatText('bold');
                    return;
                case 'i':
                    e.preventDefault();
                    formatText('italic');
                    return;
                case 'u':
                    e.preventDefault();
                    formatText('underline');
                    return;
            }
        }

        switch (e.key) {
            case 'Enter':
                if (e.shiftKey || block.type === EBlockType.list || block.type === EBlockType.ol) return; // Shift+Enter - новая строка внутри блока

                e.preventDefault();
                addBlockAfter(blockId);
                break;

            case 'Backspace': {
                const isList = block.type === EBlockType.list || block.type === EBlockType.ol;
                const isEmpty = isList
                    ? (!block.items || (block.items.length === 1 && block.items[0] === ''))
                    : block.content == '';
                if (isEmpty && blocks.length > 1) {
                    e.preventDefault();
                    deleteBlock(blockId);
                }
                break;
            }
            case 'ArrowUp':
                if (e.ctrlKey) {
                    e.preventDefault();
                    moveBlock(blockId, 'up')
                }
                break;

            case 'ArrowDown':
                if (e.ctrlKey) {
                    e.preventDefault();
                    moveBlock(blockId, 'down')
                }
                break;
        }
    }, [blocks, undo, redo, formatText, addBlockAfter, deleteBlock, moveBlock]);

    // Экспорт контента
    const handleExport = useCallback(() => {
        const content = blocks.map(block => ({
            type: block.type,
            content: block.content,
            data: block.data
        }));
        console.log('Экспорт контента:', content);
        alert('Контент экспортирован в консоль разработчика');
        return content
    }, [blocks]);

    // Вспомогательные геттеры
    const canUndo = useCallback(() => historyStep > 0, [historyStep]);
    const canRedo = useCallback(() => historyStep < history.length - 1, [historyStep, history.length]);
    const getBlock = useCallback((blockId: string) => blocks.find(b => b.id === blockId), [blocks]);
    const getFocusedBlock = useCallback(() => blocks.find(b => b.id === focusedBlockId), [blocks, focusedBlockId]);


    return {
        // State
        blocks,
        focusedBlockId,
        history,
        historyStep,

        // Блочные операции
        createBlock,
        addBlock,
        addBlockAfter,
        deleteBlock,
        updateBlockContent,
        updateBlockData,
        updateBlockType,
        updateBlockItems,
        moveBlock,

        //Drag and drop
        rearrangeBlocks,

        // Табличные операции
        createTableData,
        addTableBlock,
        updateTableCell,

        // Форматирование
        formatText,

        // История
        saveToHistory,
        undo,
        redo,
        canUndo: canUndo(),
        canRedo: canRedo(),

        // Обработчики
        handleKeyDown,
        handleExport,

        // Фокусировка
        setFocusedBlockId,
        blockRefs,

        // Геттеры
        getBlock,
        getFocusedBlock
    }
}

export {useTextEditor}