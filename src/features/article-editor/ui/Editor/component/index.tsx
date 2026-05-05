// features/article-editor/ui/Editor/Editor.tsx
import {useCallback, useRef, useState} from 'react';
import { createReactEditorJS } from 'react-editor-js';
import { EDITOR_JS_TOOLS } from '@features/article-editor/ui/EditorToolbar/const';
import { clsx } from 'clsx';
import type {IEditorProps} from "../interface";
import Toolbar from "@features/article-editor/ui/EditorToolbar/component";
import type {OutputData} from "@editorjs/editorjs";

// Создаем React компонент EditorJS
const ReactEditorJS = createReactEditorJS();

export interface TextEditorProps {
    /** Начальные данные редактора */
    initialData?: OutputData;
    /** Callback при сохранении */
    onSave?: (data: OutputData) => Promise<void> | void;
    /** Callback при изменении */
    onChange?: (data: OutputData) => void;
    /** Режим только для чтения */
    readOnly?: boolean;
    /** Плейсхолдер */
    placeholder?: string;
    /** Дополнительные CSS классы */
    className?: string;
    /** Минимальная высота редактора */
    minHeight?: number | string;
}

export const TextEditor: React.FC<IEditorProps> = ({
                                                          initialData,
                                                          onSave,
                                                          onChange,
                                                          readOnly = false,
                                                          placeholder = 'Начните писать...',
                                                          className,
                                                          minHeight = 300,
                                                      }) => {
    const [isSaving, setIsSaving] = useState(false);
    const editorCore = useRef<any>(null);

    // Инициализация редактора
    const handleInitialize = useCallback((instance: any) => {
        editorCore.current = instance;
    }, []);

    // Обработчик сохранения
    const handleSave = useCallback(async () => {
        if (!editorCore.current || !onSave) return;

        try {
            setIsSaving(true);
            const savedData = await editorCore.current.save();
            await onSave(savedData);
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        } finally {
            setIsSaving(false);
        }
    }, [onSave]);

    // Обработчик очистки
    const handleClear = useCallback(async () => {
        if (!editorCore.current) return;

        try {
            await editorCore.current.clear();
            if (onChange) {
                const emptyData = await editorCore.current.save();
                onChange(emptyData);
            }
        } catch (error) {
            console.error('Ошибка при очистке:', error);
        }
    }, [onChange]);

    // Обработчик изменений
    const handleChange = useCallback(async () => {
        if (!editorCore.current || !onChange) return;

        try {
            const data = await editorCore.current.save();
            onChange(data);
        } catch (error) {
            console.error('Ошибка при изменении:', error);
        }
    }, [onChange]);

    // Обработчики Undo/Redo
    const handleUndo = useCallback(() => {
        // EditorJS не имеет встроенного undo/redo
        // Можно реализовать через сохранение истории изменений
        console.warn('Undo требует дополнительной реализации');
    }, []);

    const handleRedo = useCallback(() => {
        console.warn('Redo требует дополнительной реализации');
    }, []);

    return (
        <div className={clsx('flex flex-col border border-gray-200 rounded-lg bg-white', className)}>
            {!readOnly && (
                <Toolbar
                    onSave={handleSave}
                    onClear={handleClear}
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    isSaving={isSaving}
                />
            )}

            <div
                className="p-4 overflow-auto"
                style={{ minHeight }}
            >
                <ReactEditorJS
                    onInitialize={handleInitialize}
                    tools={EDITOR_JS_TOOLS}
                    defaultValue={initialData}
                    readOnly={readOnly}
                    placeholder={placeholder}
                    onChange={handleChange}
                    // Дополнительные настройки
                    autofocus={false}
                    holder="editorjs-container"
                />
            </div>

            {/* Невидимый элемент для holder */}
            <div id="editorjs-container" />
        </div>
    );
};

export default TextEditor;