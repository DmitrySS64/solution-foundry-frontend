Приложение содержит примеры декларативного описания элементов графических нотаций. JSON-конфигурации используются для загрузки типов узлов, их начальных размеров, визуального представления и редактируемых свойств.

Пример Б.1 - элемент BPMN «Задача»

```json
{
  "type": "bpmn-task",
  "name": "Задача",
  "extends": "shape",
  "icon": "mdiSquare",
  "defaults": {
    "shapeType": "rectangle",
    "width": 140,
    "height": 70,
    "style": {
      "fill": "#DBEAFE",
      "stroke": "#3B82F6",
      "strokeWidth": 2,
      "opacity": 1
    }
  },
  "properties": [
    {
      "name": "label",
      "label": "Название",
      "type": "text",
      "default": "Новая задача"
    },
    {
      "name": "taskType",
      "label": "Тип задачи",
      "type": "select",
      "options": ["user", "service", "script", "businessRule"],
      "default": "user"
    },
    {
      "name": "isAsync",
      "label": "Асинхронная",
      "type": "boolean",
      "default": false
    }
  ]
}
```

Пример Б.2 - элемент UML «Класс»

```json
{
  "type": "uml-class",
  "name": "Класс",
  "extends": "shape",
  "defaults": {
    "shapeType": "rectangle",
    "width": 180,
    "height": 120
  },
  "properties": [
    {
      "name": "label",
      "label": "Название класса",
      "type": "text",
      "default": "ClassName"
    },
    {
      "name": "visibility",
      "label": "Видимость",
      "type": "select",
      "options": ["public", "private", "protected"],
      "default": "public"
    }
  ]
}
```

Приведенные конфигурации показывают общий принцип расширения редактора: визуальные и предметные характеристики элемента задаются данными, а не встраиваются жестко в код компонента.
