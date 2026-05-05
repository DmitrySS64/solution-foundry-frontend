import React from 'react';
import { elementRegistry, type IBaseElement, type IEditableProperty } from "@features/diagram-editor/lib/types.ts";


interface IInspectorProps {
    element: IBaseElement | null;
    elementType: string;          // это строка, а не объект!
    onChange: (updates: Record<string, unknown>) => void;
    readOnly?: boolean;
}

const Inspector: React.FC<IInspectorProps> = ({ element, elementType, onChange, readOnly }) => {
    if (!element) {
        return <div className="text-gray-500 text-center py-8">Выберите элемент на схеме</div>;
    }

    const definition = elementRegistry.get(elementType); // исправлено: elementType, а не elementType.type
    if (!definition) {
        return <div className="text-gray-500 text-center py-8">Неизвестный тип элемента</div>;
    }

    const properties = [...definition.editableProperties];

    // Динамические свойства из notationSpecific (если есть)
    if ('notationSpecific' in element && element.notationSpecific) {
        Object.keys(element.notationSpecific).forEach(key => {
            properties.push({
                name: `notationSpecific.${key}`,
                label: key,
                type: typeof element.notationSpecific?.[key] === 'boolean' ? 'boolean' : 'text',
                defaultValue: element.notationSpecific?.[key],
            } as IEditableProperty);
        });
    }

    const getCurrentValue = (prop: IEditableProperty) => {
        return definition.getPropertyValue(element, prop.name) ?? prop.defaultValue;
    };

    const handleChange = (prop: IEditableProperty, value: unknown) => {
        onChange({ [prop.name]: value });
    };

    const renderInput = (prop: IEditableProperty) => {
        const value = getCurrentValue(prop);
        switch (prop.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={value as string}
                        onChange={(e) => handleChange(prop, e.target.value)}
                        className="mt-1 w-full px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700"
                        disabled={readOnly}
                    />
                );
            case 'color':
                return (
                    <input
                        type="color"
                        value={value as string}
                        onChange={(e) => handleChange(prop, e.target.value)}
                        className="mt-1 w-full h-10 border rounded-md"
                        disabled={readOnly}
                    />
                );
            case 'range':
                return (
                    <div>
                        <input
                            type="range"
                            min={prop.min}
                            max={prop.max}
                            step={prop.step || 1}
                            value={value as number}
                            onChange={(e) => handleChange(prop, Number(e.target.value))}
                            className="mt-1 w-full"
                            disabled={readOnly}
                        />
                        <div className="text-xs text-gray-500 mt-1">{value}px</div>
                    </div>
                );
            default:
                return <div>Неизвестный тип</div>;
        }
    };

    return (
        <div className="space-y-4">
            {properties.map(prop => (
                <div key={prop.name}>
                    <label className="text-sm font-medium">{prop.label}</label>
                    {renderInput(prop)}
                </div>
            ))}
        </div>
    );
};

export default Inspector;