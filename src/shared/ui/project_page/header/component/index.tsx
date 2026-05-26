import {BreadcrumbNavigation} from "@shared/ui/project_page/breadcrumb/component";
import type {PropsWithChildren} from "react";
import type {ICrumbCompProps} from "@shared/ui/project_page/breadcrumb/interface";
import ERouterPath from "@shared/routes";

const ProjectHeader = ({
    children,
}: PropsWithChildren )=> {
    const crumbers: ICrumbCompProps[] = [
        { path: ERouterPath.MAIN_PAGE, name: "Главная" },
        { path: ERouterPath.PROJECT_PAGE + '/{id}', name: "Проект" },
    ]
    return (
        <div className="border-b px-6 py-4 border-border border-b-1 bg-white">
            <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <BreadcrumbNavigation crambs={crumbers} lastFolder='Диаграмма 1'/>
            </div>
            <div className={'flex items-center gap-4'}>
                {children}
            </div>
        </div>
    )
}

export {ProjectHeader};