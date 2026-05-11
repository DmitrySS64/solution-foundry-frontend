- [x] Добавить историю (Undo/Redo) в diagram editor store с ограничением 50 шагов

- [ ] Обернуть все мутационные actions (add/update/delete/load/clear) так, чтобы перед изменением сохранялся snapshot document.nodes+edges
- [ ] Реализовать actions undo()/redo() и вычисление canUndo/canRedo
- [ ] Добавить в DiagramToolbar кнопки Undo/Redo (disabled при отсутствии истории)
- [ ] Добавить hotkeys: Ctrl+Z (undo), Ctrl+Y (redo) в DiagramCanvas
- [ ] Проверить: добавление/перемещение фигуры, изменение инспектора, изменение ребра (controlPoints), удаление Delete, Ctrl+Z/Ctrl+Y
