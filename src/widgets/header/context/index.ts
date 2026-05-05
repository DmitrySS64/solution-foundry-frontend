import {createContext} from "react";
import type {IHeaderContextProps} from "@widgets/header/interface";

const HeaderContext = createContext<IHeaderContextProps|undefined>(undefined);

export {HeaderContext};