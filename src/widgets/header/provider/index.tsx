import {type FC, type PropsWithChildren, type ReactNode, useState} from "react";
import {HeaderContext} from "@widgets/header/context";
import type {IHeaderProps} from "@widgets/header/interface";

const HeaderProvider: FC<{children: ReactNode}> = ({children}: PropsWithChildren) => {

    const [headerValue, setHeaderValue] = useState<IHeaderProps>({
        isRegistered: true,
    })

    return (
        <HeaderContext.Provider value={{headerProps: headerValue, setHeaderProps: setHeaderValue}}>
            {children}
        </HeaderContext.Provider>
    )
}

export { HeaderProvider }