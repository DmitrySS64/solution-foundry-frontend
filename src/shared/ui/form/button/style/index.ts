import {cva} from "class-variance-authority";
import style from './style.module.css'

const buttonVariants = cva(style.base, {
    variants: {
        intent: {
            primary: style.primary,
            secondary: style.secondary,
            destructive: style.destructive
        },
        size: {
            small: style.small,
            medium: style.medium,
            large: style.large,
        },
        decoration: {
            outline: style.outline,
            ghost: style.ghost,
        },
        iconStyle: {
            icon: style.icon,
            iconOnly: style.iconOnly,
        }
    },
    compoundVariants: [
        { intent: 'primary', size: "medium", className: style.primaryMedium },
    ],
    defaultVariants:{
        intent: 'primary',
        size: 'medium',
    }
})

export default buttonVariants;