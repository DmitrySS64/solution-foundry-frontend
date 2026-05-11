//ui/DiagramEditor
import { DiagramToolbar } from './DiagramToolbar.tsx'
import {
    mdiChevronLeft,
    mdiChevronRight,
} from '@mdi/js'
import { IconButton } from '@shared/ui/form/icon_button'
import { DiagramCanvas } from '../canvas/DiagramCanvas'
import {useState} from "react";
import {DiagramSidebar} from "./DiagramSidebar.tsx";
import {DiagramInspector} from "./DiagramInspector.tsx";

const DiagramEditor = () => {
    const [leftOpen, setLeftOpen] =
        useState(true)

    const [rightOpen, setRightOpen] =
        useState(true)
    return (
        <div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950">
            {/* TOPBAR */}
            <div
                className='h-12 border-b border-border bg-white dark:bg-zinc-900 flex items-center px-2 gap-2 shrink-0'
            >
                <IconButton
                    path={mdiChevronLeft}
                    onClick={() =>
                        setLeftOpen(v => !v)
                    }
                />

                <DiagramToolbar />

                <div className='flex-1' />

                <IconButton
                    path={mdiChevronRight}
                    onClick={() =>
                        setRightOpen(v => !v)
                    }
                />
            </div>

            {/* BODY */}
            <div
                className='flex flex-1 overflow-hidden'
            >
                {/* LEFT */}
                {leftOpen && (
                    <div
                        className='w-64 border-r border-border bg-white dark:bg-zinc-900 shrink-0 flex flex-col'
                    >
                        <DiagramSidebar />
                    </div>
                )}

                {/* CANVAS */}
                <div
                    className='flex-1 overflow-hidden relative'
                >
                    <DiagramCanvas />
                </div>

                {/* RIGHT */}
                {rightOpen && (
                    <div
                        className='w-80 border-l border-border bg-white dark:bg-zinc-900 shrink-0 flex flex-col'
                    >
                        <DiagramInspector />
                    </div>
                )}
            </div>
        </div>
    )
}

export {DiagramEditor}