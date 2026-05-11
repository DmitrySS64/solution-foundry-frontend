import type {DiagramDocument} from '../../model/types/document.types'

const MAX_HISTORY = 50

export type DocumentSnapshot = DiagramDocument

export interface DocumentHistoryState {
    past: DocumentSnapshot[]
    future: DocumentSnapshot[]
}

export const createEmptyHistory = (): DocumentHistoryState => ({
    past: [],
    future: [],
})

const deepCloneDocument = (doc: DiagramDocument): DocumentSnapshot => {
    // DiagramDocument is plain data (nodes/edges) -> JSON clone is OK
    // (Konva refs are not stored in state)
    return JSON.parse(JSON.stringify(doc)) as DocumentSnapshot
}

export const pushPastSnapshot = (
    state: DocumentHistoryState,
    snapshot: DocumentSnapshot,
): DocumentHistoryState => {
    const past = [...state.past, deepCloneDocument(snapshot)]

    // keep last MAX_HISTORY steps
    const trimmedPast = past.length > MAX_HISTORY
        ? past.slice(past.length - MAX_HISTORY)
        : past

    return {
        past: trimmedPast,
        future: [],
    }
}

export const undoSnapshot = (
    state: DocumentHistoryState,
    currentSnapshot: DocumentSnapshot,
): {
    nextHistory: DocumentHistoryState
    nextSnapshot: DocumentSnapshot | null
} => {
    if (state.past.length === 0) {
        return {
            nextHistory: state,
            nextSnapshot: null,
        }
    }

    const past = [...state.past]
    const previous = past.pop()!

    return {
        nextHistory: {
            past,
            future: [deepCloneDocument(currentSnapshot), ...state.future],
        },
        nextSnapshot: previous,
    }
}

export const redoSnapshot = (
    state: DocumentHistoryState,
    currentSnapshot: DocumentSnapshot,
): {
    nextHistory: DocumentHistoryState
    nextSnapshot: DocumentSnapshot | null
} => {
    if (state.future.length === 0) {
        return {
            nextHistory: state,
            nextSnapshot: null,
        }
    }

    const future = [...state.future]
    const next = future.shift()!

    return {
        nextHistory: {
            past: [...state.past, deepCloneDocument(currentSnapshot)],
            future,
        },
        nextSnapshot: next,
    }
}

