# Project Architecture

Проект использует Feature-Sliced Design для основной прикладной части и допускает изолированные модули для сложных редакторов.

Основные слои:

- `app`
- `pages`
- `widgets`
- `features`
- `entities`
- `shared`

Правило зависимостей: слой может импортировать только слои ниже себя. Общие компоненты, helpers, config и i18n живут в `shared`.

## Modules

`src/modules/*` используется для автономных подсистем со своей внутренней архитектурой. Пример: `src/modules/diagram`.

Модуль должен:

- хранить собственную модель данных рядом с UI/renderer
- не зависеть от конкретной страницы приложения
- иметь понятные публичные entrypoints
- оставаться переносимым в отдельную библиотеку

## Diagram Editor

Графический редактор диаграмм находится в `src/modules/diagram` и состоит из:

- `ui` — toolbar/sidebar/inspector/layout
- `canvas` — Konva stage, layers, renderers
- `model` — типы, factories, registries, serializers, geometry utilities
- `store` — Zustand state, selectors, history

Подробная документация: `docs/STRUCT.md` и `docs/diagram-editor/`.
