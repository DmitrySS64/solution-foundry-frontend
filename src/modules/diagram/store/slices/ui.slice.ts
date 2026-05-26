import type {IDiagramSlice, IUiState, IUiActions} from "@/modules/diagram/store/slices/types/store.types.ts";

export const createUiStateSlice = (): IUiState  => ({
    isEditable: true,
})

export const createUiActionsSlice: IDiagramSlice<IUiActions> = (set) => ({
    setEditable: (editable) => set({isEditable: editable}),
})