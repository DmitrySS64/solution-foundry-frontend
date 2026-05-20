# DFD Diagrams

Показательные DFD для модуля `src/modules/diagram`.

## DFD Level 0: Контекст графического редактора

Диаграмма показывает редактор как единый процесс и основные внешние/внутренние потоки данных.

```mermaid
flowchart LR
    User["Пользователь"]
    NotationFiles[("public/notations/*.json")]
    BrowserStorage[("Сохраненный JSON документа")]

    Editor["Графический редактор диаграмм\nsrc/modules/diagram"]

    Canvas["Canvas / Konva сцена"]
    Inspector["Inspector / Sidebar / Toolbar"]

    User -->|"drag, click, keyboard, wheel"| Editor
    Editor -->|"визуальное состояние диаграммы"| User

    NotationFiles -->|"BPMN/UML/C4 definitions"| Editor
    BrowserStorage -->|"loadDocument(raw JSON)"| Editor
    Editor -->|"serialize(document)"| BrowserStorage

    Editor -->|"nodes, edges, viewport"| Canvas
    Canvas -->|"pointer events, selected ids"| Editor

    Editor -->|"selected node/edge properties"| Inspector
    Inspector -->|"style, label, notation props, edge points"| Editor
```

## DFD Level 1: Редактирование документа диаграммы

Диаграмма раскрывает ключевые процессы внутри редактора: ввод пользователя, commands/store, model utilities и renderer.

```mermaid
flowchart TB
    User["Пользователь"]

    Input["1. Interaction handling\nDiagramCanvas / ShapeRenderer / EdgeHandlesOverlay"]
    Commands["2. Editor actions\nuseEditorStore.actions"]
    Store[("D1. Editor Store\nDocument + Viewport + Selection + Interaction")]
    History[("D2. History\npast / future snapshots")]
    Model["3. Model utilities\ncreateNode, createEdge,\nresolveEdgePoints, recalculateEdge"]
    Registries[("D3. Runtime registries\nnodeRegistry / edgeRegistry /\ncustomRendererRegistry")]
    Renderer["4. Renderer\nNodeLayer / EdgeLayer /\nShapeRenderer / EdgeRenderer"]
    Serializer["5. Serializer\nDocumentSerializer"]
    Persisted[("D4. Persisted document JSON")]
    Notations[("D5. Notation definitions\nBPMN / UML / C4")]

    User -->|"pointer/keyboard events"| Input
    Input -->|"commands: add/update/delete/select"| Commands
    Commands -->|"read/write state"| Store
    Commands -->|"pushPastSnapshot / undo / redo"| History
    History -->|"restored DiagramDocument"| Store

    Commands -->|"factory/geometry calls"| Model
    Model -->|"DiagramNode / DiagramEdge / edge points"| Commands
    Notations -->|"node definitions / primitives / properties"| Model

    Store -->|"nodes, edges, selection, viewport"| Renderer
    Renderer -->|"Konva refs"| Registries
    Input -->|"live drag geometry"| Model
    Model -->|"resolved edge points"| Renderer
    Renderer -->|"visual frame"| User

    Store -->|"DiagramDocument"| Serializer
    Serializer -->|"JSON"| Persisted
    Persisted -->|"raw JSON"| Serializer
    Serializer -->|"normalized DiagramDocument"| Store
```

## DFD Level 1: Создание и перестроение связей

Диаграмма фокусируется на данных, которые проходят через создание связи и последующее обновление геометрии при перемещении узла.

```mermaid
flowchart LR
    User["Пользователь"]
    Canvas["1. DiagramCanvas\nconnection lifecycle"]
    Shape["2. ShapeRenderer\nnode drag"]
    Store[("D1. Store\nnodes + edges")]
    Anchors["3. Anchor / snap utilities\ngetNodeAnchors\nsnapEdgeEndpointToGraph"]
    Geometry["4. Edge geometry\nresolveEdgePoints\nclosestPointOnRectPerimeter"]
    Registry[("D2. edgeRegistry\nKonva line/cap refs")]
    Sync["5. syncEdgeKonva"]
    EdgeRenderer["6. EdgeRenderer"]

    User -->|"start connection from anchor"| Canvas
    Canvas -->|"source node id + anchor id"| Anchors
    Anchors -->|"source point"| Canvas
    Canvas -->|"temporary edge points"| EdgeRenderer
    EdgeRenderer -->|"TemporaryEdge preview"| User

    User -->|"drop on target node"| Canvas
    Canvas -->|"target node + source point"| Anchors
    Anchors -->|"target anchor/perimeter point"| Canvas
    Canvas -->|"new DiagramEdge"| Store
    Store -->|"edges updated"| EdgeRenderer
    EdgeRenderer -->|"edge + nodes"| Geometry
    Geometry -->|"resolved points"| EdgeRenderer
    EdgeRenderer -->|"line + cap refs"| Registry
    EdgeRenderer -->|"rendered edge"| User

    User -->|"drag connected node"| Shape
    Shape -->|"next node position + related edges"| Store
    Shape -->|"edge + allNodesWithNextNode"| Sync
    Sync -->|"read refs"| Registry
    Sync -->|"edge + nodes"| Geometry
    Geometry -->|"updated points"| Sync
    Sync -->|"line.points / cap.points / batchDraw"| Registry
    Registry -->|"updated Konva objects"| EdgeRenderer
    EdgeRenderer -->|"rebuilt visual connections"| User
```

