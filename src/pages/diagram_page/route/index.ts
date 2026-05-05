import {type AnyRoute, createRoute, lazyRouteComponent} from "@tanstack/react-router";
import ERouterPath from "@shared/routes";

const createDiagramEditorPageRoute = (parentRoute: AnyRoute) => createRoute({
    path: ERouterPath.DIAGRAM_PAGE+"/${id}",
    component: lazyRouteComponent(() => import('@pages/diagram_page/component')),
    getParentRoute: () => parentRoute,
})

export { createDiagramEditorPageRoute }