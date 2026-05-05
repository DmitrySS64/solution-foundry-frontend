import Icon from "@mdi/react";
import type {IIconButtonProps} from "@shared/ui/form/icon_button/interface";
import {mdiHeart} from "@mdi/js";
import iconButtonVariants from "@shared/ui/form/icon_button/style";

const IconButton = ({
                        path = mdiHeart,
                        padding,
                        active,
                        ...props
                    }: IIconButtonProps) => {
    return (
        <button
            className={iconButtonVariants({padding, active})}
            {...props}
        >
            <Icon path={path} className={'w-4 h-4'}/>
        </button>

    )
}

export { IconButton }