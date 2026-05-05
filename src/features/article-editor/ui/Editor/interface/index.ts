import type { OutputData } from '@editorjs/editorjs';

interface IEditorProps {

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

    onAutoSave?: (data: OutputData) => void;
}

export type {IEditorProps}