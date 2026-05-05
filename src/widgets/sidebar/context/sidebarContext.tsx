import {createContext} from "react";
import type {SidebarContextType} from "@widgets/sidebar/context/index.tsx";

export const SidebarContext = createContext<SidebarContextType | undefined>(undefined);