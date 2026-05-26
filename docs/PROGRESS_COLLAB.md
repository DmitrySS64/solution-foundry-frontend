# Progress: Collaborative editors (Lexical + Yjs)

## ✅ Done
- Подключен совместный редактор текста на базе **Lexical + Yjs** через `@lexical/yjs`.
- Обновлён пункт в `docs/TODO.md`:
  - `Реализация совместного редактирования текстового редактора (@lexical/yjs)` отмечен как выполненный.

## Implemented files
- `src/entities/editor/ui/Editor.tsx` — добавлен `LexicalYjsPlugin`.
- `src/features/editor/plugins/LexicalYjsPlugin.tsx` — Yjs `WebsocketProvider` + awareness + подключение `LexicalYjsCollaborationPlugin`.
- `src/shared/lib/yjs/getRoomId.ts` — формирование roomId.
- `src/shared/lib/yjs/getCollabUser.ts` — локальная информация пользователя для awareness.
- `src/shared/lib/yjs/createYProvider.ts` — создание `Y.Doc` + `y-websocket` provider.

