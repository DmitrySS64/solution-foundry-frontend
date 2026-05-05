// features/editor/plugins/DragPlugin.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export const DragPlugin = () => {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        const root = editor.getRootElement();
        if (!root) return;

        let dragged: HTMLElement | null = null;

        root.addEventListener("dragstart", (e) => {
            dragged = e.target as HTMLElement;
        });

        root.addEventListener("drop", (e) => {
            e.preventDefault();
            const target = e.target as HTMLElement;

            if (dragged && target && dragged !== target) {
                //target.before(dragged);
            }
        });

        return () => {};
    }, [editor]);

    return null;
};