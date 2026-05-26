// src/shared/api/fake-diagram-api.ts
// In-memory fake REST API for diagram persistence

import type { DiagramDocument } from '@/modules/diagram/model/types/document.types';

// In-memory store: documentId → DiagramDocument
const store = new Map<string, DiagramDocument>();

// Track seeded flag
let seeded = false;

// Seed with a sample diagram
function seed() {
    if (seeded) return;
    seeded = true;

    const sampleNodes = [
        {
            id: 'node-1',
            type: 'rectangle',
            x: 200,
            y: 150,
            width: 180,
            height: 90,
            rotation: 0,
            label: 'Начало',
            style: {
                fill: '#DBEAFE',
                stroke: '#3B82F6',
                strokeWidth: 2,
                cornerRadius: 8,
                opacity: 1,
            },
            textStyle: {
                fill: '#111827',
                fontSize: 13,
                fontFamily: 'Arial',
                fontStyle: 'normal' as const,
                fontWeight: 'normal' as const,
                align: 'center' as const,
            },
            notation: undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            edges: [{ id: 'edge-1', direction: 'out' as const }],
            renderLabel: true,
        },
        {
            id: 'node-2',
            type: 'rectangle',
            x: 500,
            y: 150,
            width: 180,
            height: 90,
            rotation: 0,
            label: 'Процесс',
            style: {
                fill: '#FEF3C7',
                stroke: '#F59E0B',
                strokeWidth: 2,
                cornerRadius: 8,
                opacity: 1,
            },
            textStyle: {
                fill: '#111827',
                fontSize: 13,
                fontFamily: 'Arial',
                fontStyle: 'normal' as const,
                fontWeight: 'normal' as const,
                align: 'center' as const,
            },
            notation: undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            edges: [
                { id: 'edge-1', direction: 'in' as const },
                { id: 'edge-2', direction: 'out' as const },
            ],
            renderLabel: true,
        },
        {
            id: 'node-3',
            type: 'diamond',
            x: 500,
            y: 350,
            width: 180,
            height: 120,
            rotation: 0,
            label: 'Решение?',
            style: {
                fill: '#E0E7FF',
                stroke: '#6366F1',
                strokeWidth: 2,
                cornerRadius: 4,
                opacity: 1,
            },
            textStyle: {
                fill: '#111827',
                fontSize: 13,
                fontFamily: 'Arial',
                fontStyle: 'normal' as const,
                fontWeight: 'normal' as const,
                align: 'center' as const,
            },
            notation: undefined,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            edges: [
                { id: 'edge-2', direction: 'in' as const },
                { id: 'edge-3', direction: 'out' as const },
            ],
            renderLabel: true,
        },
    ];

    const sampleEdges = [
        {
            id: 'edge-1',
            source: { nodeId: 'node-1', anchorId: 'right', point: { x: 380, y: 195 } },
            target: { nodeId: 'node-2', anchorId: 'left', point: { x: 500, y: 195 } },
            type: 'straight' as const,
            controlPoints: [],
            style: {
                stroke: '#111827',
                strokeWidth: 2,
                startCap: 'none' as const,
                endCap: 'arrow' as const,
            },
            label: '',
            labelStyle: {
                fill: '#111827',
                fontSize: 12,
                fontFamily: 'Arial',
                fontStyle: 'normal' as const,
                fontWeight: 'normal' as const,
            },
        },
        {
            id: 'edge-2',
            source: { nodeId: 'node-2', anchorId: 'bottom', point: { x: 590, y: 240 } },
            target: { nodeId: 'node-3', anchorId: 'top', point: { x: 590, y: 350 } },
            type: 'straight' as const,
            controlPoints: [],
            style: {
                stroke: '#111827',
                strokeWidth: 2,
                startCap: 'none' as const,
                endCap: 'arrow' as const,
            },
            label: '',
            labelStyle: {
                fill: '#111827',
                fontSize: 12,
                fontFamily: 'Arial',
                fontStyle: 'normal' as const,
                fontWeight: 'normal' as const,
            },
        },
        {
            id: 'edge-3',
            source: { nodeId: 'node-3', anchorId: 'right', point: { x: 680, y: 410 } },
            target: { nodeId: 'node-1', anchorId: 'bottom', point: { x: 290, y: 240 } },
            type: 'bezier' as const,
            controlPoints: [{ x: 800, y: 410 }, { x: 800, y: 100 }, { x: 290, y: 100 }],
            style: {
                stroke: '#EF4444',
                strokeWidth: 2,
                dash: [6, 3],
                startCap: 'none' as const,
                endCap: 'arrow' as const,
            },
            label: 'Нет',
            labelStyle: {
                fill: '#EF4444',
                fontSize: 11,
                fontFamily: 'Arial',
                fontStyle: 'normal' as const,
                fontWeight: 'normal' as const,
            },
        },
    ];

    store.set('sample', { nodes: sampleNodes, edges: sampleEdges });
}

seed();

export const fakeDiagramApi = {
    async get(id: string): Promise<DiagramDocument | null> {
        seed();
        return store.get(id) ?? null;
    },

    async save(id: string, document: DiagramDocument): Promise<DiagramDocument> {
        seed();
        store.set(id, JSON.parse(JSON.stringify(document)));
        return document;
    },

    async delete(id: string): Promise<boolean> {
        return store.delete(id);
    },

    async list(): Promise<string[]> {
        seed();
        return Array.from(store.keys());
    },
};
