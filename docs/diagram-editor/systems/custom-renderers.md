# Custom Renderers

Custom node renderers allow a node to bypass the standard primitive/svg renderer.

## Registry

File:

- `src/modules/diagram/canvas/customRenderers/index.tsx`

Registry shape:

```ts
type CustomRendererProps = {
  node: DiagramNode
}

type CustomRenderer = (props: CustomRendererProps) => React.ReactNode
```

Current registry contains:

- `example.label` → `KonvaTextLabelRenderer`

## Selection

`ShapeRenderer` checks `node.customRendererId`.

Render priority:

1. custom renderer from `customRendererRegistry`
2. `node.notation.svg`
3. `node.notation.primitives`
4. default primitive fallback

If `customRendererId` is set but registry has no renderer for it, standard rendering path is used.

## Contract

Custom renderer receives the full `DiagramNode`. It should render Konva-compatible React nodes and respect node dimensions if it wants to behave like a normal shape.

## Edge Marker Registry

`canvas/customRenderers/EdgeEndMarkerRegistry.tsx` contains an early custom marker registry:

- `arrow`
- `c4.crow_feet`

`model/util/edgeMarkerGeometry.ts` calculates marker endpoint position and rotation. These pieces are present, but `EdgeRenderer` currently uses built-in Konva `Arrow` and does not consume the custom marker registry yet.
