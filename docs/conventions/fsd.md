# Feature-Sliced Design

The application follows Feature-Sliced Design for main app code.

## Layers

From top to bottom:

1. `app`
2. `pages`
3. `widgets`
4. `features`
5. `entities`
6. `shared`

Rule: a layer may import only layers below it.

## Import Rules

- Prefer aliases such as `@/`, `@shared`, `@app`.
- Avoid deep relative imports across feature boundaries.
- Keep public APIs narrow when a slice is consumed externally.

## Modules

`src/modules/*` is used for isolated systems that do not fit cleanly into a single FSD slice.

Examples:

- diagram editor
- rich text editor

Modules may have their own internal folders (`ui`, `model`, `store`, `canvas`) and should expose a small integration surface to the rest of the app.
