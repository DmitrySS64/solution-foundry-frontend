import {createRouter, createRootRoute, createRoute, Outlet} from "@tanstack/react-router";
import {
    //createMainPageRoute,
    createTestPageRoute
} from "@pages/index.ts";
import Header from "@widgets/header/component";
import {createRecentChangesPageRoute} from "@pages/recent_changes_page/route";
import SidebarLayout from "@widgets/sidebar/layout";
import {createProjectPageRoute} from "@pages/project/route";
import {createMDEditorPageRoute} from "@pages/markdown_editor_page/route";
import {createDiagramEditorPageRoute} from "@pages/diagram_page/route";

const rootRoute = createRootRoute();

const headerRoute = createRoute({
    id: 'header',
    getParentRoute: () => rootRoute,
    component: () => (
        <>
            <Header/>
            <Outlet/>
        </>
    )
});

const sidebarLayoutRoute = createRoute({
    id: 'app',
    component: SidebarLayout,
    getParentRoute: () => headerRoute,
})


//const mainPageRoute = createMainPageRoute(headerRoute);
const testPageRoute = createTestPageRoute(headerRoute);
const recentChangesPageRoute = createRecentChangesPageRoute(sidebarLayoutRoute);

const routeTree = rootRoute.addChildren([
    headerRoute.addChildren([
        //mainPageRoute,
        testPageRoute,
        sidebarLayoutRoute.addChildren([
            recentChangesPageRoute,
            createProjectPageRoute((sidebarLayoutRoute)),
            createMDEditorPageRoute(sidebarLayoutRoute),
            createDiagramEditorPageRoute(sidebarLayoutRoute)
        ]),
    ])
])

const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    defaultStructuralSharing: true,
    defaultPreloadStaleTime: 0,
});

export {router}