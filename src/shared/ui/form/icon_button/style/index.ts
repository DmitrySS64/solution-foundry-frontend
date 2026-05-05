import {cva} from "class-variance-authority";
import style from './index.module.css'

const iconButtonVariants = cva(style.base, {
    variants: {
        padding: {
            true: style.hasPadding
        },
        active: {
            true: style.bActive
        }
    },
})

export default iconButtonVariants;