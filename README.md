# satteri-reladraw

A [Sätteri](https://satteri.dev) plugin for [reladraw](https://reladraw.dev) diagrams in Markdown and MDX.

[reladraw](https://reladraw.dev) is a declarative text language for diagrams where you specify relative placement and connections without manually picking coordinates or wrestling with complex layout engines. `satteri-reladraw` integrates reladraw directly into your Sätteri pipeline, compiling code fences into standalone SVGs at build-time or emitting custom web components for client-side rendering.

## Features

- **Blazing Fast**: Compiles reladraw diagrams directly to static SVGs during compilation with zero browser dependencies.
- **Astro / Starlight Auto-Theming**: Automatically adapts to dark and light modes via responsive CSS targeting Starlight's theme switcher (`:root[data-theme='dark']` / `:root[data-theme='light']`) and `@media (prefers-color-scheme: dark)` with zero client-side JavaScript.
- **Transparent Canvas Background**: Optional `transparent` mode to let page backgrounds show through.
- **Client-Side Mode**: Optional `mode: "element"` emits `<reladraw-diagram>` elements for live in-browser rendering.
- **18 Built-In Themes**: Includes all 14 reladraw core themes plus official `github-dark`, `github-light`, `oxocarbon-dark`, and `oxocarbon-light` palettes.
- **Preset Theme Pairs**: Built-in dark/light auto-theming pairs like `github`, `oxocarbon`, `catppuccin`, `solarized`, `gruvbox`, and `high-contrast`.
- **In-Diagram & Custom Theming**: Native support for in-diagram `diagram theme: <name>` statements, plus custom theme definitions and overrides via `themes`.
- **Theme Authoring Utilities**: Helper functions like `defineTheme()`, `createAccent()`, `mixColors()`, `registerTheme()`, and `registerThemes()`.
- **Code Fence Meta**: Override options per-diagram in Markdown code fences (e.g. `reladraw theme=github auto transparent title="System Overview"`).
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

### Basic Usage with Auto-Theming

```ts
import { markdownToHtml } from "satteri";
import { satteriReladraw } from "satteri-reladraw";

const markdown = `
# System Architecture

\`\`\`reladraw theme=github
node app "Web Application"
node store "PostgreSQL" right of app level with app
edge app -> store "reads & writes" from: right to: left
\`\`\`
`;

const { html } = await markdownToHtml(markdown, {
  mdastPlugins: [satteriReladraw({ theme: "auto" })],
});

console.log(html);
```

### Usage with Astro Starlight

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
  integrations: [
    starlight({
      title: "My Documentation",
    }),
  ],
});
```

### Usage in MDX

```ts
import { mdxToJs } from "satteri";
import { satteriReladraw } from "satteri-reladraw";

const { code } = await mdxToJs(markdown, {
  mdastPlugins: [satteriReladraw({ theme: "auto" })],
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
<!-- Auto theme using GitHub Dark and Light palettes -->

```reladraw theme=github tag=figure title="Data Pipeline Flow"
node ingest "Ingest"
node transform "Transform" right of ingest
edge ingest -> transform
```

<!-- Transparent background -->

```reladraw theme=oxocarbon transparent
node a "Source"
node b "Target" right of a
edge a -> b
```

<!-- Fixed single theme -->

```reladraw theme=github-light
node a "Fixed Light"
```

<!-- Client-side web component mode -->

```reladraw mode=element theme=catppuccin-mocha
node a "Alpha"
node b "Beta" right of a
edge a -> b
```
````

Supported meta parameters:

- `theme="<name>"`: Sets a fixed theme (`theme=nord`), auto preset (`theme=github`), or pair (`theme="dark:light"`).
- `auto`: Enables auto dark/light switching for this diagram.
- `transparent`: Sets diagram canvas background to transparent (`fill="none"`).
- `mode="svg" | "element"`: Output format.
- `tag="div" | "figure" | "none"`: Container HTML tag.
- `title="<text>"` or `caption="<text>"`: Caption text when `tag="figure"`.
- `class="<name>"` or `className="<name>"`: Additional CSS class.

## Plugin Configuration Options

`satteriReladraw(options)` accepts the following options:

| Option           | Type                                           | Default        | Description                                                                                      |
| :--------------- | :--------------------------------------------- | :------------- | :----------------------------------------------------------------------------------------------- |
| `theme`          | `string \| Theme \| ThemeDefinition \| 'auto'` | `undefined`    | Default theme, 'auto', or ThemePair.                                                             |
| `autoTheme`      | `boolean \| string \| ThemePair`               | `undefined`    | Enables dual dark/light auto-theming matching Astro/Starlight and system theme switcher.         |
| `transparent`    | `boolean`                                      | `false`        | Renders the SVG canvas background transparent (`fill="none"`) instead of solid theme background. |
| `injectStyles`   | `boolean`                                      | `true`         | Injects responsive auto-theming CSS into HTML output (set `false` if importing `theme.css`).     |
| `themes`         | `Record<string, Theme \| ThemeDefinition>`     | `undefined`    | Custom themes dictionary or overrides for built-in themes.                                       |
| `mode`           | `'svg' \| 'element'`                           | `'svg'`        | `'svg'` compiles to static SVG; `'element'` outputs `<reladraw-diagram>`.                        |
| `tag`            | `'div' \| 'figure' \| null`                    | `'div'`        | Wrapper container tag. If `null`, only raw SVG or `<reladraw-diagram>` is emitted.               |
| `className`      | `string \| null`                               | `'reladraw'`   | CSS class applied to the container.                                                              |
| `languages`      | `string[]`                                     | `['reladraw']` | Code fence languages to process (case-insensitive).                                              |
| `onError`        | `'report' \| 'fallback' \| 'throw'`            | `'report'`     | Error handling strategy when diagram syntax is invalid.                                          |
| `renderError`    | `(err, code) => string`                        | `undefined`    | Custom HTML formatter for errors when `onError: 'report'`.                                       |
| `resolveOptions` | `ResolveOptions`                               | `undefined`    | Additional layout options passed to reladraw solver (e.g. `margin`, `fontSize`).                 |
| `renderOptions`  | `RenderOptions`                                | `undefined`    | Additional rendering options passed to reladraw renderer.                                        |

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
