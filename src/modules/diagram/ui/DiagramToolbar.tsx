//ui/DiagramToolbar
import { createNode } from '../model/factories/create-node'

import { IconButton } from '@shared/ui/form/icon_button'
import { ICON_PATHS } from '@shared/enum/icons'

import {
    useEditorActions,
    useViewport,
} from '../store/selectors'

const DiagramToolbar = () => {
    const { addNode, undo, redo } = useEditorActions()
    const viewport = useViewport()

    const pastLen = useEditorActions(s => s.history.past.length)
    const futureLen = useEditorActions(s => s.history.future.length)

    return (
        <div className="flex w-full px-4 items-center gap-2">
            <div className="w-px h-6 bg-border mx-1" />
            <IconButton
                padding
                path={ICON_PATHS.UNDO}
                onClick={undo}
                disabled={pastLen === 0}
                title="Undo (Ctrl+Z)"
            />
            <IconButton
                padding
                path={ICON_PATHS.REDO}
                onClick={redo}
                disabled={futureLen === 0}
                title="Redo (Ctrl+Y)"
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
                title="Add rectangle"
            />
        </div>
    )
}

export { DiagramToolbar }



