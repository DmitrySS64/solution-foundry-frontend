import type {IButtonProps} from "@shared/ui/form/button/interface";
import buttonVariants from "@shared/ui/form/button/style";
import {cn} from "@shared/ui/lib/cn";
import React from "react";

const Button: React.FC<IButtonProps> = ({
    className,
    intent,
    size,
    decoration,
    icon,
    children,
    ...props
}) => {
    const isIconOnly = !!icon && !children;
    return (
        <button
            className={cn(buttonVariants({
                intent,
                size,
                decoration,
                iconStyle: isIconOnly ? 'iconOnly' : icon ? 'icon' : undefined,
            }) ,className)}
            {...props}
        >
            {icon}
            {children}
        </button>
    )
}

export { Button }