import type {VariantProps} from "class-variance-authority";
import type buttonVariants from "@shared/ui/form/button/style";
import type {ComponentProps, ReactNode} from "react";

interface IButtonProps
    extends ComponentProps<'button'>,
        VariantProps<typeof buttonVariants> {
    icon?: ReactNode;
}

export type { IButtonProps }


//export interface ButtonProps
//    extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "disabled">,
//        VariantProps<typeof button> {}