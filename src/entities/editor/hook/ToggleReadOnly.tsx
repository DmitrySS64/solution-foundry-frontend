import { Button } from '@/shared/ui/form/button';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {useCallback, useEffect, useState} from "react";

interface ToggleReadOnlyButtonProps {
    children?: (isEditable: boolean, toggle: () => void) => React.ReactNode;
    text?: string;
}

const ToggleReadOnlyButton = ({ children, text = "Редактировать" }: ToggleReadOnlyButtonProps) => {
    const [editor] = useLexicalComposerContext();
    const [isEditable, setIsEditable] = useState(editor.isEditable());

    useEffect(() => {
        return editor.registerEditableListener((editable) => {
            setIsEditable(editable);
        });
    }, [editor]);

    const toggleReadOnly = useCallback(() => {
        const _isEditable = editor.isEditable();
        editor.setEditable(!_isEditable);
    }, []);

    if (children) {
        return <>{children(isEditable, toggleReadOnly)}</>;
    }

    return (
        <Button size={'small'} onClick={toggleReadOnly}>
            {isEditable ? "Только чтение" : text}
        </Button>
    );
};
export {ToggleReadOnlyButton};