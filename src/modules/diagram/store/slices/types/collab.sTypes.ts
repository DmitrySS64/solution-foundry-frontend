import type { CollabUserState } from "@/modules/diagram/model/types/collab.types";
import type * as Y from 'yjs';

export interface ICollabState {
    yjsContext?: { ydoc: Y.Doc; yNodesMap: Y.Map<any>; yEdgesMap: Y.Map<any> } | null;
    localUserId?: string;
    remoteUsers: Map<number, CollabUserState>;
}

export interface ICollabActions {
    setRemoteUsers: (users: Map<number, CollabUserState>) => void;
    setLocalUserId: (id: string | undefined) => void;
}