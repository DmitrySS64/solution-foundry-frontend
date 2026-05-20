# Node System

Node is graph entity in `DiagramDocument.nodes`.

## Type

`DiagramNode` содержит:

- identity: `id`, `type`
- geometry: `x`, `y`, `width`, `height`, `rotation`
- content: `label`
- appearance: `style`, `textStyle`
- notation: `notation`
- custom rendering: `customRendererId`
- render policies: `renderLabel`, `canStretch`, `preserveAspectRatio`
- relation index: `edges`
- timestamps: `createdAt`, `updatedAt`

## Creation

Factory: `model/factories/create-node.ts`.

Flow:

```text
createNode(type, x, y)
→ getNodeDefinition(type)
→ cloneNotation(definition.notation)
→ create DiagramNode with box/style/text defaults
```

Definitions are built in `model/registry/nodeDefinitions.ts` from:

- base shapes
- BPMN notation elements
- UML notation elements
- C4 notation elements

## Notation

`NodeNotation` stores:

- `id`
- `name`
- `svg?`
- `primitives?`
- `properties`

`NodePrimitive` supports:

- `rect`
- `circle`
- `diamond`
- `text`
- `svg`

Relative primitive sizes (`0..1`) are scaled to node dimensions by `ShapeRenderer`.

## Rendering

Renderer: `canvas/renderers/ShapeRenderer.tsx`.

It:

- registers Konva group in `nodeRegistry`
- renders custom renderer/svg/primitives
- renders label if `renderLabel !== false`
- shows anchors on hover/highlight
- syncs related edges during drag
- commits final position through `updateNode` on drag end

## Resize

`TransformerLayer` attaches Konva Transformer to selected nodes.

Resize rules:

- `preserveAspectRatio` or all-circle primitives enable `keepRatio`
- `canStretch === false` prevents width/height replacement with transformed box size
- minimum size is `40`
