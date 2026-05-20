# Editor State

State management основан на Zustand + immer в `src/modules/diagram/store/editor.store.ts`.

## State Shape

Store содержит:

- `document: DiagramDocument`
- `history: { past: DiagramDocument[]; future: DiagramDocument[] }`
- `selection: { ids: string[] }`
- `viewport: { x: number; y: number; zoom: number }`
- `interaction`
- `actions`

`document` содержит только граф:

- `nodes: DiagramNode[]`
- `edges: DiagramEdge[]`

## Interaction State

`interaction` хранит transient UI flags:

- `dragging`
- `hoveredId`
- `nodeDragActive`
- `edgeHandleDragActive`
- `hoveredEdgeId`
- `anchorHighlightNodeId`
- `selectionBox`

Эти поля не сериализуются как документ.

## Commands

Документ меняется через `actions`:

- `addNode`, `updateNode`, `deleteNode`
- `addEdge`, `updateEdge`, `deleteEdge`
- `deleteSelection`
- `loadDocument`, `clearDocument`
- `undo`, `redo`

Для UI-состояния:

- `selectNode`
- `setViewport`
- `setNodeDragActive`
- `setEdgeHandleDragActive`
- `setHoveredEdgeId`
- `setAnchorHighlightNodeId`

## History

History хранит снапшоты документа:

- перед изменением документа вызывается `pushPastSnapshot`
- после нового изменения `future` очищается
- `undoSnapshot` и `redoSnapshot` возвращают следующий документ и историю

Viewport, selection и interaction flags в history не входят.

## Derived Indexes

`node.edges` — служебный индекс связанных ребер. Он обновляется при:

- `addEdge`
- `updateEdge`
- `deleteEdge`
- `deleteNode`
- `deleteSelection`
- `deserialize`

После загрузки документа индекс пересобирается по `edge.source/edge.target`.
