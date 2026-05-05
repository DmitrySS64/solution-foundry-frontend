import type * as SelectPrimitive from '@radix-ui/react-select'
import type { ComponentProps } from 'react'

type ISelectProps = ComponentProps<typeof SelectPrimitive.Root>
type ISelectGroupProps = ComponentProps<typeof SelectPrimitive.Group>
type ISelectValueProps = ComponentProps<typeof SelectPrimitive.Value>

type ISelectTriggerProps = ComponentProps<typeof SelectPrimitive.Trigger> & {
    size?: 'sm' | 'default'
}

type ISelectContentProps = ComponentProps<typeof SelectPrimitive.Content>
type ISelectLabelProps = ComponentProps<typeof SelectPrimitive.Label>
type ISelectItemProps = ComponentProps<typeof SelectPrimitive.Item>
type ISelectSeparatorProps = ComponentProps<typeof SelectPrimitive.Separator>
type ISelectScrollUpButtonProps = ComponentProps<
    typeof SelectPrimitive.ScrollUpButton
>
type ISelectScrollDownButtonProps = ComponentProps<
    typeof SelectPrimitive.ScrollDownButton
>

export type {
    ISelectProps,
    ISelectGroupProps,
    ISelectValueProps,
    ISelectTriggerProps,
    ISelectContentProps,
    ISelectLabelProps,
    ISelectItemProps,
    ISelectSeparatorProps,
    ISelectScrollUpButtonProps,
    ISelectScrollDownButtonProps,
}
