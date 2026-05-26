//import type {ISelectionBox} from "@/modules/diagram/store/slices/selection.slice.ts
export interface ISelectionBox {
    active: boolean
    x: number
    y: number
    width: number
    height: number
}

export interface ISelectionState {
    selection: {
        ids: string[];
        box?: ISelectionBox | null; // ← здесь должно быть selectionBox
    };
}

export interface ISelectionActions {
    selectNode: (id: string | null) => void;
    setSelectionBox: (box: ISelectionBox | null) => void;
    deleteSelection: () => void;
}