# Interaction System

Основной обработчик взаимодействий находится в `canvas/DiagramCanvas.tsx`.

## Supported Interactions

- pan middle mouse
- wheel scroll
- Ctrl/Cmd + wheel zoom
- Shift + wheel horizontal scroll
- drag/drop nodes from sidebar
- click selection
- Delete selected node/edge
- Ctrl/Cmd+Z undo
- Ctrl/Cmd+Y redo
- connect nodes through anchors
- resize selected nodes with Transformer
- edit edge endpoints/control points

## Coordinate Spaces

Canvas работает с двумя пространствами:

- screen space: pointer coordinates from Konva stage
- world space: document coordinates

Преобразование:

```ts
worldX = (pointer.x - viewport.x) / viewport.zoom
worldY = (pointer.y - viewport.y) / viewport.zoom
```

Документ хранит world coordinates. Viewport не переписывает координаты графа.

## Node Creation

Sidebar:

- `onDragStart` кладет `application/diagram-node-type` в `dataTransfer`
- `DiagramCanvas.handleDrop` читает type и создает node в world point
- click по sidebar item создает node в центре viewport

Toolbar:

- добавляет rectangle в центр viewport

## Connection Creation

1. `AnchorOverlay` вызывает `onStartConnection`.
2. `DiagramCanvas.startConnection` включает `tempConnection`.
3. `TemporaryEdge` рисует временное ребро.
4. `ShapeRenderer.onMouseUp` на target node вызывает `onFinishConnection`.
5. `DiagramCanvas.finishConnection` создает `DiagramEdge`.

Связь с самим собой отменяется.

## Selection

`selection.ids` может содержать id узла или ребра.

- click по узлу выбирает узел
- click по ребру выбирает ребро
- click по пустому stage очищает selection и запускает selection box
- Delete вызывает `deleteSelection`

Selection box сейчас визуально рисуется, но массовое выделение по попаданию объектов требует дальнейшей реализации.
