# Anchor System

Anchors are connection points for nodes.

## Source

Factory: `model/factories/getNodeAnchors.ts`.

Anchors are calculated from node geometry. They are not stored as independent document entities.

## Usage

Anchors are used by:

- `ShapeRenderer` to show `AnchorOverlay`
- `DiagramCanvas.startConnection`
- `DiagramCanvas.finishConnection`
- `edgeGeometry.getAnchorPoint`
- `EdgeHandlesOverlay` endpoint snapping

## Visual Behavior

`AnchorOverlay` is shown when:

- node is hovered
- node is highlighted as a potential target while dragging an edge endpoint

Connection from anchor stores:

- source `nodeId`
- source `anchorId`
- source `point`

Target works the same way.

## Coordinate Rule

Anchor positions are resolved in world coordinates for edge geometry. Rendered overlay positions are local to the node group when shown inside `ShapeRenderer`.
