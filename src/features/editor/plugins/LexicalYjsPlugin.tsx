//features/editor/plugins/LexicalYjsPlugin
import {useCallback, useRef} from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { getRoomId } from '@shared/lib/yjs/getRoomId';
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { WebsocketProvider } from "@y/websocket";
import * as Y from 'yjs';
import type { Provider } from '@lexical/yjs';

export type LexicalYjsPluginProps = {
    documentId?: string;
    diagramId?: string;
    pageId?: string;
    websocketUrl?: string;
};

export function LexicalYjsPlugin({
                                     websocketUrl = 'ws://localhost:1234',
                                     ...props
                                 }: LexicalYjsPluginProps) {
    const [editor] = useLexicalComposerContext();

    const roomId = getRoomId({
        documentId: props.documentId,
        diagramId: props.diagramId,
        pageId: props.pageId,
    });


    // Кэш для провайдеров, чтобы избежать повторного создания в Strict Mode
    const providersCache = useRef<Map<string, WebsocketProvider>>(new Map());

    // Lexical сам передает id комнаты и общую карту документов в фабрику
    const providerFactory = useCallback((id: string, yjsDocMap: Map<string, Y.Doc>): Provider => {
        // Если для этой комнаты уже есть активный провайдер в кэше — возвращаем его
        if (providersCache.current.has(id)) {
            return providersCache.current.get(id) as unknown as Provider;
        }

        console.log('[Plugin] Creating provider for room:', id);

        // Берем существующий ydoc из Lexical или создаем новый
        let ydoc = yjsDocMap.get(id);
        if (!ydoc) {
            ydoc = new Y.Doc();
            yjsDocMap.set(id, ydoc);
        }
        const lexicalRoot = ydoc.getMap('lexical');

        // Создаем провайдер
        const provider = new WebsocketProvider(
            websocketUrl,
            id,
            ydoc,
            { connect: true }
        );

        // Уменьшаем captureTimeout до 200мс, чтобы история не склеивала абзацы целиком.
        // Ограничиваем трекинг только локальным clientID для изоляции пользователей.
        const undoManager = new Y.UndoManager(lexicalRoot, {
            captureTimeout: 200,
            trackedOrigins: new Set([ydoc.clientID]),
        });

        // Привязываем настроенный менеджер к провайдеру, Lexical переиспользует его под капотом
        (provider as any).undoManager = undoManager;

        // Настраиваем awareness
        const userColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        provider.awareness.setLocalStateField('user', {
            name: `User_${Math.floor(Math.random() * 1000)}`,
            color: userColor,
            anchorPos: null,
            focusPos: null,
            focusing: false,
        });

        // Логирование событий сети
        provider.on('status', (event: { status: string }) => {
            console.log(`[Plugin] Provider (${id}) status:`, event.status);
        });

        provider.on('sync', (isSynced: boolean) => {
            console.log(`[Plugin] Synced (${id}):`, isSynced);
        });

        // Сохраняем в кэш
        providersCache.current.set(id, provider);

        return provider as unknown as Provider;
    }, [websocketUrl]);

    return (
        <CollaborationPlugin
            id={roomId}
            providerFactory={providerFactory}
            shouldBootstrap={true}
        />
    );
}
