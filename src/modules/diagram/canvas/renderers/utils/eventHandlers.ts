// modules/diagram/canvas/renderers/utils/eventHandlers.ts
import type Konva from 'konva';

/** Универсальный обработчик для остановки всплытия событий */
export const stopEventPropagation = (e: Event | React.SyntheticEvent) => {
    e.stopPropagation();
};

/** Обработчик для Konva-событий */
export const stopKonvaPropagation = (e: Konva.KonvaEventObject<MouseEvent>) => {
    e.cancelBubble = true;
};

/** Проверка, является ли элемент редактируемым полем ввода */
export const isEditableElement = (target: EventTarget | null): boolean => {
    if (!target || !(target instanceof HTMLElement)) return false;
    const tag = target.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || target.isContentEditable;
};

/** Фабрика обработчика для запуска редактирования */
export const createEditStartHandler = (
    onStart: () => void,
    isEditable: boolean
) => (e?: { cancelBubble?: () => void }) => {
    e?.cancelBubble?.();
    if (isEditable) onStart();
};