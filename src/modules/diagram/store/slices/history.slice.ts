import type {IDiagramSlice, IHistoryState, IHistoryActions} from "@/modules/diagram/store/slices/types/store.types.ts";
import {createEmptyHistory, redoSnapshot, undoSnapshot} from "@/modules/diagram/store/history/documentHistory.ts";

export const createHistoryStateSlice = (): IHistoryState  => ({
    history: createEmptyHistory()
})

export const createHistoryActionsSlice: IDiagramSlice<IHistoryActions> = (set) => ({
    undo: () => set((state) => {
        if (state.yjsContext) {
            const undoManager = (window as any).diagramUndoManager;
            if (undoManager && undoManager.undoStack.length > 0) undoManager.undo();
        } else {
            const result = undoSnapshot(state.history, state.document);
            if (!result.nextSnapshot) return state;
            state.history = result.nextHistory;
            state.document = result.nextSnapshot;
        }
    }),
    redo: () => set((state) => {
        if (state.yjsContext) {
            const undoManager = (window as any).diagramUndoManager;
            if (undoManager && undoManager.redoStack.length > 0) undoManager.redo();
        } else {
            const result = redoSnapshot(state.history, state.document);
            if (!result.nextSnapshot) return;
            state.history = result.nextHistory;
            state.document = result.nextSnapshot;
        }
    }),
})
