import type {
    ISelectContentProps,
    ISelectGroupProps,
    ISelectItemProps,
    ISelectLabelProps,
    ISelectProps,
    ISelectScrollDownButtonProps,
    ISelectScrollUpButtonProps,
    ISelectSeparatorProps,
    ISelectTriggerProps,
    ISelectValueProps,
} from "@shared/ui/form/select/interface";
import {cn} from "@shared/ui/lib/cn";
import style from '../style/select.module.css'
import Icon from "@mdi/react";
import { mdiMenuDown, mdiMenuUp } from "@mdi/js";
import * as SelectPrimitive from '@radix-ui/react-select'
import type {ReactNode} from "react";

const Select = ({ ...props }: ISelectProps): ReactNode => {
    return <SelectPrimitive.Root data-slot="select" {...props} />
}

const SelectGroup = ({ ...props }: ISelectGroupProps): ReactNode => {
    return <SelectPrimitive.Group data-slot="select-group" {...props} />
}

const SelectValue = ({ ...props }: ISelectValueProps): ReactNode => {
    return <SelectPrimitive.Value data-slot="select-value" {...props} />
}

const SelectTrigger = ({
                           className,
                           size = 'default',
                           children,
                           ...props
                       }: ISelectTriggerProps): ReactNode => {
    return (
        <SelectPrimitive.Trigger
            data-slot="select-trigger"
            data-size={size}
            className={cn(style.trigger, className)}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <Icon path={mdiMenuDown} size={1}/>
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    )
}

const SelectContent = ({
                           className,
                           children,
                           position = 'popper',
                           ...props
                       }: ISelectContentProps): ReactNode => {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                data-slot="select-content"
                className={cn(style.content, className)}
                position={position}
                {...props}
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    className={style.Viewport}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    )
}

const SelectLabel = ({ className, ...props }: ISelectLabelProps): ReactNode => {
    return (
        <SelectPrimitive.Label
            data-slot="select-label"
            className={cn(style.label, className)}
            {...props}
        />
    )
}

const SelectItem = ({
                        className,
                        children,
                        ...props
                    }: ISelectItemProps): ReactNode => {
    return (
        <SelectPrimitive.Item
            data-slot="select-item"
            className={cn(style.item, className)}
            {...props}
        >
            <span className="absolute right-2 flex size-3.5 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    {/*<Icon path={''} size={1}/>*/}
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    )
}

const SelectSeparator = ({
                             className,
                             ...props
                         }: ISelectSeparatorProps): ReactNode => {
    return (
        <SelectPrimitive.Separator
            data-slot="select-separator"
            className={cn(style.separator, className)}
            {...props}
        />
    )
}

const SelectScrollUpButton = ({
                                  className,
                                  ...props
                              }: ISelectScrollUpButtonProps): ReactNode => {
    return (
        <SelectPrimitive.ScrollUpButton
            data-slot="select-scroll-up-button"
            className={cn(style.scrollButton, className)}
            {...props}
        >
            <Icon path={mdiMenuUp} size={1}/>
        </SelectPrimitive.ScrollUpButton>
    )
}

const SelectScrollDownButton = ({
                                    className,
                                    ...props
                                }: ISelectScrollDownButtonProps): ReactNode => {
    return (
        <SelectPrimitive.ScrollDownButton
            data-slot="select-scroll-down-button"
            className={cn(style.scrollButton, className)}
            {...props}
        >
            <Icon path={mdiMenuDown} size={1}/>
        </SelectPrimitive.ScrollDownButton>
    )
}

const ShadcnSelect = {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
}
export { ShadcnSelect }
