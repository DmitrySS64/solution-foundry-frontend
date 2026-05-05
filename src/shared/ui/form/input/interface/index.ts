import type { ComponentProps, ReactNode } from 'react'
import type { VariantProps } from 'class-variance-authority'
import {inputVariants} from '../style'

interface IInputProps
    extends ComponentProps<'input'>,
        VariantProps<typeof inputVariants> {
    leftObj?: ReactNode
    rightObj?: ReactNode
}

export type { IInputProps }
