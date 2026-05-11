// ============ Базовые типы ============

interface IBaseElement {
    id: string;
    type: string;
    position: { x: number; y: number };
    createdAt: number;
    updatedAt: number;
}

// ============ Определение свойства для редактирования ============

interface IEditableProperty<T = any> {
    name: string;
    label: string;
    type: 'text' | 'color' | 'number' | 'range' | 'boolean' | 'select';
    min?: number;
    max?: number;
    step?: number;
    options?: { value: string; label: string }[];
    defaultValue: T;
}

// ============ Универсальные пропсы для рендера ============

interface IRenderProps {
    isSelected: boolean;
    isConnecting: boolean;
    onDragEnd: (id: string, x: number, y: number) => void;
    onClick: (id: string) => void;
    onMouseDown?: (id: string) => void;
    onMouseUp?: (id: string) => void;
    onDblClick?: (id: string) => void;
}

interface IEdgeRenderProps extends IRenderProps {
    fromPosition?: { x: number; y: number };
    toPosition?: { x: number; y: number };
    onDelete?: (id: string) => void;
}

// ============ Определение типа элемента ============

interface IElementDefinition<T extends IBaseElement = any> {
    // Метаданные
    type: string;
    name: string;
    icon: string;
    // Фабрика создания
    create: (position: { x: number; y: number }, options?: Record<string, unknown>) => T;
    // Рендер на холсте
    render: (element: T, props: IRenderProps | IEdgeRenderProps) => React.ReactNode;
    // Редактируемые свойства (только то, что нужно для этого типа)
    editableProperties: IEditableProperty[];
    // Получение актуальных значений свойств (для инспектора)
    getPropertyValue: (element: T, propName: string) => unknown;
    // Обновление свойства
    setPropertyValue: (element: T, propName: string, value: unknown) => T;
}

// ============ Регистр типов элементов ============

class ElementRegistry {
    private definitions = new Map<string, IElementDefinition>();

    register<T extends IBaseElement>(definition: IElementDefinition<T>): void {
        this.definitions.set(definition.type, definition);
    }

    get(type: string): IElementDefinition | undefined {
        return this.definitions.get(type);
    }

    getAll(): IElementDefinition[] {
        return Array.from(this.definitions.values());
    }

    getEditableProperties(type: string): IEditableProperty[] {
        return this.definitions.get(type)?.editableProperties || [];
    }

    createElement(type: string, position: { x: number; y: number }, options?: Record<string, unknown>): IBaseElement | null {
        const definition = this.definitions.get(type);
        if (!definition) return null;
        return definition.create(position, options);
    }
}

export const elementRegistry = new ElementRegistry();
export type {
    IBaseElement,
    IEditableProperty,
    IElementDefinition,
    IRenderProps,
    IEdgeRenderProps
}
