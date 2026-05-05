import {type AnyRoute, createRoute, lazyRouteComponent} from "@tanstack/react-router";
import ERouterPath from "@shared/routes";

const createMDEditorPageRoute = (parentRoute: AnyRoute) => createRoute({
    path: ERouterPath.MD_TEXT_EDITOR_PAGE+"/${id}",
    component: lazyRouteComponent(() => import('@pages/markdown_editor_page/component')),
    getParentRoute: () => parentRoute,
})

export { createMDEditorPageRoute }