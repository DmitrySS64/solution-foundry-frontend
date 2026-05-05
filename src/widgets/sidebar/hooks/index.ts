import { useEffect } from 'react';
import { useLocation } from '@tanstack/react-router';

import {useSidebar} from "@widgets/sidebar/context/useSidebar.tsx";
import ERouterPath from "@shared/routes";

// Роуты, где сайдбар должен быть виден
const SIDEBAR_VISIBLE_PATTERNS = [
    ERouterPath.PROJECT_PAGE,     // проекты со слешем
    ERouterPath.MD_TEXT_EDITOR_PAGE,
];

export const useSidebarAutoHide = () => {
    const location = useLocation();
    const { showSidebar, hideSidebar } = useSidebar();

    useEffect(() => {
        const path = location.pathname;

        // Сайдбар виден ТОЛЬКО на страницах /project/* и /md-editor/*
        const shouldShow = path.startsWith(SIDEBAR_VISIBLE_PATTERNS[0]) || path.startsWith(SIDEBAR_VISIBLE_PATTERNS[1]);

        if (shouldShow) {
            showSidebar();
        } else {
            hideSidebar();
        }
    }, [location.pathname, showSidebar, hideSidebar]);
};