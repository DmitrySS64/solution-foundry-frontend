export interface IToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    onSave?: () => void;
    onClear?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
    isSaving?: boolean;
}

//export interface ToolbarButtonProps
//    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
//        VariantProps<typeof buttonVariants> {
//    icon?: string;
//    label?: string;
//}