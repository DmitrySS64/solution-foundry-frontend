# Diagram Editor Docs

Документация модуля `src/modules/diagram`.

## Architecture

- `architecture/editor-core.md` — общее устройство редактора.
- `architecture/state.md` — Zustand state, actions, history.
- `architecture/rendering.md` — Konva stage, layers, renderers.
- `architecture/interactions.md` — pointer/keyboard/drag/drop/connect flows.

## Systems

- `systems/nodes.md` — модель и рендер узлов.
- `systems/edges.md` — модель и рендер ребер.
- `systems/anchors.md` — якоря и connection points.
- `systems/snapping.md` — snapping endpoint'ов ребер.
- `systems/notations.md` — JSON-нотации BPMN/UML/C4 и runtime mapping.
- `systems/serialization.md` — сохранение/загрузка документа.
- `systems/custom-renderers.md` — кастомные node renderers и заготовка marker registry.

## Performance

- `performance/rendering-optimization.md` — текущие оптимизации и будущие улучшения.

Главный обзор для отчета: `docs/STRUCT.md`.

## Diagrams

- `diagram-module-class-diagram.drawio` — диаграмма классов/типов модуля `src/modules/diagram`.
- `sequence-diagrams.md` — UML sequence-диаграммы для создания связи и перемещения узла.
- `dfd-diagrams.md` — показательные DFD для контекста редактора, редактирования документа и перестроения связей.
