interface ITagProps {
    tagName?: string,
    color?: string,
}
interface IFileItemProps {
    icon?: string,
    iconColor?: string,
    fileName?: string
    tags?: ITagProps[],
    size?: string,
    lastUpdated?: string,
    onClick?: () => void
}

export type {ITagProps, IFileItemProps}