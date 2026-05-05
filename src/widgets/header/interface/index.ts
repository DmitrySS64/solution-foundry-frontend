import React from "react";

interface IHeaderProps {
    isRegistered: boolean;
}

interface IHeaderContextProps {
    headerProps: IHeaderProps;
    setHeaderProps: React.Dispatch<React.SetStateAction<IHeaderProps>>;
}

export type {IHeaderProps, IHeaderContextProps}