import type {PropsWithChildren} from "react";

interface IModalCompProps
    extends PropsWithChildren
{
    id: string;
    title?: string;
    onClose: (id: string) => void;
}

export type { IModalCompProps };