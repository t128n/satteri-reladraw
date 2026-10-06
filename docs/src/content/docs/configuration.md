---
title: Plugin Configuration Reference
description: Complete options reference for satteri-reladraw.
---

`satteriReladraw(options)` accepts a configuration object to customize diagram rendering and compilation behavior.

## Plugin Options

| Option           | Type                                       | Default        | Description                                                           |
| :--------------- | :----------------------------------------- | :------------- | :-------------------------------------------------------------------- |
| `theme`          | `string \| Theme \| ThemeDefinition`       | `undefined`    | Default theme name, `Theme` object, or `ThemeDefinition`.             |
| `themes`         | `Record<string, Theme \| ThemeDefinition>` | `undefined`    | Custom themes registry or overrides for built-in themes.              |
| `mode`           | `'svg' \| 'element'`                       | `'svg'`        | `'svg'` pre-compiles to SVG; `'element'` emits `<reladraw-diagram>`.  |
| `tag`            | `'div' \| 'figure' \| null`                | `'div'`        | Wrapper container tag. If `null`, no outer wrapper is added.          |
| `className`      | `string \| null`                           | `'reladraw'`   | CSS class applied to the wrapper container.                           |
| `languages`      | `string[]`                                 | `['reladraw']` | List of code fence languages to match (case-insensitive).             |
| `onError`        | `'report' \| 'fallback' \| 'throw'`        | `'report'`     | Error handling behavior on syntax or layout failure.                  |
| `renderError`    | `(err, code) => string`                    | `undefined`    | Custom HTML formatter for errors when `onError: 'report'`.            |
| `resolveOptions` | `ResolveOptions`                           | `undefined`    | Layout options passed to reladraw solver (e.g. `margin`, `fontSize`). |
| `renderOptions`  | `RenderOptions`                            | `undefined`    | Additional rendering options passed to reladraw renderer.             |

---

## Code Fence Meta Parameters

You can override options for individual diagrams directly in the code fence meta string:

````markdown
```reladraw theme=nord tag=figure title="Data Flow" class="my-chart"
node a "Source"
node b "Target" right of a
edge a -> b
```
````

| Meta Attribute        | Accepted Values                 | Example                                     |
| :-------------------- | :------------------------------ | :------------------------------------------ |
| `theme`               | Any valid theme name            | `theme=dracula`, `theme="catppuccin-mocha"` |
| `mode`                | `svg`, `element`                | `mode=element`                              |
| `tag`                 | `div`, `figure`, `none`, `null` | `tag=figure`                                |
| `title`               | Any string                      | `title="System Flow"`                       |
| `caption`             | Any string                      | `caption="Figure 2.1"`                      |
| `class` / `className` | CSS classes                     | `class="custom-box shadow"`                 |

---

## Error Handling Strategies

### `onError: 'report'` (Default)

When a diagram encounters a syntax error:

1. Pushes an error diagnostic via Sätteri's `ctx.report()`.
2. Emits a `<div class="reladraw-error"><pre><code>...</code></pre></div>` placeholder element containing the error message, line number, and original code.

### `onError: 'fallback'`

When a diagram encounters a syntax error:

1. Logs a warning diagnostic via `ctx.report()`.
2. Keeps the original Markdown code fence intact (renders as normal `<pre><code>...</code></pre>`).

### `onError: 'throw'`

Throws the error immediately, causing the Markdown/MDX compile step to abort.
