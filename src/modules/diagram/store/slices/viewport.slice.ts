import type {IDiagramSlice, IViewportState, IViewportActions} from "@/modules/diagram/store/slices/types/store.types.ts";

export const createViewportStateSlice = (): IViewportState  => ({
    viewport: { x: 0, y: 0, zoom: 1 },
})

export const createViewportActionsSlice: IDiagramSlice<IViewportActions> = (set) => ({
    setViewport: (x, y, zoom) => set((draft) => {
        draft.viewport = { x, y, zoom };
    }),
})