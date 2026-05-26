// modules/diagram/canvas/renderers/hooks/useInlineEdit.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface UseInlineEditOptions {
    initialValue: string;
    isEditable: boolean;
    onSave?: (value: string) => void;
    onCancel?: () => void;
}

export const useInlineEdit = ({
                                  initialValue,
                                  isEditable,
                                  onSave,
                                  onCancel,
                              }: UseInlineEditOptions) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(initialValue);
    const inputRef = useRef<HTMLInputElement>(null);

    // Синхронизация value при изменении initialValue (вне режима редактирования)
    useEffect(() => {
        if (!isEditing) {
            setValue(initialValue);
        }
    }, [initialValue, isEditing]);

    // Автофокус при входе в режим редактирования
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
            inputRef.current?.select();
        }
    }, [isEditing]);

    const startEditing = useCallback(() => {
        if (!isEditable) return;
        setIsEditing(true);
    }, [isEditable]);

    const commitEdit = useCallback(() => {
        setIsEditing(false);
        const trimmed = value.trim();
        if (trimmed !== initialValue.trim()) {
            onSave?.(trimmed);
        }
    }, [value, initialValue, onSave]);

    const cancelEdit = useCallback(() => {
        setIsEditing(false);
        setValue(initialValue);
        onCancel?.();
    }, [initialValue, onCancel]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            commitEdit();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            cancelEdit();
        }
    }, [commitEdit, cancelEdit]);

    return {
        isEditing,
        value,
        setValue,
        inputRef,
        startEditing,
        commitEdit,
        cancelEdit,
        handleKeyDown,
    };
};