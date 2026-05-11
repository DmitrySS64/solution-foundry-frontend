//ui/DiagramSidebar
import type {NodeType} from "@/modules/diagram/model/types/node.types.ts";
import {
    useEditorActions,
    useViewport,
} from '../store/selectors'
import { createNode }
    from '../model/factories/create-node'
import {nodeDefinitions} from "@/modules/diagram/model/registry/nodeDefinitions.ts";

const items: {type: NodeType, label: string}[] =
    nodeDefinitions.map(definition => ({
        type: definition.type,
        label: definition.label,
    }))

const DiagramSidebar = () => {

    const { addNode } =
        useEditorActions()
    const viewport =
        useViewport()

    const createNodeInCenter = (type: NodeType) => {
        const width = 160
        const height = 80
        const centerX = (
            window.innerWidth / 2 - viewport.x
        ) / viewport.zoom - width / 2
        const centerY = (
            window.innerHeight / 2 - viewport.y
        ) / viewport.zoom - height / 2

        addNode(
            createNode(type, centerX, centerY)
        )
    }

    return (
        <>
            <div
                className='p-3 border-b border-border font-semibold'
            >
                Library
            </div>

            <div
                className='flex-1 overflow-auto p-3'
            >
                {items.map(item => (
                    <button
                        key={item.type}

                        className='w-full text-left p-3 rounded-lg border border-border hover:bg-zinc-100 dark:hover:bg-zinc-800 mb-2'

                        onClick={() =>
                            createNodeInCenter(item.type)
                        }
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </>
    )
}

export {
    DiagramSidebar
}
