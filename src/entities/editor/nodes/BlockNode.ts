import {
    ElementNode,
    type SerializedElementNode, type Spread,
} from "lexical";
import type { BlockType } from "../const";


export type SerializedBlockNode = Spread<
    {
        blockType: BlockType;
    },
    SerializedElementNode
>;

export class BlockNode extends ElementNode {
    __blockType: BlockType;

    static getType() {
        return "block";
    }

    static clone(node: BlockNode) {
        return new BlockNode(node.__blockType, node.__key);
    }

    constructor(type: BlockType = "paragraph", key?: string) {
        super(key);
        this.__blockType = type;
    }

    createDOM(): HTMLElement {
        let el: HTMLElement;

        switch (this.__blockType) {
            case "heading":
                el = document.createElement("h1");
                break;
            case "code":
                el = document.createElement("pre");
                el.style.whiteSpace = "pre-wrap";
                el.style.backgroundColor = '#111';
                el.style.color = "#0f0"
                break;
            default:
                el = document.createElement("div");
        }

        el.className = "block outline-none";
        return el;
    }

    updateDOM(prevNode: BlockNode): boolean {
        // если тип поменялся → перерисовать
        return prevNode.__blockType !== this.__blockType;
    }

    // 👇 Разрешаем только inline контент внутри
    canBeEmpty(): boolean {
        return true;
    }

    isInline(): boolean {
        return false;
    }

    // 👇 Запрещаем вложенные block'и
    canInsertTextBefore(): boolean {
        return true;
    }

    canInsertTextAfter(): boolean {
        return true;
    }

    // ---------- serialization ----------
    exportJSON(): SerializedBlockNode {
        return {
            ...super.exportJSON(),
            type: "block",
            blockType: this.__blockType,
            version: 1,
        };
    }

    static importJSON(serialized: SerializedBlockNode): BlockNode {
        return new BlockNode(serialized.blockType);
    }

    // ---------- helpers ----------

    setType(type: BlockType) {
        const writable = this.getWritable();
        writable.__blockType = type;
    }

    getType(): BlockType {
        return this.__blockType;
    }
}