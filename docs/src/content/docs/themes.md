---
title: Themes & Styling
description: Explore Astro auto-theming, 18 built-in palettes, GitHub & Oxocarbon themes, transparent backgrounds, and custom palettes.
---

`satteri-reladraw` provides a complete theming engine with **Astro / Starlight auto-theming**, **18 built-in themes**, and seamless custom palette authoring.

---

## Astro Integrated Auto-Theming

With auto-theming enabled, diagrams automatically react to your Astro Starlight theme toggle (**Dark**, **Light**, or **System** preference) with **zero JavaScript runtime**, **zero layout shift**, and **zero page reload**.

### How It Works

Under the hood, `satteri-reladraw` pre-renders dual SVGs (dark and light variants) and wraps them in responsive CSS that binds directly to Starlight's `:root[data-theme='dark']` / `:root[data-theme='light']` attributes and `@media (prefers-color-scheme: dark)`.

### Global Auto-Theming

Enable it site-wide in `astro.config.mjs`:

```js
import { satteriReladraw } from "satteri-reladraw";

satteriReladraw({ theme: "auto" });
```

### Auto-Theming Demo: Default Theme Pair

Uses reladraw's default `dark` and `light` themes:

```reladraw theme=auto title="Auto-Themed Diagram (Default Pair)" tag=figure
node client "Browser / Client"
node edge "Edge Gateway" right of client
node db "Database" right of edge

edge client -> edge "HTTPS"
edge edge -> db "gRPC"
```

````markdown
```reladraw theme=auto
node client "Browser / Client"
node edge "Edge Gateway" right of client
node db "Database" right of edge

edge client -> edge "HTTPS"
edge edge -> db "gRPC"
```
````

### Auto-Theming Demo: GitHub Pair (`theme=github`)

Automatically switches between **GitHub Dark** and **GitHub Light** palettes:

```reladraw theme=github title="GitHub Auto Theme (Switches Dark/Light)" tag=figure
node runner "Actions Runner"
node ghcr "GitHub Packages" right of runner
node deploy "Production Env" right of ghcr level with ghcr

edge runner -> ghcr "publish image"
edge ghcr -> deploy "pull & roll out"
```

````markdown
```reladraw theme=github
node runner "Actions Runner"
node ghcr "GitHub Packages" right of runner
node deploy "Production Env" right of ghcr level with ghcr

edge runner -> ghcr "publish image"
edge ghcr -> deploy "pull & roll out"
```
````

### Auto-Theming Demo: Oxocarbon Pair (`theme=oxocarbon`)

Automatically switches between **Oxocarbon Dark** and **Oxocarbon Light** palettes:

```reladraw theme=oxocarbon title="Oxocarbon Auto Theme (Switches Dark/Light)" tag=figure
node ingest "Telemetry Collector"
node stream "Kafka / Redpanda" right of ingest
node clickhouse "ClickHouse OLAP" right of stream

edge ingest -> stream "ingest batches"
edge stream -> clickhouse "stream sync"
```

````markdown
```reladraw theme=oxocarbon
node ingest "Telemetry Collector"
node stream "Kafka / Redpanda" right of ingest
node clickhouse "ClickHouse OLAP" right of stream

edge ingest -> stream "ingest batches"
edge stream -> clickhouse "stream sync"
```
````

### Built-in Auto Theme Pairs

You can pass any of these pair presets via `theme="<name>"` or `autoTheme="<name>"`:

| Preset Name     | Dark Variant         | Light Variant         | Description                                                                                              |
| :-------------- | :------------------- | :-------------------- | :------------------------------------------------------------------------------------------------------- |
| `auto`          | `dark`               | `light`               | Default reladraw pair                                                                                    |
| `github`        | `github-dark`        | `github-light`        | [GitHub Primer / github-vscode-theme](https://github.com/primer/github-vscode-theme)                     |
| `oxocarbon`     | `oxocarbon-dark`     | `oxocarbon-light`     | [nyoom-engineering/base16-oxocarbon](https://github.com/nyoom-engineering/base16-oxocarbon) (IBM Carbon) |
| `catppuccin`    | `catppuccin-mocha`   | `catppuccin-latte`    | Soothing pastel palettes                                                                                 |
| `solarized`     | `solarized-dark`     | `solarized-light`     | Ethan Schoonover palettes                                                                                |
| `gruvbox`       | `gruvbox-dark`       | `gruvbox-light`       | Retro groove warm palettes                                                                               |
| `high-contrast` | `high-contrast-dark` | `high-contrast-light` | High accessibility contrast                                                                              |

### Custom Theme Pairs

You can also specify arbitrary pairs using the `dark:light` or `dark/light` syntax:

````markdown
```reladraw theme="dracula:github-light"
node a -> node b
```
````

Or define a custom pair object in plugin options:

```js
satteriReladraw({
  autoTheme: {
    dark: "my-dark-palette",
    light: "my-light-palette",
  },
});
```

---

## Transparent Canvas Background

By default, reladraw fills the canvas background with the theme's background color. If you want the diagram to seamlessly blend into your documentation background without a solid box, enable `transparent`:

### Transparent Diagram Demo

```reladraw theme=github transparent title="Transparent Background Diagram" tag=figure
node auth "Auth Service"
node redis "Session Cache" right of auth
node audit "Audit Logs" below auth

edge auth -> redis "validate token"
edge auth -> audit "record event"
```

````markdown
```reladraw theme=github transparent
node auth "Auth Service"
node redis "Session Cache" right of auth
node audit "Audit Logs" below auth

edge auth -> redis "validate token"
edge auth -> audit "record event"
```
````

You can also configure `transparent: true` globally in `astro.config.mjs`:

```js
satteriReladraw({
  theme: "auto",
  transparent: true,
});
```

---

## Pinned Single Themes

When you want a specific diagram to always use one fixed theme (regardless of the reader's active dark/light mode), pass the single theme name to `theme="..."`.

### GitHub Dark

```reladraw theme=github-dark title="Pinned GitHub Dark Theme" tag=figure
node runner "Actions Runner"
node ghcr "GitHub Packages" right of runner
node deploy "Production Env" right of ghcr level with ghcr

edge runner -> ghcr "publish image"
edge ghcr -> deploy "pull & roll out"
```

````markdown
```reladraw theme=github-dark
node runner "Actions Runner"
node ghcr "GitHub Packages" right of runner
node deploy "Production Env" right of ghcr level with ghcr

edge runner -> ghcr "publish image"
edge ghcr -> deploy "pull & roll out"
```
````

### GitHub Light

```reladraw theme=github-light title="Pinned GitHub Light Theme" tag=figure
node runner "Actions Runner"
node ghcr "GitHub Packages" right of runner
node deploy "Production Env" right of ghcr level with ghcr

edge runner -> ghcr "publish image"
edge ghcr -> deploy "pull & roll out"
```

````markdown
```reladraw theme=github-light
node runner "Actions Runner"
node ghcr "GitHub Packages" right of runner
node deploy "Production Env" right of ghcr level with ghcr

edge runner -> ghcr "publish image"
edge ghcr -> deploy "pull & roll out"
```
````

### Oxocarbon Dark & Light

```reladraw theme=oxocarbon-dark title="Pinned Oxocarbon Dark" tag=figure
node kafka "Kafka Broker"
node flink "Apache Flink" right of kafka
edge kafka -> flink "events"
```

```reladraw theme=oxocarbon-light title="Pinned Oxocarbon Light" tag=figure
node kafka "Kafka Broker"
node flink "Apache Flink" right of kafka
edge kafka -> flink "events"
```

---

## In-Diagram Theming

reladraw supports defining diagram attributes directly inside the source text using `diagram theme: <name>`. `satteri-reladraw` fully supports this:

```reladraw title="In-Diagram Vesper Theme" tag=figure
diagram theme: vesper
node engine "Compiler Core"
node codegen "Code Generator" right of engine
edge engine -> codegen "IR"
```

````markdown
```reladraw
diagram theme: vesper
node engine "Compiler Core"
node codegen "Code Generator" right of engine
edge engine -> codegen "IR"
```
````

> In-diagram `diagram theme:` statements take precedence over global defaults, giving authors per-diagram control inside Markdown.

---

## Custom Themes Configuration

You can register custom themes in `options.themes` in your Astro config:

```js
import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import { satteriReladraw } from "satteri-reladraw";

export default defineConfig({
  markdown: {
    processor: satteri({
      mdastPlugins: [
        satteriReladraw({
          theme: "auto",
          themes: {
            synthwave: {
              background: "#262335",
              boxFill: "#241b2f",
              boxStroke: "#ff7edb",
              text: "#f92aad",
              edge: "#03edf9",
              primary: { color: "#3b82f6", subtle: "#1e293b", on: "#ffffff" },
              secondary: { color: "#ec4899", subtle: "#4a154b", on: "#ffffff" },
            },
          },
        }),
      ],
    }),
  },
});
```

Then simply reference your custom theme anywhere in Markdown:

````markdown
```reladraw theme=synthwave
node client "Client"
node api "API" right of client
edge client -> api "fetch"
```
````

Or inside reladraw diagram syntax:

````markdown
```reladraw
diagram theme: synthwave
node client "Client"
node api "API" right of client
edge client -> api "fetch"
```
````

---

## Theme Helper Utilities

`satteri-reladraw` exports utilities to make theme creation easy:

- **`registerTheme(name, definition)`**: Dynamically registers a custom theme into reladraw's runtime.
- **`registerThemes(dictionary)`**: Registers multiple themes at once.
- **`defineTheme(definition)`**: Automatically computes missing colors like `containerFill`, `containerStroke`, `mutedText`, `iconInk`, and accents.
- **`createAccent(color, page, on?, subtle?)`**: Helper for creating valid `primary` or `secondary` theme accent objects.
- **`mixColors(color, page, amount?)`**: Blends two hex colors by a specified ratio.

```ts
import { defineTheme, createAccent, registerTheme } from "satteri-reladraw";

const myTheme = registerTheme(
  "brand-theme",
  defineTheme({
    background: "#181825",
    boxFill: "#1e1e2e",
    boxStroke: "#45475a",
    text: "#cdd6f4",
    edge: "#cba6f7",
    primary: createAccent("#89b4fa", "#181825", "#ffffff"),
  }),
);
```

---

## Complete List of Built-In Themes

| Theme Name            | Type  | Palette Origin                                                                              | Notes                        |
| :-------------------- | :---- | :------------------------------------------------------------------------------------------ | :--------------------------- |
| `github-dark`         | Dark  | [GitHub Primer / github-vscode-theme](https://github.com/primer/github-vscode-theme)        | Modern GitHub dark canvas    |
| `github-light`        | Light | [GitHub Primer / github-vscode-theme](https://github.com/primer/github-vscode-theme)        | Modern GitHub light canvas   |
| `oxocarbon-dark`      | Dark  | [nyoom-engineering/base16-oxocarbon](https://github.com/nyoom-engineering/base16-oxocarbon) | Industrial high-contrast     |
| `oxocarbon-light`     | Light | [nyoom-engineering/base16-oxocarbon](https://github.com/nyoom-engineering/base16-oxocarbon) | Crisp light canvas           |
| `dark`                | Dark  | reladraw default                                                                            | Default fallback theme       |
| `light`               | Light | reladraw core                                                                               | Clean white background       |
| `catppuccin-mocha`    | Dark  | Catppuccin                                                                                  | Soothing pastel dark         |
| `catppuccin-latte`    | Light | Catppuccin                                                                                  | Soothing pastel light        |
| `nord`                | Dark  | Arctic Nord                                                                                 | Arctic, north-bluish palette |
| `dracula`             | Dark  | Dracula                                                                                     | Classic dark vampire palette |
| `vesper`              | Dark  | Vesper (Rauno Freiberg)                                                                     | Deep black & amber accents   |
| `solarized-dark`      | Dark  | Ethan Schoonover                                                                            | Teal-slate precision palette |
| `solarized-light`     | Light | Ethan Schoonover                                                                            | Cream precision palette      |
| `gruvbox-dark`        | Dark  | Pavel Pertsev                                                                               | Retro groove warm dark       |
| `gruvbox-light`       | Light | Pavel Pertsev                                                                               | Retro groove warm light      |
| `high-contrast-dark`  | Dark  | Accessibility                                                                               | Maximum readability dark     |
| `high-contrast-light` | Light | Accessibility                                                                               | Maximum readability light    |
| `print`               | Light | Print-friendly                                                                              | Monochrome ink saver         |

---

## Credits & Palette Attribution

- **GitHub Dark & Light**: Colors adapted from the [GitHub Primer](https://primer.style) design system and [primer/github-vscode-theme](https://github.com/primer/github-vscode-theme).
- **Oxocarbon Dark & Light**: Colors adapted from the Base16 Oxocarbon theme by [nyoom-engineering/base16-oxocarbon](https://github.com/nyoom-engineering/base16-oxocarbon), inspired by the IBM Carbon design system.
