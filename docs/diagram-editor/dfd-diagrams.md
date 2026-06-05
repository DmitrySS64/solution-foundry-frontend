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



```mermaid
erDiagram
    USER ||--o{ PROJECT : owns
    PROJECT ||--o{ FILE_NODE : contains
    PROJECT ||--o{ CUSTOM_ROLE : defines
    PROJECT ||--o{ TAG_POLICY : has
    FILE_NODE ||--o{ FILE_NODE : "parent/child (self-ref)"
    FILE_NODE ||--o{ DIAGRAM_DOCUMENT : links_to
    DIAGRAM_DOCUMENT ||--o{ DIAGRAM_NODE : contains
    DIAGRAM_DOCUMENT ||--o{ DIAGRAM_EDGE : contains
    CUSTOM_ROLE ||--o{ PROJECT_MEMBER : assigned_to
    USER ||--o{ PROJECT_MEMBER : participates_in

    USER {
        string id PK
        string email
        string name
        string avatar
        datetime createdAt
    }
    PROJECT {
        string id PK
        string name
        string ownerId FK
        string[] tags
        datetime createdAt
    }
    FILE_NODE {
        string id PK
        string parentId FK
        string name
        string type "md|diagram"
        string[] tags
    }
    DIAGRAM_DOCUMENT {
        string id PK
        int version
        datetime updatedAt
    }
    DIAGRAM_NODE {
        string id PK
        string type
        float x
        float y
        float width
        float height
        string label
    }
    DIAGRAM_EDGE {
        string id PK
        string sourceId FK
        string targetId FK
        string type
        float[] controlPoints
    }
    CUSTOM_ROLE {
        string id PK
        string projectId FK
        string name
        boolean isPreset
    }
    TAG_POLICY {
        string id PK
        string tag PK
        string projectId FK
        string[] allowedOperations
        int priority
    }
```


```mermaid
graph TD
    subgraph View ["Уровень представления (View)"]
        Canvas["DiagramCanvas\n(Stage, Viewport, обработка событий мыши)"]
        Grid["GridLayer\n(Отрисовка сетки, snap-to-grid)"]
        Nodes["NodeLayer\n(Рендеринг фигур)"]
        Edges["EdgeLayer\n(Рендеринг связей)"]
        Trans["TransformerLayer\n(8-якорный трансформер)"]
        Handles["EdgeHandlesOverlay\n(Точки излома, анкеры связей)"]
        Sidebar["DiagramSidebar\n(Библиотека элементов, Drag & Drop)"]
        Inspector["InspectorPanel\n(Динамический инспектор свойств)"]
    end

    subgraph Model ["Уровень данных и нотаций (Model)"]
        Registry["NotationRegistry\n(Загрузчик JSON-конфигураций)"]
        ShapeRenderer["ShapeRenderer\n(Фабрика геометрии фигур)"]
        EdgeRenderer["EdgeRenderer\n(Расчёт маршрутов и окончаний)"]
        Geometry["GeometryUtils\n(Вычисление якорей, пересечений, привязка)"]
    end

    subgraph Store ["Управление состоянием (Store)"]
        Zustand["EditorStore (Zustand)\n(Document, History, Selection, Actions)"]
    end

    subgraph Sync ["Интеграция и сервисы"]
        Yjs["YjsCollaborationAdapter\n(WebsocketProvider, CRDT-синхронизация)"]
        Export["ExportModule\n(PNG, SVG, PlantUML)"]
    end

    %% Взаимодействие компонентов
    Canvas --> Grid
    Canvas --> Nodes
    Canvas --> Edges
    Canvas --> Trans
    Canvas --> Handles

    Nodes -->|Использует| ShapeRenderer
    Edges -->|Использует| EdgeRenderer
    Nodes -->|Координаты| Geometry
    Edges -->|Точки привязки| Geometry

    Sidebar -->|Перетаскивание элемента| Canvas
    Sidebar -->|Запрос описания| Registry
    Inspector -->|Изменение свойств| Zustand

    Registry -->|Загрузка нотаций| Zustand
    Zustand -->|Обновление модели| Nodes
    Zustand -->|Обновление модели| Edges
    Zustand -->|Ретрансляция изменений| Yjs
    Yjs -->|WebSocket-канал| WS[Клиент ↔ Сервер]

    Canvas -->|Снимок холста| Export
    Zustand -->|Структура документа| Export

    %% Стилизация слоёв
    classDef view fill:#e3f2fd,stroke:#1565c0,stroke-width:2px;
    classDef model fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px;
    classDef store fill:#fff3e0,stroke:#e65100,stroke-width:2px;
    classDef sync fill:#f3e5f5,stroke:#4a148c,stroke-width:2px;

    class Canvas,Grid,Nodes,Edges,Trans,Handles,Sidebar,Inspector view;
    class Registry,ShapeRenderer,EdgeRenderer,Geometry model;
    class Zustand store;
    class Yjs,Export sync;
```


