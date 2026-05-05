import {Outlet} from "@tanstack/react-router";
import {Sidebar} from "@widgets/sidebar/content";
import style from '../style/sidebarLayout.module.css'
import {useSidebarAutoHide} from "@widgets/sidebar/hooks";
import {useSidebar} from "@widgets/sidebar/context/useSidebar.tsx";

const SidebarLayout = () => {
    const { isSidebarVisible } = useSidebar();
    useSidebarAutoHide();
    return (
        <div className={style.layout}>
            {isSidebarVisible && <Sidebar/>}
            <div className={style.content}>
                <Outlet/>
            </div>
        </div>
    )
}

export default SidebarLayout;