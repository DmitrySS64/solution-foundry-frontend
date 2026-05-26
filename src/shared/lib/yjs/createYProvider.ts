//shared/lib/yjs/createYProvider
import * as Y from 'yjs';
import { WebsocketProvider } from '@y/websocket';

import type { Awareness } from 'y-protocols/awareness';

type CreateYProviderResult = {
  ydoc: Y.Doc;
  provider: WebsocketProvider;
  awareness: Awareness;
};
//не используется
export function createYProvider(
    roomId: string,
    websocketUrl: string = 'ws://localhost:1234'
): CreateYProviderResult {
  console.log(`[Yjs] Creating provider for room: ${roomId}`);

  const ydoc = new Y.Doc();

  // ✅ КРИТИЧНО: Создаем корневой shared type ДО подключения
  // Lexical ожидает, что в документе уже есть map с именем 'lexical'
  const lexicalMap = ydoc.getMap('lexical');

  // Инициализируем пустым объектом, если его нет
  if (lexicalMap.size === 0) {
    // Создаем начальную структуру для Lexical
    lexicalMap.set('root', new Y.XmlElement('root'));
    console.log('[Yjs] Initialized lexical map with root element');
  }

  const provider = new WebsocketProvider(
      websocketUrl,
      roomId,
      ydoc,
      {
        connect: false,
      }
  );

  return { ydoc, provider, awareness: provider.awareness };
}

