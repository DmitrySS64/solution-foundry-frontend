import React, { useRef } from 'react';
import {EBlockType, type IBlock} from "@shared/lib/text_editor/interface";
import TextareaAutosize from "react-textarea-autosize";

interface ListBlockProps {
    block: IBlock;
    isFocused: boolean;
    onUpdate: (content: string, items?: string[]) => void;
    onKeyDown: (e: React.KeyboardEvent, blockId: string) => void;
    delBlock: () => void;
}

const ListBlock: React.FC<ListBlockProps> = ({
                                                 block,
                                                 onUpdate,
                                                 delBlock
                                             }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const items = block.items || [''];
    const isOrdered = block.type ===  EBlockType.ol;

    const handleItemChange = (index: number, value: string) => {
        const newItems = [...items];
        newItems[index] = value;
        onUpdate(block.content, newItems);
    };

    const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
        const item = items[index];
        switch (e.key) {
            case 'Enter':
                {
                    if (e.shiftKey) break;
                    e.preventDefault();
                    const newItems = [...items];
                    newItems.splice(index + 1, 0, '');
                    onUpdate(block.content, newItems);

                    // Фокусируем новый элемент
                    setTimeout(() => {
                        const inputs = containerRef.current?.querySelectorAll('textarea');
                        if (inputs && inputs[index + 1]) {
                            inputs[index + 1].focus();
                        }
                    }, 0);
                    break;
                }
            case 'Backspace':
                // Удаляем только если элемент пустой и это не последний элемент
                if (item === '' && items.length > 1) {
                    e.preventDefault();
                    const newItems = [...items];
                    newItems.splice(index, 1);
                    onUpdate(block.content, newItems);

                    // Фокусируем предыдущий элемент
                    setTimeout(() => {
                        const inputs = containerRef.current?.querySelectorAll('textarea');
                        if (inputs && index > 0 && inputs[index - 1]) {
                            inputs[index - 1].focus();
                        } else if (inputs && inputs[0]) {
                            inputs[0].focus();
                        }
                    }, 0);
                }
                else if (item === '' && items.length == 1) delBlock()
                break;

            case 'ArrowUp':
                if (index > 0 && e.ctrlKey) {
                    e.preventDefault();
                    // Перемещение элемента вверх (опционально)
                    const movedItems = [...items];
                    [movedItems[index - 1], movedItems[index]] = [movedItems[index], movedItems[index - 1]];
                    onUpdate(block.content, movedItems);

                    setTimeout(() => {
                        const inputs = containerRef.current?.querySelectorAll('textarea');
                        if (inputs && inputs[index - 1]) {
                            inputs[index - 1].focus();
                        }
                    }, 0);
                }
                break;

            case 'ArrowDown':
                if (index < items.length - 1 && e.ctrlKey) {
                    e.preventDefault();
                    // Перемещение элемента вниз
                    const movedItems = [...items];
                    [movedItems[index], movedItems[index + 1]] = [movedItems[index + 1], movedItems[index]];
                    onUpdate(block.content, movedItems);

                    setTimeout(() => {
                        const inputs = containerRef.current?.querySelectorAll('textarea');
                        if (inputs && inputs[index + 1]) {
                            inputs[index + 1].focus();
                        }
                    }, 0);
                }
                break;
        }
    };

    return (
        <div
            ref={containerRef}
            className={`${isOrdered ? 'list-decimal' : 'list-disc'} my-2 pl-6`}
        >
            {items.map((item, index) => (
                <div key={index} className="mb-1">
                    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                        {/* Маркер списка */}
                        <span className="mt-2 mr-2 w-5 select-none text-sm text-gray-500">
                            {isOrdered ? `${index + 1}.` : "•"}
                        </span>

                        <TextareaAutosize
                            value={item}
                            onChange={(e) => handleItemChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            placeholder="Элемент списка"
                            className="resize-none w-full bg-transparent px-1 py-2 text-sm outline-none"
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ListBlock;