import type { IInputProps } from '@shared/ui/form/input/interface'

interface ITextFieldProps extends IInputProps {
    label?: string
    description?: string
    required?: boolean
}

export type { ITextFieldProps }
