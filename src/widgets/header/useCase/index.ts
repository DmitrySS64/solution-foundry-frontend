import type {IHeaderContextProps} from "@widgets/header/interface";
import {useContext} from "react";
import {HeaderContext} from "@widgets/header/context";

const useHeaderContext = (): IHeaderContextProps => {
    const context = useContext(HeaderContext);
    if (!context) {
        throw new Error('useNavbar must be used within a NavbarProvider');
    }
    return context;
}

export { useHeaderContext };