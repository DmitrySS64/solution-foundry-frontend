import type { ReactNode } from 'react'

interface IModalShowParams {
    content: ReactNode
    title?: string
}

interface IModalContextProps {
    showModal: (params: IModalShowParams) => void
    closeModal: (id: string) => void
}

interface IModal {
    id: string
    title?: string
    content: ReactNode
}

export type { IModalShowParams, IModalContextProps, IModal }
