# Rendering Optimization

The editor avoids full React/store updates on hot pointer paths.

## Current Optimizations

- Separate Konva layers for grid, nodes, edges, handles and overlay.
- `requestDraw()` batches layer draw calls through `requestAnimationFrame`.
- `batchDraw()` is used instead of immediate full redraws.
- `nodeRegistry` stores Konva groups by node id.
- `edgeRegistry` stores Konva line/arrow refs by edge id.
- `syncEdgeKonva` updates affected edge geometry directly during drag.
- Store is updated on drag end instead of every pointer move.

## Hot Paths

Node drag:

```text
Konva group moves
→ related edges found
→ syncEdgeKonva(edge, nodes)
→ edge layer batchDraw
→ updateNode on dragEnd
```

Edge handle drag:

```text
handle moves
→ temporary edge patch
→ syncEdgeKonva
→ updateEdge on dragEnd
```

Viewport:

```text
wheel/middle-drag
→ viewportRef changes
→ layer position/scale changes
→ setViewport
→ batchDraw
```

## Avoid

- writing every mouse move to Zustand
- recalculating all edges when one node moves
- deep cloning large documents during transient interaction
- full canvas redraw when a single layer changed

## Future Improvements

- normalized document storage for large graphs
- spatial index for hit tests and snapping
- memoized routes per edge
- dirty region rendering where possible
- history compression for continuous edits
