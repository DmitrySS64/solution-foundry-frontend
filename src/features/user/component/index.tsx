import style from '../style/user.module.css'
import Icon from "@mdi/react";
import {ICON_PATHS} from "@shared/enum/icons";

const UserHeaderComp = () => {
    return (
        <>
            <div className={style.user}>
                <img alt={'avatar'} src={'images/Avatar.svg'} className={style.icon}/>
                User
                <Icon path={ICON_PATHS.ARROW_DROP_DOWN} size={1}/>
            </div>
        </>

    )
}


export {UserHeaderComp}