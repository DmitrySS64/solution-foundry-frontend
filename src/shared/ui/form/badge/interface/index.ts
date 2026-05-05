import type {ComponentProps} from "react";
import type {VariantProps} from "class-variance-authority";
import type {badgeVariants} from "@shared/ui/form/badge/style";

interface IBadgeProps
    extends ComponentProps<'span'>,
        VariantProps<typeof badgeVariants>{
    color?: string;
}

export type { IBadgeProps }