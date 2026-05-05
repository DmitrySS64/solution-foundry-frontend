import {cva} from "class-variance-authority";
import style from './badge.module.css'

const badgeVariants = cva(
    style.base,
    {
        variants: {
            size: {
                small: style.small,
                medium: style.medium,
            },
            light: {
                true: style.light,
            }
        },
        defaultVariants: {
            size: 'medium'
        }
    }
)

export { badgeVariants };