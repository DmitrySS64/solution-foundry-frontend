// modules/diagram/model/types/collab.types.ts

export type CollabUserState = {
    userId: string;
    name: string;
    color: string; // hex или tailwind-класс
    avatar?: string;

    // Позиция курсора в мировых координатах (относительно контента, не экрана)
    cursor?: {
        x: number;
        y: number;
        timestamp: number;
    };

    // Выбранные элементы
    selection?: {
        nodeIds: string[];
        edgeIds: string[];
    };

    // Текущий режим взаимодействия
    interaction?: 'idle' | 'dragging' | 'editing' | 'connecting';

    // Дополнительно: фокус на поле ввода
    editingField?: {
        nodeId: string;
        fieldName: string; // 'label', 'description', etc.
    };
};

export type AwarenessUpdate = {
    added: number[];    // clientIDs новых пользователей
    updated: number[];  // clientIDs обновившихся пользователей
    removed: number[];  // clientIDs отключившихся пользователей
};