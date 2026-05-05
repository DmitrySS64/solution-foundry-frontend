import type {IBlock} from "@shared/lib/text_editor/interface";
import React from "react";

interface IBlockProps {
    block: IBlock;
    onUpdate: (content: string) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    blockRef?: (el: HTMLTextAreaElement | null) => void;
}

export type {IBlockProps};