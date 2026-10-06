# satteri-reladraw

A [Sätteri](https://satteri.dev) plugin for [reladraw](https://reladraw.dev) diagrams in Markdown and MDX.

[reladraw](https://reladraw.dev) is a declarative text language for diagrams where you specify relative placement and connections without manually picking coordinates or wrestling with complex layout engines. `satteri-reladraw` integrates reladraw directly into your Sätteri pipeline, compiling code fences into standalone SVGs at build-time or emitting custom web components for client-side rendering.

## Features

- **Blazing Fast**: Compiles reladraw diagrams directly to static SVGs during compilation with zero browser dependencies.
- **Client-Side Mode**: Optional `mode: "element"` emits `<reladraw-diagram>` elements for live in-browser rendering.
- **Rich Themes**: Supports all 14 built-in reladraw themes (`dark`, `light`, `solarized-dark`, `solarized-light`, `gruvbox-dark`, `gruvbox-light`, `catppuccin-mocha`, `catppuccin-latte`, `nord`, `dracula`, `vesper`, `high-contrast-dark`, `high-contrast-light`, `print`) plus custom theme objects.
- **Code Fence Meta**: Override options per-diagram in Markdown code fences (e.g. `reladraw theme=light title="System Overview"`).
- **Flexible Containers**: Wrap diagrams in `<div>`, `<figure>` with `<figcaption>`, or omit wrappers entirely.
- **Robust Error Handling**: Configurable behavior on syntax errors (`report` diagnostics, `fallback` to raw code block, or `throw`).
- **MDX & HTML Ready**: Works seamlessly with both `markdownToHtml` and `mdxToJs`.
- **Both MDAST & HAST Plugins**: Primary `satteriReladraw` MDAST plugin and `satteriReladrawHast` HAST plugin.

## Installation

```bash
bun add satteri-reladraw reladraw
# or
npm install satteri-reladraw reladraw
# or
pnpm add satteri-reladraw reladraw
```

_(Note: `satteri` is a peer dependency)_

## Quick Start

```ts
import { markdownToHtml } from "satteri";
import { satteriReladraw } from "satteri-reladraw";

const markdown = `
# System Architecture

\`\`\`reladraw
node app "Web Application"
node store "PostgreSQL" right of app level with app
edge app -> store "reads & writes" from: right to: left
\`\`\`
`;

const { html } = await markdownToHtml(markdown, {
  mdastPlugins: [satteriReladraw({ theme: "dark" })],
});

console.log(html);
```

### Usage in MDX

```ts
import { mdxToJs } from "satteri";
import { satteriReladraw } from "satteri-reladraw";

const { code } = await mdxToJs(markdown, {
  mdastPlugins: [satteriReladraw()],
});
```

## Markdown Code Fence Syntax

Write diagrams inside code blocks with language `reladraw`:

````markdown
```reladraw
node client "Client"
node api "API Gateway" right of client
node db "Database" right of api
edge client -> api "HTTPS"
edge api -> db "gRPC"
```
````

### Code Fence Meta Options

You can specify per-diagram settings directly in the code fence meta string:

````markdown
<!-- Use light theme and a custom title with figure wrapper -->

```reladraw theme=light tag=figure title="Data Pipeline Flow"
node ingest "Ingest"
node transform "Transform" right of ingest
edge ingest -> transform
```

<!-- Client-side web component mode -->

```reladraw mode=element theme=catppuccin-mocha
node a "Alpha"
node b "Beta" right of a
edge a -> b
```

<!-- Custom wrapper class -->

```reladraw class="architecture-chart"
node a "Core"
```
````

Supported meta parameters:

- `theme="<name>"`: Sets the theme for this diagram.
- `mode="svg" | "element"`: Output format.
- `tag="div" | "figure" | "none"`: Container HTML tag.
- `title="<text>"` or `caption="<text>"`: Caption text when `tag="figure"`.
- `class="<name>"` or `className="<name>"`: Additional CSS class.

## Plugin Configuration Options

`satteriReladraw(options)` accepts the following options:

| Option           | Type                                | Default        | Description                                                                        |
| :--------------- | :---------------------------------- | :------------- | :--------------------------------------------------------------------------------- |
| `theme`          | `string \| Theme`                   | `undefined`    | Default theme name or custom `Theme` object.                                       |
| `mode`           | `'svg' \| 'element'`                | `'svg'`        | `'svg'` compiles to static SVG; `'element'` outputs `<reladraw-diagram>`.          |
| `tag`            | `'div' \| 'figure' \| null`         | `'div'`        | Wrapper container tag. If `null`, only raw SVG or `<reladraw-diagram>` is emitted. |
| `className`      | `string \| null`                    | `'reladraw'`   | CSS class applied to the container.                                                |
| `languages`      | `string[]`                          | `['reladraw']` | Code fence languages to process (case-insensitive).                                |
| `onError`        | `'report' \| 'fallback' \| 'throw'` | `'report'`     | Error handling strategy when diagram syntax is invalid.                            |
| `renderError`    | `(err, code) => string`             | `undefined`    | Custom HTML formatter for errors when `onError: 'report'`.                         |
| `resolveOptions` | `ResolveOptions`                    | `undefined`    | Additional layout options passed to reladraw solver (e.g. `margin`, `fontSize`).   |
| `renderOptions`  | `RenderOptions`                     | `undefined`    | Additional rendering options passed to reladraw renderer.                          |

### Error Handling Strategies

- `'report'` _(default)_: Reports a diagnostic error through Sätteri's context (`ctx.report`) and emits a `<div class="reladraw-error"><pre><code>...</code></pre></div>` element containing the error details and line number.
- `'fallback'`: Emits a diagnostic warning and leaves the original Markdown code fence intact.
- `'throw'`: Throws the error, immediately aborting the Sätteri compilation.

## Development & Pipeline

This repository uses [Bun](https://bun.com) for package management and testing, [oxlint](https://oxc.rs) & [oxfmt](https://oxc.rs) for linting and formatting, [hk](https://hk.jdx.dev) for Git hooks, and [Changesets](https://github.com/changesets/changesets) for release management.

```bash
# Install dependencies
bun install

# Run tests
bun test

# Typecheck
bun run typecheck

# Lint and format
bun run lint
bun run format:check

# Run all checks via hk
hk check --all

# Build distribution bundle
bun run build

# Create a changeset
bun run changeset
```

## License

[MIT](LICENSE) © [Torben Haack](https://github.com/t128n)
