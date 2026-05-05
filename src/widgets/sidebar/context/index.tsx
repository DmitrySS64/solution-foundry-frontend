import {type ReactNode, useState} from 'react';
import {SidebarContext as SidebarContext1} from "@widgets/sidebar/context/sidebarContext.tsx";

export interface SidebarContextType {
    isSidebarVisible: boolean;
    showSidebar: () => void;
    hideSidebar: () => void;
    toggleSidebar: () => void;
}

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const showSidebar = () => setIsSidebarVisible(true);
    const hideSidebar = () => setIsSidebarVisible(false);
    const toggleSidebar = () => setIsSidebarVisible(prev => !prev);

    return (
        <SidebarContext1 value={{
            isSidebarVisible,
            showSidebar,
            hideSidebar,
            toggleSidebar,
        }}>
            {children}
        </SidebarContext1>
    );
};

