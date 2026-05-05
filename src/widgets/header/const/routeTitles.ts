import ERouterPath from "@shared/routes";

const RouteTitles: Partial<Record<ERouterPath, string>> = {
    [ERouterPath.MAIN_PAGE]: 'Главная',
    [ERouterPath.TEST_PAGE]: 'Тест',
    //[ERouterPath.RECENT_CHANGES_PAGE]: 'Последние проекты'
}

export { RouteTitles }