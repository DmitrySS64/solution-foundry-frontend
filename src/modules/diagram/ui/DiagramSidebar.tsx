//ui/DiagramSidebar
import type { NodeType } from "@/modules/diagram/model/types/node.types.ts";
import { createNode } from "../model/factories/create-node";
import { nodeDefinitions } from "@/modules/diagram/model/registry/nodeDefinitions.ts";
import { useEditorActions, useViewport } from "../store/selectors";

type SidebarItem = {
    type: NodeType;
    label: string;
    notationGroupId: string;
};

const items: SidebarItem[] = nodeDefinitions.map(definition => ({
    type: definition.type,
    label: definition.label,
    notationGroupId: definition.notationGroupId ?? 'base',
}));

const groupName = (groupId: string) => {
    if (groupId === 'bpmn') return 'BPMN';
    if (groupId === 'c4') return 'C4';
    return 'База';
};

const MiniNotation = ({
    notation,
}: {
    notation: { primitives?: any[] } | undefined;
}) => {
    const primitives = notation?.primitives;

    const w = 48;
    const h = 32;

    if (!primitives || primitives.length === 0) {
        return (
            <div className='w-10 h-10 bg-blue-200 dark:bg-blue-700 rounded' />
        );
    }

    type MiniPrimitive = {
        type: 'rect' | 'circle' | 'diamond' | 'text' | 'svg';
        x?: number;
        y?: number;
        width?: number;
        height?: number;
        radius?: number;
        fill?: string;
        stroke?: string;
        strokeWidth?: number;
        text?: string;
        textKey?: string;
        fontSize?: number;
        fontFamily?: string;
        fontStyle?: 'normal' | 'italic';
        fontWeight?: 'normal' | 'bold';
        align?: 'left' | 'center' | 'right';
        svg?: string;
        href?: string;
        url?: string;
    };

    const getPrimitiveStyle = (p: MiniPrimitive) => {
        const type = p.type;
        const x = (p.x ?? 0) * w;
        const y = (p.y ?? 0) * h;
        const pw = (p.width ?? 1) * w;
        const ph = (p.height ?? 1) * h;

        const fill = p.fill ?? 'rgba(59,130,246,0.25)';
        const stroke = p.stroke ?? '#3B82F6';
        const strokeWidth = p.strokeWidth ?? 2;

        if (type === 'circle') {
            const radius = (p.radius ?? 0.5) * Math.min(w, h);
            return {
                kind: 'circle' as const,
                cx: (p.x ?? 0.5) * w,
                cy: (p.y ?? 0.5) * h,
                r: radius,
                fill,
                stroke,
                strokeWidth,
            };
        }

        if (type === 'diamond') {
            return {
                kind: 'diamond' as const,
                cx: x + pw / 2,
                cy: y + ph / 2,
                bw: pw,
                bh: ph,
                fill,
                stroke,
                strokeWidth,
            };
        }

        if (type === 'text') {
            return {
                kind: 'text' as const,
                x,
                y,
                w: pw,
                h: ph,
                text: String(p.text ?? ''),
                fontSize: p.fontSize ?? 10,
                align: p.align ?? 'center',
            };
        }

        if (type === 'svg') {
            const href = p.svg ?? p.href ?? p.url;
            return {
                kind: 'svg' as const,
                x,
                y,
                w: pw,
                h: ph,
                href,
            };
        }

        return {
            kind: 'rect' as const,
            x,
            y,
            w: pw,
            h: ph,
            fill,
            stroke,
            strokeWidth,
        };
    };

    return (
        <div
            className='mx-auto rounded-md bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center'
            style={{ width: 56, height: 40 }}
        >
            <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
                {primitives.map((p, idx) => {
                    const st = getPrimitiveStyle(p as MiniPrimitive);

                    if (st.kind === 'circle') {
                        return (
                            <circle
                                key={idx}
                                cx={st.cx}
                                cy={st.cy}
                                r={st.r}
                                fill={st.fill}
                                stroke={st.stroke}
                                strokeWidth={st.strokeWidth}
                            />
                        );
                    }

                    if (st.kind === 'diamond') {
                        const size = Math.min(st.bw, st.bh);
                        const points = [
                            [st.cx, st.cy - size / 2],
                            [st.cx + size / 2, st.cy],
                            [st.cx, st.cy + size / 2],
                            [st.cx - size / 2, st.cy],
                        ];

                        return (
                            <polygon
                                key={idx}
                                points={points.map(pt => pt.join(',')).join(' ')}
                                fill={st.fill}
                                stroke={st.stroke}
                                strokeWidth={st.strokeWidth}
                            />
                        );
                    }

                    if (st.kind === 'text') {
                        return (
                            <text
                                key={idx}
                                x={st.x + st.w / 2}
                                y={st.y + st.h / 2}
                                fontSize={st.fontSize}
                                textAnchor={
                                    st.align === 'left'
                                        ? 'start'
                                        : st.align === 'right'
                                            ? 'end'
                                            : 'middle'
                                }
                                dominantBaseline='middle'
                                fill='#111827'
                            >
                                {st.text}
                            </text>
                        );
                    }

                    if (st.kind === 'svg') {
                        if (!st.href) return null;
                        // svg miniature: render external public image by href
                        return (
                            <image
                                key={idx}
                                href={st.href}
                                x={st.x}
                                y={st.y}
                                width={st.w}
                                height={st.h}
                                preserveAspectRatio='xMidYMid meet'
                            />
                        );
                    }

                    if (st.kind === 'rect') {
                        return (
                            <rect
                                key={idx}
                                x={st.x}
                                y={st.y}
                                width={st.w}
                                height={st.h}
                                rx={4}
                                ry={4}
                                fill={st.fill}
                                stroke={st.stroke}
                                strokeWidth={st.strokeWidth}
                            />
                        );
                    }

                    return null;
                })}
            </svg>
        </div>
    );
};

const DiagramSidebar = () => {
    const { addNode } = useEditorActions();
    const viewport = useViewport();

    const createNodeInCenter = (type: NodeType) => {
        const width = 160;
        const height = 80;
        const centerX = (window.innerWidth / 2 - viewport.x) / viewport.zoom - width / 2;
        const centerY = (window.innerHeight / 2 - viewport.y) / viewport.zoom - height / 2;

        addNode(createNode(type, centerX, centerY));
    };

    return (
        <>
            <div className='p-3 border-b border-border font-semibold'>Library</div>
            <div className='flex-1 overflow-auto p-3'>
                {Object.entries(
                    items.reduce(
                        (acc, item) => {
                            const key = groupName(item.notationGroupId);
                            (acc[key] ??= []).push(item);
                            return acc;
                        },
                        {} as Record<string, SidebarItem[]>,
                    ),
                ).map(([groupKey, groupItems]) => (
                    <details key={groupKey} className='mb-3' open>
                        <summary className='cursor-pointer font-semibold text-zinc-700 dark:text-zinc-200 uppercase text-xs'>
                            {groupKey}
                        </summary>

                        <div className='mt-2 grid grid-cols-2 gap-2'>
                            {groupItems.map(item => {
                                const def = nodeDefinitions.find(d => d.type === item.type);
                                return (
                                    <button
                                        key={item.type}
                                        type='button'
                                        className='rounded-lg border border-border hover:bg-zinc-100 dark:hover:bg-zinc-800 p-2'
                                        onClick={() => createNodeInCenter(item.type)}
                                    >
                                        <MiniNotation notation={def?.notation} />
                                        <div className='mt-2 text-center text-sm font-medium text-zinc-800 dark:text-zinc-100'>
                                            {item.label}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </details>
                ))}
            </div>
        </>
    );
};

export { DiagramSidebar };

