import {Button} from "@shared/ui/form/button";
import {ICON_PATHS} from "@shared/enum/icons";
import {Input} from "@shared/ui/form/input";
import Icon from "@mdi/react";
import style from '../style/project.module.css'
//import {EColors} from "@shared/enum/colors";
import {useNavigate} from "@tanstack/react-router";
import {useModal} from "@widgets/modal/use-case";
import {ProjectHeader} from "@shared/ui/project_page/header/component";
//import type {IFileItemProps} from "@shared/ui/project_page/file_item/interface";
//import {FileItem} from "@shared/ui/project_page/file_item/component";
import {useState} from "react";
import {Avatar, AvatarFallback} from "@shared/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem} from "@/shared/ui/dropdown-menu";
import {DropdownMenuTrigger} from "@shared/ui/dropdown-menu";
import {IconButton} from "@shared/ui/form/icon_button";
//import {useSidebar} from "@widgets/sidebar/context/useSidebar.tsx";



interface IFileItem {
    id: string;
    name: string;
    type: 'document' | 'diagram' | 'folder';
    size?: string;
    modified: string;
    modifiedBy: string;
    avatar: string;
    color: string;
}


const ProjectPage = () => {
    const navigate = useNavigate();
    //const { projectId } = useParams();
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const files: IFileItem[] = [
        {
            id: '1',
            name: 'System Overview.md',
            type: 'document',
            size: '12 KB',
            modified: '2 min ago',
            modifiedBy: 'Alice Chen',
            avatar: 'AC',
            color: 'bg-blue-500',
        },
        {
            id: '2',
            name: 'C4 Context Diagram',
            type: 'diagram',
            size: '8 KB',
            modified: '15 min ago',
            modifiedBy: 'Bob Smith',
            avatar: 'BS',
            color: 'bg-purple-500',
        },
        {
            id: '3',
            name: 'Component Diagram',
            type: 'diagram',
            size: '15 KB',
            modified: '1 hour ago',
            modifiedBy: 'Carol Davis',
            avatar: 'CD',
            color: 'bg-green-500',
        },
        {
            id: '4',
            name: 'Requirements.md',
            type: 'document',
            size: '24 KB',
            modified: '2 hours ago',
            modifiedBy: 'Alice Chen',
            avatar: 'AC',
            color: 'bg-blue-500',
        },
        {
            id: '5',
            name: 'Entity Relationship',
            type: 'diagram',
            size: '18 KB',
            modified: '3 hours ago',
            modifiedBy: 'Bob Smith',
            avatar: 'BS',
            color: 'bg-purple-500',
        },
        {
            id: '6',
            name: 'Process Documentation.md',
            type: 'document',
            size: '31 KB',
            modified: '5 hours ago',
            modifiedBy: 'Carol Davis',
            avatar: 'CD',
            color: 'bg-green-500',
        },
    ];

    const handleFileClick = (file: IFileItem) => {
        if (file.type === 'diagram') {
            navigate({to:`/diagram/${file.id}`});
        } else if (file.type === 'document') {
            navigate({to:`/document/${file.id}`});
        }
    };

    //const na_files: IFileItemProps[] = [{
    //    icon: ICON_PATHS.DESCRIPTION,
    //    iconColor: EColors.DOCX
    //},{
    //    icon: ICON_PATHS.ANALYSIS,
    //    iconColor: EColors.DIAGRAM
    //}]

    const { showModal } = useModal()

    const modalContent = <p>ModalContent</p>

    const handleAddFile = () => {
        showModal({
            title: 'Title',
            content: modalContent,
        })
    }

    return (
        <>
            <ProjectHeader>
                <div className="flex-1 max-w-md">
                    <Input
                        inputSize={'small'}
                        leftObj={<Icon path={ICON_PATHS.SEARCH}/>}
                        placeholder={'Поиск файлов'}
                        className="pl-9 h-9 w-70 bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm"
                    />
                </div>

                <Button intent={'secondary'} decoration={'ghost'} icon={
                    <Icon path={ICON_PATHS.FILTER} className="w-4 h-4 mr-2"/>
                }>
                    Фильтр
                </Button>

                <div className="flex items-center gap-1 border border-border rounded-md p-1">
                    <IconButton
                        active={viewMode == 'list'}
                        path={ICON_PATHS.FORMAT_LIST_UNNUMBERED}
                        padding
                        onClick={() => setViewMode('list')}
                    />
                    <IconButton
                        active={viewMode == 'grid'}
                        onClick={() => setViewMode('grid')}
                        padding
                        path={ICON_PATHS.GRID}
                    />
                </div>

                <Button onClick={handleAddFile} icon={
                    <Icon path={ICON_PATHS.ADD} className="size-4 mr-2"/>
                }>
                    Создать
                </Button>
            </ProjectHeader>
            <div className={style.content}>
                {/*
                <Link to={ERouterPath.PROJECT_PAGE} className={style.goBack}>
                    <Icon path={ICON_PATHS.KEYBOARD_ARROW_LEFT} size={1}/>
                    Вернется к проектам
                </Link>
                <div className={style.row} role={'menubar'}>
                    <Input placeholder={"Поиск по папкам"}
                           leftObj={<Icon path={ICON_PATHS.SEARCH} className="size-4"/>}/>
                    <Button>
                        По доступу
                    </Button>

                </div>
                */}
                {/*<div className={style.list}>
                    {na_files.map((item, key) =>
                        <FileItem key={key} icon={item.icon} iconColor={item.iconColor}/>)}
                    <FileItem/>
                    <FileItem/>
                    <FileItem/>
                </div>*/}

                {/*<ScrollArea className="flex-1 px-2 py-2">
                    {treeData.map((node) => (
                        <TreeItem key={node.id} node={node}/>
                    ))}
                </ScrollArea>*/}
                <div className="flex-1 overflow-auto">
                    {viewMode === 'list' ? (
                        <div className="p-6">
                            <table className="w-full">
                                <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        Имя
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        Размер
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        Изменено
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                                        Автор
                                    </th>
                                    <th className="w-12"></th>
                                </tr>
                                </thead>
                                <tbody>
                                {files.map((file) => (
                                    <tr
                                        key={file.id}
                                        className="border-b border-border hover:bg-zinc-50 dark:hover:bg-zinc-800 cursor-pointer transition-colors"
                                        onClick={() => handleFileClick(file)}
                                    >
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 flex items-center justify-center">
                                                    {file.type === 'diagram' ? (
                                                        <Icon path={ICON_PATHS.BOX} className="w-5 h-5 text-purple-500" />
                                                    ) : (
                                                        <Icon path={ICON_PATHS.DESCRIPTION} className="w-5 h-5 text-blue-500" />
                                                    )}
                                                </div>
                                                <span className="font-medium text-zinc-900 dark:text-white">
                          {file.name}
                        </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                                            {file.size}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-zinc-600 dark:text-zinc-400">
                                            {file.modified}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="w-6 h-6">
                                                    <AvatarFallback className={`${file.color} text-white text-[10px]`}>
                                                        {file.avatar}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm text-zinc-600 dark:text-zinc-400">
                          {file.modifiedBy}
                        </span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                    <IconButton path={ICON_PATHS.MORE_VERT}/>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem>Открыть</DropdownMenuItem>
                                                    <DropdownMenuItem>Переименовать</DropdownMenuItem>
                                                    <DropdownMenuItem>Переместить</DropdownMenuItem>
                                                    <DropdownMenuItem>Дублировать</DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        className="text-red-600">Удалить</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {files.map((file) => (
                                    <div
                                        key={file.id}
                                        className="border rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-zinc-900"
                                        onClick={() => handleFileClick(file)}
                                    >
                                        <div
                                            className="w-full aspect-square bg-zinc-50 dark:bg-zinc-800 rounded-lg flex items-center justify-center mb-3">
                                            {file.type === 'diagram' ? (
                                                <Icon path={ICON_PATHS.BOX} className="w-12 h-12 text-purple-500" />
                                            ) : (
                                                <Icon path={ICON_PATHS.DESCRIPTION} className="w-12 h-12 text-blue-500" />
                                            )}
                                        </div>
                                        <h4 className="font-medium text-sm text-zinc-900 dark:text-white mb-1 truncate">
                                            {file.name}
                                        </h4>
                                        <p className="text-xs text-zinc-500 mb-2">{file.size}</p>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="w-5 h-5">
                                                <AvatarFallback className={`${file.color} text-white text-[9px]`}>
                                                    {file.avatar}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="text-xs text-zinc-500 truncate">{file.modified}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default ProjectPage;