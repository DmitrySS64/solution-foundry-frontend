interface ConnectionState {
    active: boolean

    fromNodeId?: string
    fromAnchor?: string

    x: number
    y: number
}

interface ConnectionActions {
    startConnection: (
        nodeId: string,
        anchor: string,
    ) => void

    updateConnection: (
        x: number,
        y: number,
    ) => void

    finishConnection: () => void
}

export interface ConnectionSlice {
    connection: ConnectionState
    connectionActions: ConnectionActions
}