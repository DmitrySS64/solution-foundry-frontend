# Snapping

Snapping is used when editing edge endpoints.

## Endpoint Snapping

Utility: `model/util/edgeEndpointSnap.ts`.

`EdgeHandlesOverlay` uses it on endpoint `dragEnd`:

```text
drag endpoint
→ temporary free point while dragging
→ snapEdgeEndpointToGraph(point, nodes)
→ update edge source/target
```

If a suitable node/anchor is found, endpoint becomes attached to graph. Otherwise it can remain a free point.

## Geometry Fallback

When an edge endpoint has `nodeId` but no `anchorId`, `closestPointOnRectPerimeter` picks the closest point on the node rectangle perimeter toward the opposite side/control point.

## Current Scope

Implemented:

- endpoint-to-node snapping path
- closest perimeter fallback
- live preview through `syncEdgeKonva`

Not implemented yet:

- grid snapping
- node-to-node alignment guides
- snapping thresholds configuration in UI
- spatial index for large diagrams
