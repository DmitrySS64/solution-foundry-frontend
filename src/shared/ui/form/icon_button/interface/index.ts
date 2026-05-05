import {type ComponentProps} from "react";
import type {VariantProps} from "class-variance-authority";
import type iconButtonVariants from "@shared/ui/form/icon_button/style";

interface IIconButtonProps
    extends ComponentProps<'button'>,
        VariantProps<typeof iconButtonVariants>{
    path?: string;
}

export type { IIconButtonProps }