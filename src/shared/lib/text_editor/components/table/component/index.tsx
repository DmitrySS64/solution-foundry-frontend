import React from 'react';
import type { IBlock, ITableData } from '@shared/lib/text_editor/interface';

interface ITableBlockProps {
    block: IBlock;
    isFocused: boolean;
    onUpdate: (data: ITableData) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
}

const TableBlock: React.FC<ITableBlockProps> = ({
                                                   block,
                                                   isFocused,
                                                   onUpdate,
                                                   //onKeyDown
                                               }) => {
    const tableData = block.data as ITableData || { rows: 3, cols: 3, content: [] };

    // Инициализация content если его нет
    if (!tableData.content || tableData.content.length === 0) {
        tableData.content = Array(tableData.rows).fill(null).map(() =>
            Array(tableData.cols).fill('')
        );
    }

    const handleCellChange = (row: number, col: number, value: string) => {
        const newData = { ...tableData };
        if (!newData.content[row]) newData.content[row] = [];
        newData.content[row][col] = value;
        onUpdate(newData);
    };

    const addRow = () => {
        const newData = { ...tableData };
        newData.rows += 1;
        newData.content.push(Array(tableData.cols).fill(''));
        onUpdate(newData);
    };

    const addColumn = () => {
        const newData = { ...tableData };
        newData.cols += 1;
        newData.content.forEach(row => row.push(''));
        onUpdate(newData);
    };

    const removeRow = () => {
        if (tableData.rows <= 1) return;
        const newData = { ...tableData };
        newData.rows -= 1;
        newData.content.pop();
        onUpdate(newData);
    };

    const removeColumn = () => {
        if (tableData.cols <= 1) return;
        const newData = { ...tableData };
        newData.cols -= 1;
        newData.content.forEach(row => row.pop());
        onUpdate(newData);
    };

    return (
        <div style={{
            border: isFocused ? '2px solid #007bff' : '1px solid #ddd',
            borderRadius: '6px',
            padding: '12px',
            backgroundColor: isFocused ? '#f8f9fa' : 'white',
            transition: 'all 0.2s ease',
            color: 'black'
        }}>
            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginBottom: isFocused ? '12px' : '0'
            }}>
                <tbody>
                {Array.from({ length: tableData.rows }).map((_, rowIndex) => (
                    <tr key={rowIndex}>
                        {Array.from({ length: tableData.cols }).map((_, colIndex) => (
                            <td key={colIndex} style={{
                                border: '1px solid #ddd',
                                padding: '8px',
                                backgroundColor: 'white',
                                minWidth: '80px',
                                color: 'black',
                            }}>
                                <input
                                    type="text"
                                    value={tableData.content[rowIndex]?.[colIndex] || ''}
                                    onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        width: '100%',
                                        background: 'transparent',
                                        fontSize: '14px',
                                        color: 'black',
                                    }}
                                    placeholder="..."
                                />
                            </td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>


            <div
                className={'hover:hidden'}
                style={{
                display: 'flex',
                gap: '8px',
                flexWrap: 'wrap',
                padding: '8px',
                backgroundColor: '#f8f9fa',
                borderRadius: '4px',
                border: '1px solid #e9ecef'
            }}>
                <button
                    onClick={addRow}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #28a745',
                        borderRadius: '4px',
                        background: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#28a745'
                    }}
                >
                    + Строка
                </button>
                <button
                    onClick={addColumn}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #28a745',
                        borderRadius: '4px',
                        background: 'white',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: '#28a745'
                    }}
                >
                    + Колонка
                </button>
                <button
                    onClick={removeRow}
                    disabled={tableData.rows <= 1}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #dc3545',
                        borderRadius: '4px',
                        background: tableData.rows <= 1 ? '#f8f9fa' : 'white',
                        cursor: tableData.rows <= 1 ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        color: tableData.rows <= 1 ? '#6c757d' : '#dc3545'
                    }}
                >
                    - Строка
                </button>
                <button
                    onClick={removeColumn}
                    disabled={tableData.cols <= 1}
                    style={{
                        padding: '6px 12px',
                        border: '1px solid #dc3545',
                        borderRadius: '4px',
                        background: tableData.cols <= 1 ? '#f8f9fa' : 'white',
                        cursor: tableData.cols <= 1 ? 'not-allowed' : 'pointer',
                        fontSize: '12px',
                        color: tableData.cols <= 1 ? '#6c757d' : '#dc3545'
                    }}
                >
                    - Колонка
                </button>
            </div>

        </div>
    );
};

export default TableBlock;