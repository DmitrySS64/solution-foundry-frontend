// modules/diagram/canvas/components/RemoteCursor.tsx
import { Group, Line, Text, Circle, Rect } from 'react-konva';
import type { CollabUserState } from '@/modules/diagram/model/types/collab.types';

interface Props {
    user: CollabUserState;
    viewport: { x: number; y: number; zoom: number };
    showName?: boolean;
}

export const RemoteCursor = ({ user, viewport, showName = true }: Props) => {
    if (!user.cursor) return null;

    // Преобразуем мировые координаты в экранные
    // viewport.x/y — это смещение в экранных координатах делённое на zoom
    // worldX = (screenX - viewport.x) / viewport.zoom
    // => screenX = worldX * viewport.zoom + viewport.x
    const screenX = user.cursor.x * viewport.zoom + viewport.x;
    const screenY = user.cursor.y * viewport.zoom + viewport.y;

    const age = Date.now() - user.cursor.timestamp;
    const isActive = age < 5000;
    if (!isActive) return null;

    // Плавное затухание за последние 2 секунды
    const fadeOpacity = age > 3000 ? Math.max(0, 1 - (age - 3000) / 2000) : 1;

    // Размеры с учётом зума (но не слишком мелко)
    const effectiveZoom = Math.max(0.5, Math.min(viewport.zoom, 2));
    const cursorSize = 18 * effectiveZoom;
    const fontSize = 11 * effectiveZoom;

    // Стрелка-курсор (заливка)
    const arrow = [
        0, 0,
        cursorSize * 0.6, cursorSize * 0.7,
        cursorSize * 0.25, cursorSize * 0.7,
        cursorSize * 0.15, cursorSize,
        0, cursorSize * 0.85,
    ];

    const labelOffset = cursorSize * 0.7;
    const labelPadding = 4 * effectiveZoom;

    return (
        <Group x={screenX} y={screenY} opacity={fadeOpacity * 0.9}>
            {/* Тень стрелки */}
            <Line
                points={[1.5, 1.5, ...arrow.slice(2)]}
                fill="rgba(0,0,0,0.15)"
                closed
                listening={false}
            />

            {/* Основная стрелка */}
            <Line
                points={arrow}
                fill={user.color}
                stroke="white"
                strokeWidth={1.5 * effectiveZoom}
                closed
                listening={false}
                shadowColor="rgba(0,0,0,0.2)"
                shadowBlur={3 * effectiveZoom}
                shadowOffset={{ x: 1, y: 1 }}
            />

            {/* Подпись пользователя */}
            {showName && user.name && (
                <Group x={labelOffset} y={cursorSize * 0.55}>
                    {/* Фон под текстом */}
                    <Rect
                        x={-labelPadding}
                        y={-labelPadding}
                        width={fontSize * user.name.length * 0.6 + labelPadding * 2}
                        height={fontSize + labelPadding * 2}
                        cornerRadius={3 * effectiveZoom}
                        fill={user.color}
                        opacity={0.9}
                        listening={false}
                    />
                    <Text
                        text={user.name}
                        fontSize={fontSize}
                        fontFamily="Inter, Arial, sans-serif"
                        fill="white"
                        fontStyle="600"
                        listening={false}
                    />
                </Group>
            )}

            {/* Индикатор режима взаимодействия */}
            {user.interaction && user.interaction !== 'idle' && (
                <Circle
                    x={-cursorSize * 0.3}
                    y={-cursorSize * 0.15}
                    radius={4 * effectiveZoom}
                    fill={getInteractionColor(user.interaction)}
                    stroke="white"
                    strokeWidth={1.2 * effectiveZoom}
                    listening={false}
                    shadowColor="rgba(0,0,0,0.3)"
                    shadowBlur={2 * effectiveZoom}
                />
            )}

            {/* Точка клика при перетаскивании */}
            {user.interaction === 'dragging' && user.cursor && (
                <Circle
                    x={0}
                    y={0}
                    radius={6 * effectiveZoom}
                    fill="none"
                    stroke={user.color}
                    strokeWidth={2 * effectiveZoom}
                    dash={[3 * effectiveZoom, 2 * effectiveZoom]}
                    opacity={0.6}
                    listening={false}
                />
            )}
        </Group>
    );
};

const getInteractionColor = (mode: CollabUserState['interaction']) => {
    switch (mode) {
        case 'dragging': return '#EF4444';
        case 'editing': return '#10B981';
        case 'connecting': return '#F59E0B';
        default: return '#6B7280';
    }
};
