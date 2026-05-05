import {type FC} from "react";
import type {IBlockProps} from "..";
import {cn} from "@shared/ui/lib/cn";
import TextareaAutosize from 'react-textarea-autosize';


const ParagraphBlock: FC<IBlockProps> = ({
    block,
    onUpdate,
    onKeyDown,
    blockRef
}) => {
    return (
        <TextareaAutosize
            ref={blockRef}
            value={block.content}
            placeholder="Напишите текст..."
            onChange={(e) => onUpdate(e.target.value)}
            onKeyDown={onKeyDown}
            className={cn(
                "resize-none w-full min-h-[1.5em] rounded-md px-3 py-2 outline-none transition"
            )}
        >
            {block.content}
        </TextareaAutosize>
    )
}

export {ParagraphBlock};