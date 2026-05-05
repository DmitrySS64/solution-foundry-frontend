import style from '../style/sidebar.module.css'
//import {Link} from "@tanstack/react-router";
import Icon from "@mdi/react";
//import ERouterPath from "@shared/routes";
import {ICON_PATHS} from "@shared/enum/icons";
import {useState} from "react";
import {ScrollArea} from "@shared/ui/core";
import {useNavigate} from "@tanstack/react-router";

//interface ISidebarItemProps {
//    icon?: string;
//    name?: string;
//    path?: string
//}

interface ITreeNode {
    id: string;
    name: string;
    type: 'folder' | 'document' | 'diagram';
    link?: string;
    children?: ITreeNode[];
}


const treeData: ITreeNode[] = [
    {
        id: '1',
        name: 'Architecture',
        type: 'folder',
        children: [
            { id: '1-1', name: 'System Overview.md', type: 'document', link: '/document/1' },
            { id: '1-2', name: 'C4 Context Diagram', type: 'diagram', link: '/diagram/1' },
            { id: '1-3', name: 'Component Diagram', type: 'diagram', link: '/diagram/1'  },
        ],
    },
    {
        id: '2',
        name: 'Workflows',
        type: 'folder',
        children: [
            { id: '2-1', name: 'User Onboarding.bpmn', type: 'diagram', link: '/diagram/1'  },
            { id: '2-2', name: 'Payment Flow', type: 'diagram', link: '/diagram/1'  },
            { id: '2-3', name: 'Process Documentation.md', type: 'document', link: '/document/1' },
        ],
    },
    {
        id: '3',
        name: 'Data Models',
        type: 'folder',
        children: [
            { id: '3-1', name: 'Entity Relationship', type: 'diagram', link: '/diagram/1'  },
            { id: '3-2', name: 'Class Diagram', type: 'diagram', link: '/diagram/1'  },
        ],
    },
    { id: '4', name: 'Requirements.md', type: 'document', link: '/document/1' },
    { id: '5', name: 'Meeting Notes.md', type: 'document', link: '/document/1' },
];

function TreeItem({ node, level = 0 }: { node: ITreeNode; level?: number }) {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const nav = useNavigate()
    return (
        <div>
            <div
                className="flex items-center gap-1 px-2 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md cursor-pointer group"
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={() => hasChildren ? setIsOpen(!isOpen) : nav({to: node.link})}
            >
                {hasChildren && (
                    <div className="w-4 h-4 flex items-center justify-center">
                        {isOpen ? (
                            <Icon path={ICON_PATHS.ARROW_DROP_DOWN} className="w-3.5 h-3.5 text-zinc-500" />
                        ) : (
                            <Icon path={ICON_PATHS.KEYBOARD_ARROW_RIGHT} className="w-3.5 h-3.5 text-zinc-500" />
                        )}
                    </div>
                )}
                {!hasChildren && <div className="w-4" />}

                <div className="w-4 h-4 flex items-center justify-center">
                    {node.type === 'folder' ? (
                        isOpen ? (
                            <Icon path={ICON_PATHS.OPEN_FOLDER} className="w-4 h-4 text-blue-500" />
                        ) : (
                            <Icon path={ICON_PATHS.FOLDER} className="w-4 h-4 text-blue-500" />
                        )
                    ) : node.type === 'diagram' ? (
                        <Icon path={ICON_PATHS.BOX} className="w-4 h-4 text-purple-500" />
                    ) : (
                        <Icon path={ICON_PATHS.DESCRIPTION} className="w-4 h-4 text-zinc-400" />
                    )}
                </div>

                <span className="text-sm text-zinc-700 dark:text-zinc-300 flex-1">{node.name}</span>
            </div>

            {hasChildren && isOpen && (
                <div>
                    {node.children!.map((child) => (
                        <TreeItem key={child.id} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
}



//const SidebarItem = ({
//                         icon = ICON_PATHS.FOLDER_COPY,
//                         name = "Проекты",
//                         path = ERouterPath.RECENT_CHANGES_PAGE
//}:ISidebarItemProps) => {
//    return (
//        <Link to={path} className={style.item}>
//            <Icon path={icon} size={1}/>
//            {name}
//        </Link>
//    )
//}

const Sidebar = () => {
    //const items: ISidebarItemProps[] = [{
    //    icon: ICON_PATHS.FOLDER_COPY,
    //    name: 'Недавние',
    //    path: ERouterPath.RECENT_CHANGES_PAGE
    //},{
    //    icon: ICON_PATHS.FOLDER_COPY,
    //    name: "Проекты",
    //    path: ERouterPath.PROJECTS_PAGE
    //}]
    return (
        <div className={style.sidebar}>
            <ScrollArea className="flex-1 px-2 py-2">
                {treeData.map((node) => (
                    <TreeItem key={node.id} node={node}/>
                ))}
            </ScrollArea>
            {/*<div className={style.sidebarBox}>
                {items.map((item, i) => {
                    return (
                        <SidebarItem icon={item.icon} name={item.name} path={item.path} key={i} />
                    )
                })}
            </div>
            <div className={style.sidebarBox}>
                <SidebarItem icon={ICON_PATHS.OPEN_FOLDER} name={'Проект'} path={ERouterPath.PROJECT_PAGE}/>
                <div className={style.dictionary}>
                    <SidebarItem name={'Файлы'} path={ERouterPath.MAIN_PAGE}/>
                    <SidebarItem name={'Документы'} path={ERouterPath.MAIN_PAGE}/>
                    <SidebarItem name={'Нотации'} path={ERouterPath.MAIN_PAGE}/>
                    <SidebarItem name={'Настройки'} path={ERouterPath.MAIN_PAGE}/>
                    <SidebarItem name={'Редактор'} path={ERouterPath.MD_TEXT_EDITOR_PAGE}/>
                </div>
            </div>*/}
        </div>
    )
}

export {Sidebar}