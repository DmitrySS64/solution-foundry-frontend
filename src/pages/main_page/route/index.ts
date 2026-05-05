import { type AnyRoute, createRoute, lazyRouteComponent } from "@tanstack/react-router";
import ERouterPath from "@shared/routes";

const createMainPageRoute = (parentRoute: AnyRoute) => createRoute({
    path: ERouterPath.MAIN_PAGE,
    component: lazyRouteComponent(() => import('@pages/main_page/component')),
    getParentRoute: () => parentRoute,
})

export { createMainPageRoute }