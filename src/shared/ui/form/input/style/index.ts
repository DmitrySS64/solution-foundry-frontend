import style from './input.module.css'
import {cva} from "class-variance-authority";

const inputVariants = cva(style.base, {
    variants: {
        intent: {
            primary: style.primary,
            secondary: style.secondary
        },
        inputSize: {
            small: style.small,
            medium: style.medium,
            large: style.large,
        },
        hasIcon: {
            left: style.leftIcon,
            right: style.reghtIcon,
            both: style.bothIcon,
        }
    },
    compoundVariants: [
        { intent: 'primary', inputSize: "medium", className: style.primaryMedium },
    ],
    defaultVariants:{
        intent: 'primary',
        inputSize: 'medium',
    }
})

export {inputVariants};