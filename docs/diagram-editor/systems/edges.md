# Edge System

Edge is graph entity in `DiagramDocument.edges`.

## Type

`DiagramEdge` contains:

- `id`
- `source: EdgeAnchor`
- `target: EdgeAnchor`
- `type: 'straight' | 'orthogonal' | 'bezier'`
- `controlPoints`
- `style`
- `label`
- `labelStyle`

`EdgeAnchor` contains optional `nodeId`, optional `anchorId`, and required `point`.

## Edge Styles

Current end cap model:

- `none`
- `arrow`

Stored as:

- `edge.style.startCap`
- `edge.style.endCap`

Custom marker geometry is prepared by utility files such as `edgeMarkerGeometry.ts`, but full declarative custom edge notation is not implemented yet.

## Creation

Factory: `model/factories/create-edge.ts`.

Interactive creation happens in `DiagramCanvas.finishConnection`, which builds a straight edge with default arrow end cap and adds it through `actions.addEdge`.

`addEdge` also updates `node.edges`:

- source gets `{ id, direction: 'out' }`
- target gets `{ id, direction: 'in' }`

## Geometry

`model/util/edgeGeometry.ts`:

- `closestPointOnRectPerimeter`
- `getAnchorPoint`
- `resolveEdgePoints`
- `flattenEdgePoints`

`resolveEdgePoints` calculates:

```text
source anchor point
→ controlPoints
→ target anchor point
```

If endpoint is attached to a node but has no concrete anchor, the closest point on node rectangle perimeter is used.

## Rendering

`canvas/renderers/EdgeRenderer.tsx`:

- renders `Line`
- renders optional start/end `Arrow`
- renders label
- selects edge on click
- adds control point on double click

`edgeRegistry` keeps Konva refs for live updates.

## Editing

`EdgeHandlesOverlay` appears for selected edge and no active node drag.

It supports:

- drag control points
- click segment midpoint to insert control point
- drag source endpoint
- drag target endpoint
- snap endpoints to graph on drag end

During handle drag, `syncEdgeKonva` updates line geometry without committing every movement to store.
