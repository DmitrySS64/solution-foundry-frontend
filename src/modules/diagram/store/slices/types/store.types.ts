import type { IDocumentState, IDocumentActions } from "./document.sTypes";
import type {ISelectionState, ISelectionActions} from "./selection.sTypes";
import type { IViewportState, IViewportActions } from "./viewport.sTypes";
import type { IInteractionState, IInteractionActions } from "./interaction.sTypes";
import type { IUiState, IUiActions } from "./ui.sTypes";
import type {ICollabState, ICollabActions} from "./collab.sTypes";
import type { IHistoryState, IHistoryActions } from "./history.sTypes";
import type { StateCreator } from "zustand";

type IDiagramState = IDocumentState & ISelectionState & IViewportState &
    IInteractionState & IUiState & ICollabState & IHistoryState;

type IDiagramActions = IDocumentActions & ISelectionActions & IViewportActions &
    IInteractionActions & IUiActions & ICollabActions & IHistoryActions;

type IDiagramStore = IDiagramState & { actions: IDiagramActions };

type IDiagramSlice<T> = StateCreator<
    IDiagramStore,
    [['zustand/immer', never]], // ← критично для immer
    [],
    T
>;

export type {
    IDocumentState, IDocumentActions,
    ISelectionState, ISelectionActions,
    IViewportState, IViewportActions,
    IInteractionState, IInteractionActions,
    IUiState, IUiActions,
    ICollabState, ICollabActions,
    IHistoryState, IHistoryActions,
    IDiagramStore, IDiagramSlice
}