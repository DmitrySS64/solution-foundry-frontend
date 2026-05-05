import { type AnyRoute, createRoute, lazyRouteComponent } from "@tanstack/react-router";
import ERouterPath from "@shared/routes";

const createProjectPageRoute = (parentRoute: AnyRoute) => createRoute({
    path: ERouterPath.PROJECT_PAGE+'/${id}',
    component: lazyRouteComponent(() => import('@pages/project/component')),
    getParentRoute: () => parentRoute,
})

export { createProjectPageRoute }