import style from "../style/resentChangesPage.module.css"
import Icon from "@mdi/react";
import {ICON_PATHS} from "@shared/enum/icons";
//import {cn} from "@shared/ui/lib/cn";
import {projects, recentChanges, recentFiles} from '../const'
import {useNavigate} from "@tanstack/react-router";
import {useTranslation} from "react-i18next";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@shared/ui/card";
import {Avatar, AvatarFallback} from "@shared/ui/avatar";
import {Button} from "@shared/ui/form/button";

//const CardItem = () => {
//    return (
//        <div className={style.card}>
//            <div className={style.head}>
//                <Icon path={ICON_PATHS.OPEN_FOLDER} size={1} className={style.icon}/>
//                <div className={style.infoBox}>
//                    <p className={style.title}>
//                        Заголовок
//                    </p>
//                    <p>
//                        Подзаголовок
//                    </p>
//                </div>
//            </div>
//            <p>Обновлен 3 д. назад</p>
//        </div>
//    )
//}

const ResentChangesPage = () => {
    const nav = useNavigate();
    const {t} = useTranslation();
    return (
        <div className={style.container}>
            <div className={style.section}>
                <div>
                    <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                        {t('translation:recent_changes_page.greeting')}
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400">
                        {t('translation:recent_changes_page.subtitle')}
                    </p>
                </div>
            </div>
            <div className="grid gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className={'flex items-center gap-2'}>
                            <Icon path={ICON_PATHS.FOLDER} className={'flex items-center gap-2 h-6 w-6 text-blue-400'} />
                            {t('translation:recent_changes_page.projects.title')}
                        </CardTitle>
                        <CardDescription>{t('translation:recent_changes_page.projects.desc')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {projects.map((project) => (
                                <div
                                    key={project.id}
                                    className="flex items-center gap-4 p-4 rounded-lg border border-border bg-white dark:bg-zinc-900 hover:border-blue-500 transition-colors cursor-pointer"
                                    onClick={() => nav({to:`/project/${project.id}`})}
                                >
                                    <div
                                        className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                                        <Icon path={ICON_PATHS.FOLDER_COPY} className="w-6 h-6 text-white"/>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="pt-1 font-semibold text-zinc-900 dark:text-white">
                                            {project.name}
                                        </h3>
                                        <p className="text-sm text-zinc-600 dark:text-zinc-400 truncate">
                                            {project.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-zinc-500">
                                        <span>{project.fileCount} файлов</span>
                                        <span>{project.lastModified}</span>
                                        <Icon path={ICON_PATHS.KEYBOARD_ARROW_RIGHT} className="w-4 h-4"/>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button decoration={'outline'} icon={<Icon path={ICON_PATHS.ADD} className={'size-6 me-2'}/>}>
                            Создать проект
                        </Button>
                    </CardFooter>
                </Card>
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon path={ICON_PATHS.CLOCK} className="w-5 h-5 text-purple-500" />
                                {t('translation:recent_changes_page.files.title')}
                            </CardTitle>
                            <CardDescription>{t('translation:recent_changes_page.files.desc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentFiles.map((file) => (
                                    <div
                                        key={file.id}
                                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                                        onClick={() => {
                                            if (file.type === 'diagram') {
                                                nav({to:`/diagram/${file.id}`});
                                            } else {
                                                nav({to:`/document/${file.id}`});
                                            }
                                        }}
                                    >
                                        <div className="w-8 h-8 flex items-center justify-center">
                                            {file.type === 'diagram' ? (
                                                <Icon path={ICON_PATHS.BOX} className="w-5 h-5 text-purple-500" />
                                            ) : (
                                                <Icon path={ICON_PATHS.DESCRIPTION} className="w-5 h-5 text-blue-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                                                {file.name}
                                            </h4>
                                            <p className="text-xs text-zinc-500 truncate">{file.project}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-6 h-6">
                                                <AvatarFallback className={`${file.color} text-white text-[10px]`}>
                                                    {file.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-zinc-500">{file.lastModified}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Icon path={ICON_PATHS.CLOCK} className="w-5 h-5 text-green-500" />
                                {t('translation:recent_changes_page.changes.title')}
                            </CardTitle>
                            <CardDescription>{t('translation:recent_changes_page.changes.desc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {recentChanges.map((change) => (
                                    <div
                                        key={change.id}
                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                                    >
                                        <Avatar className="w-8 h-8 mt-0.5">
                                            <AvatarFallback className={`${change.color} text-white text-xs`}>
                                                {change.avatar}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-zinc-900 dark:text-white">
                                                <span className="font-medium">{change.author}</span> изменил{' '}
                                                <span className="font-medium">{change.fileName}</span>
                                            </p>
                                            <p className="text-xs text-zinc-500 mt-0.5">{change.change}</p>
                                            <p className="text-xs text-zinc-400 mt-1">{change.time}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

export default ResentChangesPage