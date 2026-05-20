//ui/DiagramToolbar
import { createNode } from '../model/factories/create-node'

import { IconButton } from '@shared/ui/form/icon_button'
import { ICON_PATHS } from '@shared/enum/icons'

import {
    useEditorActions,
    useViewport,
} from '../store/selectors'

import { useEditorStore } from '../store/editor.store'

import { useTranslation } from 'react-i18next'

const DiagramToolbar = () => {
    const { t } = useTranslation('diagramEditor')
    const { addNode, undo, redo } = useEditorActions()
    const viewport = useViewport()

    // past/future lengths come from history snapshots
    const pastLen = useEditorStore(s => s.history.past.length)

    const futureLen = useEditorStore(s => s.history.future.length)

    return (

        <div className="flex w-full px-4 items-center gap-2">
            <div className="w-px h-6 bg-border mx-1" />
            <IconButton
                padding
                path={ICON_PATHS.UNDO}
                onClick={undo}
                disabled={pastLen === 0}
                title={t('toolbar.undo')}
            />
            <IconButton
                padding
                path={ICON_PATHS.REDO}
                onClick={redo}
                disabled={futureLen === 0}
                title={t('toolbar.redo')}
            />
            <div className="w-px h-6 bg-border mx-1" />

            <IconButton
                padding
                path={ICON_PATHS.SQUARE}
                onClick={() => {
                    addNode(
                        createNode(
                            'rectangle',
                            (window.innerWidth / 2 - viewport.x) / viewport.zoom - 80,
                            (window.innerHeight / 2 - viewport.y) / viewport.zoom - 40,
                        ),
                    )
                }}
                title={t('toolbar.addRectangle')}
            />
        </div>
    )
}

export { DiagramToolbar }



