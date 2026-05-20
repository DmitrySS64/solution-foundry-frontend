# Editor Core

`src/modules/diagram` — canvas-based редактор диаграмм на React + Konva + Zustand.

Core systems:

- document model
- command/state store
- rendering pipeline
- interaction handling
- node system
- edge system
- notation registry
- serialization

## Core Flow

```text
user input
→ DiagramCanvas / UI component
→ useEditorStore.actions.*
→ DiagramDocument changes
→ React/Konva render
→ targeted Konva sync for hot drag paths
```

## Main Files

- `ui/DiagramEditor.tsx` — layout редактора.
- `ui/DiagramSidebar.tsx` — библиотека фигур и drag source.
- `ui/DiagramToolbar.tsx` — undo/redo и быстрые действия.
- `ui/DiagramInspector.tsx` — редактирование выбранного узла/ребра.
- `canvas/DiagramCanvas.tsx` — Konva stage, viewport, pointer/keyboard events.
- `store/editor.store.ts` — единый store документа и interaction-состояния.
- `model/registry/nodeDefinitions.ts` — объединение base/BPMN/UML/C4 элементов.
- `model/registry/notationRegistry.ts` — маппинг JSON-нотаций в runtime definitions.

## Design Rules

- `DiagramDocument` является источником правды для графа.
- Renderer не должен сам владеть бизнес-состоянием документа.
- Drag paths допускают live-update Konva refs для производительности, но финальное состояние фиксируется в store.
- Нотации описывают фигуры декларативно через primitives/properties.
- Canvas хранит координаты в world space; viewport применяется только как трансформация слоя.
