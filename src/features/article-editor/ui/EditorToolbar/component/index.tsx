import type {IToolbarProps} from "../interface";
import clsx from "clsx";
import {cva, type VariantProps} from "class-variance-authority";
import Icon from "@mdi/react";
import {
    mdiCheckboxMarked, mdiCodeTags, mdiContentSave, mdiDelete,
    mdiFormatBold, mdiFormatHeader1,
    mdiFormatItalic, mdiFormatListBulleted, mdiFormatListNumbered, mdiFormatQuoteOpen,
    mdiFormatStrikethroughVariant,
    mdiFormatUnderline, mdiImage,
    mdiRedo,
    mdiUndo, mdiVideo
} from "@mdi/js";

const buttonVariants = cva(
    // Базовые стили
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-gray-900 text-white hover:bg-gray-800",
                outline: "border border-gray-300 bg-transparent hover:bg-gray-100",
                ghost: "hover:bg-gray-100",
                danger: "bg-red-600 text-white hover:bg-red-700",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-8 px-3 text-xs",
                icon: "h-10 w-10 p-2",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

interface ToolbarButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    icon?: string;
    label?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
                                                         className,
                                                         variant,
                                                         size,
                                                         icon,
                                                         label,
                                                         children,
                                                         ...props
                                                     }) => {
    return (
        <button
            className={clsx(buttonVariants({ variant, size, className }))}
            {...props}
        >
            {icon && (
                <Icon
                    path={icon}
                    size={size === 'sm' ? 0.8 : 1}
                    className={clsx(label ? 'mr-2' : '')}
                />
            )}
            {label || children}
        </button>
    );
};

const Toolbar: React.FC<IToolbarProps> = ({
                                                    onSave,
                                                    onClear,
                                                    onUndo,
                                                    onRedo,
                                                    isSaving = false,
                                                    className,
                                                    ...props
                                                }) => {
    return (
        <div
            className={clsx(
                "flex flex-wrap items-center gap-2 p-2 border border-gray-200 rounded-t-lg bg-white sticky top-0 z-10",
                className
            )}
            {...props}
        >
            {/* Блок с действиями редактирования */}
            <div className="flex items-center gap-1 mr-2">
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiUndo}
                    onClick={onUndo}
                    title="Отменить (Ctrl+Z)"
                />
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiRedo}
                    onClick={onRedo}
                    title="Повторить (Ctrl+Y)"
                />
            </div>

            <div className="w-px h-6 bg-gray-300" /> {/* Разделитель */}

            {/* Блок с форматированием текста */}
            <div className="flex items-center gap-1">
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiFormatBold}
                    title="Жирный"
                />
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiFormatItalic}
                    title="Курсив"
                />
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiFormatUnderline}
                    title="Подчеркнутый"
                />
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiFormatStrikethroughVariant}
                    title="Зачеркнутый"
                />
            </div>

            <div className="w-px h-6 bg-gray-300" />

            {/* Блок с инструментами */}
            <div className="flex items-center gap-1">
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiFormatHeader1}
                    title="Заголовок"
                />
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiFormatListBulleted}
                    title="Маркированный список"
                />
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiFormatListNumbered}
                    title="Нумерованный список"
                />
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiCheckboxMarked}
                    title="Чек-лист"
                />
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiFormatQuoteOpen}
                    title="Цитата"
                />
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiCodeTags}
                    title="Код"
                />
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiImage}
                    title="Изображение"
                />
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiVideo}
                    title="Видео"
                />
            </div>

            <div className="flex-1" /> {/* Растягиваем пространство */}

            {/* Блок с сохранением */}
            <div className="flex items-center gap-2">
                <ToolbarButton
                    variant="ghost"
                    size="icon"
                    icon={mdiDelete}
                    onClick={onClear}
                    title="Очистить"
                />
                <ToolbarButton
                    variant="default"
                    size="sm"
                    icon={mdiContentSave}
                    onClick={onSave}
                    disabled={isSaving}
                >
                    {isSaving ? 'Сохранение...' : 'Сохранить'}
                </ToolbarButton>
            </div>
        </div>
    );
};

export default Toolbar;