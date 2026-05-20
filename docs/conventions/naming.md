# Naming

## TypeScript

Prefer descriptive names that match domain concepts:

- `DiagramNode`
- `DiagramEdge`
- `DiagramDocument`
- `NodeNotation`
- `EdgeAnchor`

## Interfaces

Existing convention allows `I` prefix for interfaces:

- `ISelectionBox`

For domain model types in `src/modules/diagram`, current code mostly uses `type`/`interface` names without prefix. Keep local consistency inside a file or subsystem.

## Enums

Enums may use `E` prefix when introduced:

- `ENodeType`

String union types are currently preferred in the diagram module for compact domain values:

- `EdgeType`
- `EdgeEndStyle`
- `NodeType`

## Constants

Global constants use `UPPER_CASE`:

- `GLOBAL_ICONS`
- `MAX_SCALE`

Local constants can use `camelCase` when scoped to a component or helper.
