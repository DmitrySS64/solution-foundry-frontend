import React from 'react';
import TextareaAutosize from "react-textarea-autosize";
import type {IBlockProps} from "@shared/lib/text_editor/components/paragraph";

const CodeBlock: React.FC<IBlockProps> = ({
                                                 blockRef,
                                                 block,
                                                 onUpdate,
                                                 onKeyDown
                                             }) => {
    return (
        <TextareaAutosize
            ref={blockRef}
            value={block.content}
            onChange={(e) => onUpdate(e.target.value)}
            className="resize-none whitespace-pre-wrap bg-zinc-900 dark:bg-zinc-950 rounded-lg p-4 font-mono text-sm w-full h-fit outline-none resize-none bg-transparent text-green-400"
            onKeyDown={onKeyDown}
            placeholder={'//Код'}
        />


    );
};

export default CodeBlock;