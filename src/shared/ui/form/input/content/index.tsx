import type { IInputProps } from '../interface'
import {cn} from "@shared/ui/lib/cn";
import {inputVariants} from "@shared/ui/form/input/style";
import style from '../style/icons/icon.module.css'

const Input = ({
                   className,
                   leftObj,
                   rightObj,
                   type = 'text',
                   inputSize,
                   //state = 'default',
                   //hasIcon,
                   ...props
               }: IInputProps) => {
    return (
        <div className={style.wrapper}>
            {leftObj && (
               <div className={cn(style.icon, style.left)}>{leftObj}</div>
            )}
            <input
                type={type}
                data-slot="input"
                className={cn(inputVariants({
                    inputSize,
                    hasIcon: (!rightObj && !leftObj) ? undefined : !rightObj ? 'left' : !leftObj ? 'right' : 'both'
                }), className)}
                {...props}
            />
            {rightObj && (
                <div className={cn(style.icon, style.right)}>{rightObj}</div>
            )}
        </div>
    )
}

Input.displayName = 'Input'
export { Input }
