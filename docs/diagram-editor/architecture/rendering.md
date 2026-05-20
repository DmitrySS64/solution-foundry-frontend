# Rendering System

Rendering построен на Konva через `react-konva`.

Pipeline:

```text
document state
→ layer components
→ node/edge renderers
→ Konva scene graph
→ batchDraw
```

## Stage

`canvas/DiagramCanvas.tsx` создает `Stage` и управляет refs слоев:

- `gridLayerRef`
- `edgeLayerRef`
- `handlesLayerRef`
- `nodeLayerRef`
- `overlayLayerRef`

## Layers

- `GridLayer` — сетка.
- `NodeLayer` — узлы.
- `TransformerLayer` — resize выбранных узлов.
- `EdgeLayer` — ребра.
- `TemporaryEdge` — временная линия при connect.
- `EdgeHandlesOverlay` — ручки выбранного ребра.
- `SelectionLayer` — selection box.

Viewport применяется к graph-слоям через `position` и `scale`. Selection overlay остается в screen space.

## Node Rendering

`ShapeRenderer` рисует узел как `Group`.

Приоритет рендера:

1. `customRendererId` из `customRendererRegistry`
2. `node.notation.svg`
3. `node.notation.primitives`
4. fallback primitive по `node.type`

Text primitives могут брать значение из `node.notation.properties` через `textKey`.

## Edge Rendering

`EdgeRenderer`:

- получает route через `resolveEdgePoints`
- рисует `Line`
- рисует `Arrow` для `startCap/endCap`
- показывает label возле средней точки
- регистрирует refs в `edgeRegistry`

`syncEdgeKonva` обновляет line/cap points напрямую во время drag.

## Draw Scheduling

`DiagramCanvas.requestDraw()` батчит перерисовку через `requestAnimationFrame`, затем вызывает `batchDraw()` только нужного слоя или всех слоев.
