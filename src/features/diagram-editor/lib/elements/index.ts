import { elementRegistry } from '../types';
import { shapeDefinition } from './shape';
import { edgeDefinition } from './edge';
//import { zoneDefinition } from './zone'; // можно добавить позже

// Регистрация всех типов элементов
export const registerAllElements = () => {
    elementRegistry.register(shapeDefinition);
    elementRegistry.register(edgeDefinition);
    // elementRegistry.register(zoneDefinition);
};

export { shapeDefinition, edgeDefinition };