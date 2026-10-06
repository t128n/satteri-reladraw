# satteri-reladraw

A [Sätteri](https://satteri.dev) plugin that compiles [reladraw](https://reladraw.dev) code fences into inline SVG or custom elements.

reladraw is a declarative diagram syntax based on relative placement and explicit connections. `satteri-reladraw` integrates reladraw into Sätteri Markdown and MDX pipelines, rendering diagrams at build time without headless browsers or runtime dependencies.

## What it does

- **Build-Time SVG Rendering**: Compiles reladraw diagrams into standalone inline SVGs during Markdown/MDX processing.
- **Dark/Light Auto-Theming**: Generates dual dark and light SVG variants toggled via CSS (`:root[data-theme='dark']`, `.dark`, and `@media (prefers-color-scheme: dark)`). Integrates directly with Astro Starlight's theme toggle with zero client-side JavaScript.
- **18 Built-in Themes**: Ships with core reladraw themes plus GitHub (Light/Dark) and Oxocarbon (Dark/Light) palettes.
- **Preset Theme Pairs**: Switch between paired palettes (such as `github`, `oxocarbon`, `catppuccin`, `solarized`, or `gruvbox`) using `theme="<name>"`.
- **Transparent Canvas**: Supports transparent backgrounds (`transparent` / `fill="none"`) to blend into documentation pages.
- **In-Diagram & Custom Themes**: Supports in-diagram `diagram theme: <name>` statements, custom palette definitions, and theme authoring utilities (`defineTheme`, `registerTheme`).
- **Web Component Mode**: Optional `mode: "element"` emits `<reladraw-diagram>` custom elements for client-side rendering.
- **Configurable Containers**: Emits `<div>`, `<figure>` with `<figcaption>`, or raw SVGs without wrappers.
- **Error Handling**: Configurable error strategies (`report` diagnostics, `fallback` to raw code block, or `throw`).

## Installation

```bash
bun add satteri-reladraw reladraw
# or
npm install satteri-reladraw reladraw
# or
pnpm add satteri-reladraw reladraw
```

`satteri` is a peer dependency (`>=0.10.0`).

## Quick Start

### Basic Usage

````ts
import { markdownToHtml } from "satteri";
import { satteriReladraw } from "satteri-reladraw";

const markdown = `
# Architecture

```reladraw
node client "Client"
node api "API Gateway" right of client
node db "Database" right of api
edge client -> api "HTTPS"
edge api -> db "gRPC"
```
`;

const { html } = await markdownToHtml(markdown, {
  mdastPlugins: [satteriReladraw({ theme: "auto" })],
});
````

### Astro Starlight Integration

In `astro.config.mjs`:

```js
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { satteri } from "@astrojs/markdown-satteri";
import { satteriReladraw } from "satteri-reladraw";

export default defineConfig({
  markdown: {
    processor: satteri({
      mdastPlugins: [satteriReladraw({ theme: "auto" })],
    }),
  },
  integrations: [starlight({ title: "Documentation" })],
});
```

When `theme: "auto"` is set, all diagrams adapt automatically when readers toggle between light and dark modes in Starlight.

### MDX Usage

```ts
import { mdxToJs } from "satteri";
import { satteriReladraw } from "satteri-reladraw";

const { code } = await mdxToJs(markdown, {
  mdastPlugins: [satteriReladraw({ theme: "auto" })],
});
```

## Code Fence Syntax

Use code fences tagged with `reladraw`:

````markdown
```reladraw
node app "App"
node cache "Redis" right of app
edge app -> cache "queries"
```
````

### Fence Attributes

Override options per diagram using fence attributes:

````markdown
<!-- Auto-theme with GitHub Dark and Light palettes -->

```reladraw theme=github tag=figure title="GitHub Pipeline"
node runner "Runner"
node deploy "Deploy" right of runner
edge runner -> deploy
```

<!-- Transparent background -->

```reladraw theme=oxocarbon transparent
node a "Alpha"
node b "Beta" right of a
edge a -> b
```

<!-- Fixed theme -->

```reladraw theme=nord
node a "Fixed Nord Theme"
```

<!-- Web component mode -->

```reladraw mode=element
node a "Client Rendered"
```
````

| Attribute             | Values                          | Description                                               |
| :-------------------- | :------------------------------ | :-------------------------------------------------------- |
| `theme`               | Theme name or pair preset       | Theme name (`nord`, `dracula`) or pair (`github`, `auto`) |
| `auto`                | Boolean flag                    | Enables light/dark dual rendering for this diagram        |
| `transparent`         | Boolean flag                    | Renders background rect as `fill="none"`                  |
| `mode`                | `svg`, `element`                | Output format (`svg` compiles static SVG)                 |
| `tag`                 | `div`, `figure`, `none`, `null` | Container tag                                             |
| `title` / `caption`   | String                          | Caption text when `tag="figure"`                          |
| `class` / `className` | String                          | Additional CSS class on wrapper                           |

## Configuration Options

`satteriReladraw(options)` accepts:

| Option           | Type                                           | Default        | Description                                                                                      |
| :--------------- | :--------------------------------------------- | :------------- | :----------------------------------------------------------------------------------------------- |
| `theme`          | `string \| Theme \| ThemeDefinition \| 'auto'` | `undefined`    | Default theme name, Theme object, ThemeDefinition, 'auto', or ThemePair.                         |
| `autoTheme`      | `boolean \| string \| ThemePair`               | `undefined`    | Enables dual dark/light auto-theming matching Astro/Starlight and system theme switcher.         |
| `transparent`    | `boolean`                                      | `false`        | Renders the SVG canvas background transparent (`fill="none"`) instead of solid theme background. |
| `injectStyles`   | `boolean`                                      | `true`         | Injects responsive auto-theming CSS into HTML output (set `false` if importing `theme.css`).     |
| `themes`         | `Record<string, Theme \| ThemeDefinition>`     | `undefined`    | Custom themes registry or overrides for built-in themes.                                         |
| `mode`           | `'svg' \| 'element'`                           | `'svg'`        | `'svg'` compiles to static SVG; `'element'` outputs `<reladraw-diagram>`.                        |
| `tag`            | `'div' \| 'figure' \| null`                    | `'div'`        | Wrapper container tag. If `null`, only raw SVG or `<reladraw-diagram>` is emitted.               |
| `className`      | `string \| null`                               | `'reladraw'`   | CSS class applied to the container.                                                              |
| `languages`      | `string[]`                                     | `['reladraw']` | Code fence languages to process (case-insensitive).                                              |
| `onError`        | `'report' \| 'fallback' \| 'throw'`            | `'report'`     | Error handling strategy when diagram syntax is invalid.                                          |
| `renderError`    | `(err, code) => string`                        | `undefined`    | Custom HTML formatter for errors when `onError: 'report'`.                                       |
| `resolveOptions` | `ResolveOptions`                               | `undefined`    | Additional layout options passed to reladraw solver (e.g. `margin`, `fontSize`).                 |
| `renderOptions`  | `RenderOptions`                                | `undefined`    | Additional rendering options passed to reladraw renderer.                                        |

### Built-in Themes

- **GitHub**: `github-dark`, `github-light` (adapted from [primer/github-vscode-theme](https://github.com/primer/github-vscode-theme))
- **Oxocarbon**: `oxocarbon-dark`, `oxocarbon-light` (adapted from [nyoom-engineering/base16-oxocarbon](https://github.com/nyoom-engineering/base16-oxocarbon))
- **Core reladraw**: `dark`, `light`, `solarized-dark`, `solarized-light`, `gruvbox-dark`, `gruvbox-light`, `catppuccin-mocha`, `catppuccin-latte`, `nord`, `dracula`, `vesper`, `high-contrast-dark`, `high-contrast-light`, `print`

### Built-in Auto Theme Pairs

- `auto` (`dark` / `light`)
- `github` (`github-dark` / `github-light`)
- `oxocarbon` (`oxocarbon-dark` / `oxocarbon-light`)
- `catppuccin` (`catppuccin-mocha` / `catppuccin-latte`)
- `solarized` (`solarized-dark` / `solarized-light`)
- `gruvbox` (`gruvbox-dark` / `gruvbox-light`)
- `high-contrast` (`high-contrast-dark` / `high-contrast-light`)

### Error Handling

- `'report'` _(default)_: Reports a diagnostic error via `ctx.report` and renders a `<div class="reladraw-error">` block with line number and source snippet.
- `'fallback'`: Emits a diagnostic warning and leaves the original Markdown code fence unchanged.
- `'throw'`: Throws the error, aborting compilation.

## Development

```bash
bun install
bun test
bun run typecheck
bun run lint
bun run format:check
bun run build
```

## Credits

- [reladraw](https://reladraw.dev), declarative constraint-based diagramming engine.
- [Sätteri](https://satteri.dev), content processing engine.
- [GitHub Primer / github-vscode-theme](https://github.com/primer/github-vscode-theme), palette reference for GitHub Dark and Light themes.
- [Oxocarbon (base16-oxocarbon)](https://github.com/nyoom-engineering/base16-oxocarbon), palette reference for Oxocarbon Dark and Light themes.

## License

[MIT](LICENSE) © [Torben Haack](https://github.com/t128n)
