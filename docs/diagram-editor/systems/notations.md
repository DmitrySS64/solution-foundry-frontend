# Notation System

Notation system describes diagram elements declaratively.

## Sources

JSON files:

- `public/notations/bpmn.json`
- `public/notations/uml.json`
- `public/notations/c4.json`

Runtime mapper:

- `src/modules/diagram/model/registry/notationRegistry.ts`

Node definition registry:

- `src/modules/diagram/model/registry/nodeDefinitions.ts`

## JSON Element Shape

Current mapper reads:

- `type`
- `name`
- `properties`
- `image`
- `preview`
- `renderLabel`
- `defaults.width`
- `defaults.height`
- `defaults.shapeType`
- `defaults.renderLabel`
- `primitives`

JSON files may also contain fields such as `extends`, `icon`, `connections`, `validationRules`, `defaults.style`, but the current runtime mapper does not fully consume all of them yet.

## Runtime Mapping

`notationRegistry.ts` maps raw JSON elements to `NotationDefinition`:

- `type`
- `label`
- `notationId`
- `box`
- `renderLabel`
- `notation`

`notation` contains:

- `id`: `${notationId}.${element.type}`
- `name`
- `image`: top-level PNG/SVG image source for the node
- `preview`: optional PNG/SVG image source for the sidebar preview
- `properties`
- `primitives`

If `primitives` is empty and `defaults.shapeType` exists, mapper creates fallback primitive:

- `rectangle` → `rect`
- `diamond` → `diamond`
- otherwise `rect`

## Properties

Supported normalized property types:

- `text`
- `number`
- `color`
- `select`
- `boolean`

`label` property is filtered out from notation properties. Node label is stored in `DiagramNode.label`.

Default values:

- boolean → `false`
- number → `0`
- select → first option or empty string
- text/color → empty string unless `default` is provided

## Primitives

Supported runtime primitives:

- `rect`
- `circle`
- `diamond`
- `text`
- `svg`
- `image`

Coordinate and size values can be relative (`0..1`) or absolute. `ShapeRenderer` scales relative values to node dimensions.

Image sources can be set as a string URL (`/images/example.png`, `/images/example.svg`) or as an object:

```json
{
  "type": "image",
  "src": "/images/example.png",
  "x": 0,
  "y": 0,
  "width": 1,
  "height": 1,
  "preserveAspectRatio": true
}
```

Inline SVG is also supported through `svg`:

```json
{
  "type": "svg",
  "svg": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\">...</svg>",
  "width": 1,
  "height": 1
}
```

For image blocks with basic editable text, set `renderLabel: true` or `defaults.renderLabel: true`. For custom text primitives, `textKey: "label"` binds the primitive to `DiagramNode.label`.

## Sidebar Integration

`DiagramSidebar` builds items from `nodeDefinitions`, groups them by:

- `base`
- `bpmn`
- `uml`
- `c4`

It renders small previews from `notation.preview`, `notation.image`, `notation.svg`, or falls back to `notation.primitives`. Preview images support PNG, SVG files, and inline SVG strings.

## Current Limitation

Elements with `extends: "edge"` exist in UML/C4 JSON files, but current registry still maps all notation elements into node definitions. A separate `edgeDefinitions`/connection registry is needed for declarative edge tools.
