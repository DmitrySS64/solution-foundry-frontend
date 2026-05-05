import React from 'react';
import type {IBlockProps} from "@shared/lib/text_editor/components/paragraph";
import TextareaAutosize from "react-textarea-autosize";
import {cn} from "@shared/ui/lib/cn";

const HeadingBlock: React.FC<IBlockProps> = ({
                                                       block,
                                                       onUpdate,
                                                       onKeyDown, blockRef
                                                   }) => {
    return (
        <TextareaAutosize
            ref={blockRef}
            value={block.content}
            placeholder="Напишите текст..."
            onChange={(e) => onUpdate(e.target.value)}
            onKeyDown={onKeyDown}
            className={cn(
                "resize-none w-full min-h-[1.5em] rounded-md px-3 py-2 outline-none transition text-2xl font-bold"
            )}
        >
            {block.content}
        </TextareaAutosize>
    );
};

export default HeadingBlock;