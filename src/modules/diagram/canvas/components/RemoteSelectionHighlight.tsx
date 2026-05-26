// modules/diagram/canvas/components/RemoteSelectionHighlight.tsx
import { Rect } from 'react-konva';
import type { CollabUserState } from '@/modules/diagram/model/types/collab.types';
import type { DiagramNode } from '@/modules/diagram/model/types/node.types';
import { useEffect, useState } from 'react';

interface Props {
    user: CollabUserState;
    nodes: DiagramNode[];
    viewport: { x: number; y: number; zoom: number };
}

export const RemoteSelectionHighlight = ({ user, nodes }: Props) => {
    if (!user.selection || !user.cursor) return null;

    const isActive = Date.now() - user.cursor.timestamp < 5000;
    if (!isActive) return null;

    const selectedNodes = nodes.filter(n =>
        user.selection?.nodeIds?.includes(n.id)
    );

    if (selectedNodes.length === 0) return null;

    return (
        <GroupList user={user} selectedNodes={selectedNodes} />
    );
};

// Выделяем в отдельный компонент для анимации
import { Group } from 'react-konva';

const GroupList = ({ user, selectedNodes }: { user: CollabUserState; selectedNodes: DiagramNode[] }) => {
    const [dashOffset, setDashOffset] = useState(0);

    // Анимированный dash-паттерн (бегущая пунктирная линия)
    useEffect(() => {
        let frameId: number;
        const animate = () => {
            setDashOffset(prev => (prev + 0.5) % 16);
            frameId = requestAnimationFrame(animate);
        };
        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, []);

    return (
        <Group listening={false}>
            {selectedNodes.map(node => (
                <Group key={`${user.userId}-${node.id}`}>
                    {/* Внешняя подсветка (мягкая тень) */}
                    <Rect
                        x={node.x - 6}
                        y={node.y - 6}
                        width={node.width + 12}
                        height={node.height + 12}
                        cornerRadius={6}
                        fill={user.color}
                        opacity={0.12}
                        listening={false}
                    />

                    {/* Основная пунктирная рамка */}
                    <Rect
                        x={node.x - 4}
                        y={node.y - 4}
                        width={node.width + 8}
                        height={node.height + 8}
                        cornerRadius={5}
                        stroke={user.color}
                        strokeWidth={2.5}
                        dash={[8, 4]}
                        dashOffset={dashOffset}
                        opacity={0.75}
                        listening={false}
                    />

                    {/* Метка имени пользователя в углу */}
                    {user.name && (
                        <Group
                            x={node.x - 4}
                            y={node.y - 18}
                            listening={false}
                        >
                            <Rect
                                x={0}
                                y={0}
                                width={user.name.length * 7 + 8}
                                height={14}
                                cornerRadius={3}
                                fill={user.color}
                                opacity={0.85}
                                listening={false}
                            />
                        </Group>
                    )}
                </Group>
            ))}
        </Group>
    );
};
