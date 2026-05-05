import { type AnyRoute, createRoute, lazyRouteComponent } from "@tanstack/react-router";
import ERouterPath from "@shared/routes";

const createRecentChangesPageRoute = (parentRoute: AnyRoute) => createRoute({
    path: ERouterPath.RECENT_CHANGES_PAGE,
    component: lazyRouteComponent(() => import('@pages/recent_changes_page/component')),
    getParentRoute: () => parentRoute,
})

export { createRecentChangesPageRoute }