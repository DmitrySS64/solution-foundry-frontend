//ui/DiagramToolbar
import { createNode }
    from '../model/factories/create-node'

import {
    useEditorActions,
    useViewport,
} from '../store/selectors'

const DiagramToolbar = () => {

    const { addNode } =
        useEditorActions()
    const viewport =
        useViewport()

    return (
        <div className="h-12 border-b border-border flex items-center px-2">

            <button
                onClick={() => {

                    addNode(
                        createNode(
                            'rectangle',
                            (window.innerWidth / 2 - viewport.x) / viewport.zoom - 80,
                            (window.innerHeight / 2 - viewport.y) / viewport.zoom - 40
                        )
                    )
                }}
            >
                Rectangle
            </button>
        </div>
    )
}

export {DiagramToolbar};