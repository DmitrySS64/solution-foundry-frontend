# Sequence Diagrams

UML sequence-диаграммы для ключевых сценариев модуля `src/modules/diagram`.

## Создание связи между двумя узлами

Участники:

- Пользователь
- `DiagramCanvas`
- `Store`
- `Model`
- `Renderer`

```mermaid
sequenceDiagram
    actor User as Пользователь
    participant Canvas as DiagramCanvas
    participant Store as Store
    participant Model as Model
    participant Renderer as Renderer

    User->>Canvas: Нажимает anchor исходного узла
    Canvas->>Model: getNodeAnchors(sourceNode)
    Model-->>Canvas: source anchor point
    Canvas->>Canvas: startConnection(nodeId, anchorId, x, y)
    Canvas->>Renderer: requestDraw("edges")
    Renderer-->>User: Показывает TemporaryEdge

    User->>Canvas: Тянет указатель к целевому узлу
    Canvas->>Canvas: Переводит pointer screen -> world
    Canvas->>Canvas: Обновляет tempConnection.toX/toY
    Canvas->>Renderer: requestDraw("edges")
    Renderer-->>User: Обновляет временную линию

    User->>Canvas: Отпускает указатель на целевом узле
    Canvas->>Model: getNodeAnchors(targetNode)
    Model-->>Canvas: target anchors
    Canvas->>Model: closestPointOnRectPerimeter(targetNode, sourcePoint)
    Model-->>Canvas: target point fallback
    Canvas->>Model: create DiagramEdge
    Canvas->>Store: actions.addEdge(edge)
    Store->>Store: pushPastSnapshot(document)
    Store->>Store: document.edges.push(edge)
    Store->>Store: update sourceNode.edges / targetNode.edges
    Store-->>Renderer: document state changed
    Renderer->>Model: resolveEdgePoints(edge, nodes)
    Model-->>Renderer: source -> controlPoints -> target
    Renderer-->>User: Рисует постоянную связь
    Canvas->>Canvas: cancelConnection()
```

## Перемещение узла с автоматическим перестроением связей

Участники:

- Пользователь
- `ShapeRenderer`
- `syncEdgeKonva[util]`
- `store`
- `EdgeRenderer`

```mermaid
sequenceDiagram
    actor User as Пользователь
    participant Shape as ShapeRenderer
    participant Sync as syncEdgeKonva[util]
    participant Store as store
    participant Edge as EdgeRenderer

    User->>Shape: Начинает drag узла
    Shape->>Store: actions.setNodeDragActive(true)
    Shape->>Shape: Konva Group двигается локально

    loop pointer move во время drag
        User->>Shape: Перемещает узел
        Shape->>Store: getState().document.edges / nodes
        Store-->>Shape: Текущий документ
        Shape->>Shape: Находит связанные ребра по source/target nodeId
        Shape->>Sync: syncEdgeKonva(edge, allNodesWithNextNode)
        Sync->>Edge: edgeRegistry.get(edge.id)
        Edge-->>Sync: line/startCap/endCap refs
        Sync->>Sync: resolveEdgePoints(edge, nodes)
        Sync->>Edge: line.points(flatPoints)
        Sync->>Edge: update Arrow cap points/style
        Sync->>Edge: line.getLayer().batchDraw()
        Edge-->>User: Связи визуально перестроены без полного commit в store
    end

    User->>Shape: Завершает drag
    Shape->>Store: actions.setNodeDragActive(false)
    Shape->>Store: actions.updateNode(node.id, { x, y })
    Store->>Store: pushPastSnapshot(document)
    Store->>Store: Object.assign(node, updater)
    Store->>Store: recalculateEdge(edge, node) для node.edges
    Store->>Store: node.updatedAt = Date.now()
    Store-->>Edge: document state changed
    Edge->>Sync: syncEdgeKonva(edge, nodes)
    Sync->>Edge: Финальная синхронизация geometry
    Edge-->>User: Узел и связи зафиксированы в новом положении
```

