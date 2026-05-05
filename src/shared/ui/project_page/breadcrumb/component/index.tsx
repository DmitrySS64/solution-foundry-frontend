import {Link} from "@tanstack/react-router";
import Icon from "@mdi/react";
import {ICON_PATHS} from "@shared/enum/icons";
import type {ICrumbCompProps} from "../interface";

const CrumbComp = ({
    path = '',
    name = 'Папка'
}:ICrumbCompProps) =>
<>
    <Link style={{color:'var(--color-zinc-600)'}} to={path}>{name}</Link>
    <Icon path={ICON_PATHS.KEYBOARD_ARROW_RIGHT} className={'size-4'}/>
</>

interface IBreadcrumbNavigation {
    crambs: ICrumbCompProps[],
    lastFolder: string
}

const BreadcrumbNavigation = ({crambs=[], lastFolder="Папка"}:IBreadcrumbNavigation) => {

    return (
        <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            {crambs.map((c: ICrumbCompProps) =>
                <CrumbComp key={'crumb_'+c.name} path={c.path} name={c.name} />
            )}
            <span className={'font-medium text-zinc-900 dark:text-white'}>
                {lastFolder}
            </span>
        </div>
    )
}

export {BreadcrumbNavigation}