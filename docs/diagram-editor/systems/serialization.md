# Serialization

Serialization lives in `src/modules/diagram/model/serializers/document.serializer.ts`.

## Serialize

`DocumentSerializer.serialize(document)` returns formatted JSON:

```ts
JSON.stringify(document, null, 2)
```

## Deserialize

`DocumentSerializer.deserialize(raw)`:

- parses JSON
- accepts `nodes` and `edges` as arrays
- also accepts object-map shape and converts it with `Object.values`
- normalizes nodes
- normalizes edges
- clears `node.edges`
- rebuilds `node.edges` from `edge.source/target`

## Node Normalization

Defaults applied when missing:

- `edges: []`
- `style.fill`
- `style.stroke`
- `style.strokeWidth`
- `style.cornerRadius`
- `style.opacity`
- `textStyle.fill`
- `textStyle.fontSize`
- `textStyle.fontFamily`
- `textStyle.fontStyle`
- `textStyle.fontWeight`
- `textStyle.align`

## Edge Normalization

Defaults applied when missing:

- `type: 'straight'`
- `controlPoints: []`
- `label: ''`
- `style.stroke`
- `style.strokeWidth`

## Rule

Persist only document state. Do not persist viewport, selection or interaction flags unless a product requirement explicitly asks for restoring editor UI state.
