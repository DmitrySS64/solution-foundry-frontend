export interface IUiState {
    isEditable: boolean;
}

export interface IUiActions {
    setEditable: (editable: boolean) => void;
}