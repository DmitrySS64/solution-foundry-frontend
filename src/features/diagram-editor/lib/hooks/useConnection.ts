import { useState, useCallback } from 'react';

export const useConnection = (addEdge: (fromId: string, toId: string) => void) => {
    const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const startConnection = useCallback((id: string) => setConnectingFrom(id), []);
    const endConnection = useCallback((toId: string) => {
        if (connectingFrom && connectingFrom !== toId) {
            addEdge(connectingFrom, toId);
        }
        setConnectingFrom(null);
    }, [connectingFrom, addEdge]);

    return { connectingFrom, mousePosition, setMousePosition, startConnection, endConnection };
};