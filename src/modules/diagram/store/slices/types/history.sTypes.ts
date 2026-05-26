import type { DiagramDocument } from "@/modules/diagram/model/types";

export interface IHistoryState {
    history: { past: DiagramDocument[]; future: DiagramDocument[] };
}

export interface IHistoryActions {
    undo: () => void;
    redo: () => void;
}