import type {IToolbarItem, IToolbarProps} from "@shared/lib/text_editor/toolbar/interface";
import {type FC, useState} from "react";
import {Button} from "@shared/ui/form/button";
import {IconButton} from "@shared/ui/form/icon_button";

const Toolbar: FC<IToolbarProps> = ({
    items,
    onAction,
    canUndo,
    canRedo,
}) => {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const handleItemClick = (item: IToolbarItem) => {
        // Для элементов с детьми просто открываем/закрываем меню
        if (item.children && item.children.length > 0) {
            setActiveMenu(activeMenu === item.id ? null : item.id);
        } else {
            // Для обычных элементов выполняем действие
            onAction(item);
            setActiveMenu(null);
        }
    };

    const renderMenuItem = (item: IToolbarItem, isChild: boolean = false) => {
        if (item.type === 'divider') {
            return (
                <div
                    key={item.id}
                    style={{
                        width: '1px',
                        backgroundColor: '#ccc',
                        margin: '0 8px',
                        height: '24px',
                        alignSelf: 'center'
                    }}
                />
            );
        }

        if (item.itemType === 'button'){
            return (
                <IconButton path={item.icon}
                            onClick={() => handleItemClick(item)}
                            disabled={(item.action === 'undo' && !canUndo) || (item.action === 'redo' && !canRedo)}
                            title={item.title ?? item.label}
                />
            )
        }


        return (
            <div key={item.id} style={{ position: 'relative' }}>
                <Button
                    onClick={() => handleItemClick(item)}
                    disabled={(item.action === 'undo' && !canUndo) || (item.action === 'redo' && !canRedo)}
                    size={item.size}
                    title={item.title ?? item.label}
                >
                    {item.icon && <span style={{ fontSize: '14px' }}>{item.icon}</span>}
                    {item.label}
                    {item.children && item.children.length > 0 && !isChild && (
                        <span style={{ fontSize: '10px', marginLeft: '4px' }}>▼</span>
                    )}
                </Button>

                {/* Выпадающее меню */}
                {item.children && item.children.length > 0 && activeMenu === item.id && !isChild && (
                    <div
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: 0,
                            backgroundColor: 'white',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            padding: '4px',
                            zIndex: 1000,
                            minWidth: '150px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px'
                        }}
                        onMouseLeave={() => setActiveMenu(null)}
                    >
                        {item.children.map(child => renderMenuItem(child, true))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div
            className="toolbar"
            style={{
                width: '100%',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '8px 16px',
                borderBottom: '1px solid #e0e0e0',
                backgroundColor: 'white',
                alignItems: 'center',
            }}
        >
            {items.map(item => renderMenuItem(item))}
        </div>
    );
};

export default Toolbar;