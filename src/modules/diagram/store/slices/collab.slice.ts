import type {IDiagramSlice, ICollabState, ICollabActions} from "@/modules/diagram/store/slices/types/store.types.ts";

export const createCollabStateSlice = (): ICollabState  => ({
    yjsContext: null,
    localUserId: undefined,
    remoteUsers: new Map(),
})

export const createCollabActionsSlice: IDiagramSlice<ICollabActions> = (set) => ({
    setRemoteUsers: (users) => set({ remoteUsers: users }),
    setLocalUserId: (id) => set({localUserId: id})
})
