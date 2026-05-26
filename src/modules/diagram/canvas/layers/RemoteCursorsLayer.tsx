// modules/diagram/canvas/layers/RemoteCursorsLayer.tsx
import { Layer } from 'react-konva';
import { useEditorStore } from '@/modules/diagram/store/editor.store';
import { RemoteCursor } from '../components/RemoteCursor';
import { RemoteSelectionHighlight } from '../components/RemoteSelectionHighlight';
import { useShallow } from 'zustand/shallow';
import { useMemo } from 'react';

interface Props {
    viewport: { x: number; y: number; zoom: number };
}

export const RemoteCursorsLayer = ({ viewport }: Props) => {
    const { remoteUsers, localUserId, document } = useEditorStore(
        useShallow(state => ({
            remoteUsers: state.remoteUsers,
            localUserId: state.localUserId,
            document: state.document,
        }))
    );

    // Фильтруем: показываем только чужие курсоры
    const otherUsers = useMemo(() =>
            Array.from(remoteUsers.values()).filter(u => u.userId !== localUserId),
        [remoteUsers, localUserId]
    );

    const hasActiveUsers = useMemo(() =>
            Array.from(remoteUsers.values()).some(u =>
                u.userId !== localUserId &&
                u.cursor &&
                Date.now() - u.cursor.timestamp < 10000 // активен последние 10 сек
            ),
        [remoteUsers, localUserId]
    );

    if (otherUsers.length === 0 || !hasActiveUsers) return null;

    return (
        <Layer listening={false}>
            {/* Сначала подсветка выделений (под курсорами) */}
            {otherUsers.map(user => (
                <RemoteSelectionHighlight
                    key={`highlight-${user.userId}`}
                    user={user}
                    nodes={document?.nodes ?? []}
                    viewport={viewport}
                />
            ))}

            {/* Затем курсоры */}
            {otherUsers.map(user => (
                <RemoteCursor
                    key={`cursor-${user.userId}`}
                    user={user}
                    viewport={viewport}
                />
            ))}
        </Layer>
    );
};