// src/shared/api/vite-middleware.ts
// Vite plugin that serves a fake REST API for diagram persistence

import type { Plugin, ViteDevServer } from 'vite';
import type { DiagramDocument } from '@/modules/diagram/model/types/document.types';

// In-memory store
const store = new Map<string, DiagramDocument>();

// Seed with a sample diagram
function seed() {
    if (store.has('sample')) return;

    const sampleNodes = [
        {
            id: 'node-1',
            type: 'rectangle',
            x: 200, y: 150,
            width: 180, height: 90,
            rotation: 0,
            label: 'Начало',
            style: { fill: '#DBEAFE', stroke: '#3B82F6', strokeWidth: 2, cornerRadius: 8, opacity: 1 },
            textStyle: { fill: '#111827', fontSize: 13, fontFamily: 'Arial', fontStyle: 'normal' as const, fontWeight: 'normal' as const, align: 'center' as const },
            notation: undefined,
            createdAt: Date.now(), updatedAt: Date.now(),
            edges: [{ id: 'edge-1', direction: 'out' as const }],
            renderLabel: true,
        },
        {
            id: 'node-2',
            type: 'rectangle',
            x: 500, y: 150,
            width: 180, height: 90,
            rotation: 0,
            label: 'Процесс',
            style: { fill: '#FEF3C7', stroke: '#F59E0B', strokeWidth: 2, cornerRadius: 8, opacity: 1 },
            textStyle: { fill: '#111827', fontSize: 13, fontFamily: 'Arial', fontStyle: 'normal' as const, fontWeight: 'normal' as const, align: 'center' as const },
            notation: undefined,
            createdAt: Date.now(), updatedAt: Date.now(),
            edges: [
                { id: 'edge-1', direction: 'in' as const },
                { id: 'edge-2', direction: 'out' as const },
            ],
            renderLabel: true,
        },
        {
            id: 'node-3',
            type: 'diamond',
            x: 500, y: 350,
            width: 180, height: 120,
            rotation: 0,
            label: 'Решение?',
            style: { fill: '#E0E7FF', stroke: '#6366F1', strokeWidth: 2, cornerRadius: 4, opacity: 1 },
            textStyle: { fill: '#111827', fontSize: 13, fontFamily: 'Arial', fontStyle: 'normal' as const, fontWeight: 'normal' as const, align: 'center' as const },
            notation: undefined,
            createdAt: Date.now(), updatedAt: Date.now(),
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
            style: { stroke: '#111827', strokeWidth: 2, startCap: 'none' as const, endCap: 'arrow' as const },
            label: '',
            labelStyle: { fill: '#111827', fontSize: 12, fontFamily: 'Arial', fontStyle: 'normal' as const, fontWeight: 'normal' as const },
        },
        {
            id: 'edge-2',
            source: { nodeId: 'node-2', anchorId: 'bottom', point: { x: 590, y: 240 } },
            target: { nodeId: 'node-3', anchorId: 'top', point: { x: 590, y: 350 } },
            type: 'straight' as const,
            controlPoints: [],
            style: { stroke: '#111827', strokeWidth: 2, startCap: 'none' as const, endCap: 'arrow' as const },
            label: '',
            labelStyle: { fill: '#111827', fontSize: 12, fontFamily: 'Arial', fontStyle: 'normal' as const, fontWeight: 'normal' as const },
        },
        {
            id: 'edge-3',
            source: { nodeId: 'node-3', anchorId: 'right', point: { x: 680, y: 410 } },
            target: { nodeId: 'node-1', anchorId: 'bottom', point: { x: 290, y: 240 } },
            type: 'bezier' as const,
            controlPoints: [{ x: 800, y: 410 }, { x: 800, y: 100 }, { x: 290, y: 100 }],
            style: { stroke: '#EF4444', strokeWidth: 2, dash: [6, 3], startCap: 'none' as const, endCap: 'arrow' as const },
            label: 'Нет',
            labelStyle: { fill: '#EF4444', fontSize: 11, fontFamily: 'Arial', fontStyle: 'normal' as const, fontWeight: 'normal' as const },
        },
    ];

    store.set('sample', { nodes: sampleNodes, edges: sampleEdges });
}

export function fakeDiagramApiPlugin(): Plugin {
    return {
        name: 'fake-diagram-api',
        configureServer(server: ViteDevServer) {
            seed();

            // GET /api/diagrams — list all document IDs
            server.middlewares.use('/api/diagrams', (req, res, next) => {
                if (req.method === 'GET' && !req.url?.includes('/api/diagrams/')) {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ documents: Array.from(store.keys()) }));
                    return;
                }
                next();
            });

            // GET /api/diagrams/:id — get document
            server.middlewares.use('/api/diagrams/', (req, res, next) => {
                const url = new URL(req.url!, `http://localhost`);
                const id = decodeURIComponent(url.pathname.replace('/api/diagrams/', ''));

                if (!id) {
                    next();
                    return;
                }

                if (req.method === 'GET') {
                    seed();
                    const doc = store.get(id);
                    res.setHeader('Content-Type', 'application/json');
                    if (doc) {
                        res.statusCode = 200;
                        res.end(JSON.stringify(doc));
                    } else {
                        res.statusCode = 404;
                        res.end(JSON.stringify({ error: 'Document not found' }));
                    }
                    return;
                }

                if (req.method === 'PUT') {
                    const chunks: Buffer[] = [];
                    req.on('data', chunk => chunks.push(Buffer.from(chunk)));
                    req.on('end', () => {
                        try {
                            const body = JSON.parse(Buffer.concat(chunks).toString());
                            store.set(id, body as DiagramDocument);
                            res.setHeader('Content-Type', 'application/json');
                            res.statusCode = 200;
                            res.end(JSON.stringify({ ok: true, id }));
                        } catch (e) {
                            res.statusCode = 400;
                            res.end(JSON.stringify({ error: 'Invalid JSON' }));
                        }
                    });
                    return;
                }

                if (req.method === 'DELETE') {
                    const deleted = store.delete(id);
                    res.setHeader('Content-Type', 'application/json');
                    res.statusCode = 200;
                    res.end(JSON.stringify({ ok: deleted }));
                    return;
                }

                if (req.method === 'POST') {
                    const chunks: Buffer[] = [];
                    req.on('data', chunk => chunks.push(Buffer.from(chunk)));
                    req.on('end', () => {
                        try {
                            const body = JSON.parse(Buffer.concat(chunks).toString());
                            const newId = id || `diagram-${Date.now()}`;
                            store.set(newId, body as DiagramDocument);
                            res.setHeader('Content-Type', 'application/json');
                            res.statusCode = 201;
                            res.end(JSON.stringify({ ok: true, id: newId }));
                        } catch (e) {
                            res.statusCode = 400;
                            res.end(JSON.stringify({ error: 'Invalid JSON' }));
                        }
                    });
                    return;
                }

                next();
            });
        },
    };
}
