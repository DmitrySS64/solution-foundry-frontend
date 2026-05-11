import { useState, useCallback } from 'react';
import { elementRegistry, type IBaseElement } from '../types';

// Обновление элементов
//const updateElements = useCallback((newElements: IBaseElement[]) => {
//    setElements(newElements);
//    onChange?.(newElements);
//}, [onChange]);

// Добавление элемента
//const addElement = useCallback((type: string) => {
//    const newElement = elementRegistry.createElement(type, {
//        x: 200 + Math.random() * 100,
//        y: 200 + Math.random() * 100,
//    });
//    if (newElement) {
//        updateElements([...elements, newElement]);
//        setSelectedId(newElement.id);
//    }
//}, [elements, updateElements]);

// Обновление свойств элемента
//const updateElement = useCallback((id: string, updates: Record<string, any>) => {
//    const element = elements.find(el => el.id === id);
//    if (!element) return;

//    const definition = elementRegistry.get(element.type);
//    if (!definition) return;

//    let updatedElement = { ...element };
//    for (const [key, value] of Object.entries(updates)) {
//        updatedElement = definition.setPropertyValue(updatedElement, key, value);
//    }
//    updatedElement.updatedAt = Date.now();

//    updateElements(elements.map(el => el.id === id ? updatedElement : el));
//}, [elements, updateElements]);

// Удаление элемента
//const deleteElement = useCallback(() => {
//    if (!selectedId) return;
//    const newElements = elements.filter(el => {
//        if (el.id === selectedId) return false;
//        if (el.type === 'edge') {
//            const edge = el as any;
//            return edge.fromId !== selectedId && edge.toId !== selectedId;
//        }
//        return true;
//    });
//    updateElements(newElements);
//    setSelectedId(null);
//    setConnectingFrom(null);
//}, [selectedId, elements, updateElements]);


export const useDiagramElements = (initialElements: IBaseElement[] = []) => {
    const [elements, setElements] = useState<IBaseElement[]>(initialElements);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const updateElements = useCallback((newElements: IBaseElement[]) => {
        setElements(newElements);
    }, []);

    const addElement = useCallback((type: string, position: { x: number; y: number }) => {
        const newElement = elementRegistry.createElement(type, position);
        if (newElement) {
            setElements(prev => [...prev, newElement]);
            setSelectedId(newElement.id);
            return newElement;
        }
        return null;
    }, []);

    const addEdge = useCallback((fromId: string, toId: string) => {
        const edge = elementRegistry.createElement('edge', { x: 0, y: 0 }, { fromId, toId });
        if (edge) {
            setElements(prev => [...prev, edge]);
            return edge;
        }
        return null;
    }, []);

    const updateElement = useCallback((id: string, updates: Record<string, any>) => {
        setElements(prev =>
            prev.map(el => {
                if (el.id !== id) return el;
                const def = elementRegistry.get(el.type);
                if (!def) return el;
                let updated = { ...el };
                for (const [key, val] of Object.entries(updates)) {
                    updated = def.setPropertyValue(updated, key, val);
                }
                return { ...updated, updatedAt: Date.now() };
            })
        );
    }, []);

    const deleteElement = useCallback((id: string) => {
        setElements(prev =>
            prev.filter(el => {
                if (el.id === id) return false;
                if (el.type === 'edge') {
                    const edge = el as any;
                    return edge.fromId !== id && edge.toId !== id;
                }
                return true;
            })
        );
    }, []);

    return {
        elements,
        selectedId,
        setSelectedId,
        updateElements,
        addElement,
        addEdge,
        updateElement,
        deleteElement
    };
};