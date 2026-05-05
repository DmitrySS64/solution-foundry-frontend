import Style from '@widgets/header/style/header.module.css'
import ERouterPath from "@shared/routes";
import {Link, useNavigate} from "@tanstack/react-router";
//import {UserHeaderComp} from "@features/user/component";
import {cn} from "@shared/ui/lib/cn";
import {IconButton} from "@shared/ui/form/icon_button";
import {ICON_PATHS} from "@shared/enum/icons";
import {Avatar, AvatarFallback} from "@shared/ui/avatar";
import {useTranslation} from "react-i18next";
import {Input} from "@shared/ui/form/input";
import Icon from "@mdi/react";

interface IIndexProps {
    title: string,
    url: string,
}

const Header = () => {
    const indexs: IIndexProps[] = [
        { title: "Главная", url: ERouterPath.MAIN_PAGE },
        { title: "Тест", url: ERouterPath.TEST_PAGE },
        { title: "Последние", url: ERouterPath.RECENT_CHANGES_PAGE },
    ]

    const collaborators = [
        { name: 'Alice Chen', avatar: 'AC', color: 'bg-blue-500' },
        { name: 'Bob Smith', avatar: 'BS', color: 'bg-purple-500' },
        { name: 'Carol Davis', avatar: 'CD', color: 'bg-green-500' },
    ];

    const {t} = useTranslation();
    const nav = useNavigate()

    const titleOnClick = () => nav({to:ERouterPath.MAIN_PAGE});

    return (
        <div className={Style.header}>
            <div className={Style.headerBlock}>
                <div onClick={titleOnClick} className="flex items-center gap-2 select-none">
                    <div
                        className="w-8 h-8 rounded-md bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">NA</span>
                    </div>
                    <span className="font-semibold text-zinc-900 dark:text-white select-none">{t('NATitle')}</span>
                </div>
                <div className={Style.navBar}>
                    {indexs.map((i) => (
                        <Link key={i.title} to={i.url} className={cn('text-sm', Style.navLink)}>
                            {i.title}
                        </Link>
                    ))}
                </div>

            </div>
            <div className={Style.headerBlock}>
                <div className="flex-1 max-w-md">
                    <div className="relative">
                        <Input
                            inputSize={'small'}
                            leftObj={<Icon path={ICON_PATHS.SEARCH}/>}
                            placeholder={t('translation:search')}
                            className="pl-9 h-9 w-100 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm"
                        />

                    </div>
                </div>
            </div>
            <div className={cn(Style.headerBlock, Style.r)}>
                <div className="flex items-center -space-x-2">
                    {collaborators.map((user) => (
                        <Avatar key={user.name}
                                className="w-8 h-8 border-2 border-white dark:border-zinc-900 select-none">
                            <AvatarFallback className={`${user.color} text-white text-xs`}>
                                {user.avatar}
                            </AvatarFallback>
                        </Avatar>
                    ))}
                </div>
                <div className={Style.block}>
                    <IconButton padding path={ICON_PATHS.BELL}/>
                    <IconButton padding path={ICON_PATHS.SETTINGS}/>
                </div>
                {/*<UserHeaderComp/>*/}
                <Avatar className={'w-8 h-8 cursor-pointer select-none'}>
                    <AvatarFallback className={'bg-zinc-200 dark:bg-zinc-700'}>DS</AvatarFallback>
                </Avatar>
            </div>

        </div>
    )
}

export default Header;