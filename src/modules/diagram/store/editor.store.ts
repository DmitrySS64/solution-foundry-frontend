//modules/diagram/store/editor.store
import {immer} from "zustand/middleware/immer";
import {create} from "zustand";
import {createDocumentActionsSlice, createDocumentStateSlice} from "./slices/document.slice.ts";
import type {IDiagramStore} from "@/modules/diagram/store/slices/types/store.types.ts";
import {
    createSelectionActionsSlice,
    createSelectionStateSlice
} from "@/modules/diagram/store/slices/selection.slice.ts";
import {createViewportActionsSlice, createViewportStateSlice} from "./slices/viewport.slice.ts";
import {
    createInteractionActionsSlice,
    createInteractionStateSlice
} from "@/modules/diagram/store/slices/interaction.slice.ts";
import {createUiActionsSlice, createUiStateSlice} from "@/modules/diagram/store/slices/ui.slice.ts";
import {createCollabActionsSlice, createCollabStateSlice} from "@/modules/diagram/store/slices/collab.slice.ts";
import {createHistoryActionsSlice, createHistoryStateSlice} from "@/modules/diagram/store/slices/history.slice.ts";

export const useEditorStore = create<IDiagramStore>()(
    immer((set, get, api) => {
        const state = {
            ...createDocumentStateSlice(),
            ...createSelectionStateSlice(),
            ...createViewportStateSlice(),
            ...createInteractionStateSlice(),
            ...createUiStateSlice(),
            ...createCollabStateSlice(),
            ...createHistoryStateSlice(),
        }
        const actions = {
            ...createDocumentActionsSlice(set, get, api),
            ...createSelectionActionsSlice(set, get, api),
            ...createViewportActionsSlice(set, get, api),
            ...createInteractionActionsSlice(set, get, api),
            ...createUiActionsSlice(set, get, api),
            ...createCollabActionsSlice(set, get, api),
            ...createHistoryActionsSlice(set, get, api),
        }
        return {...state, actions}
    })
)

