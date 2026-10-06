---
title: Themes & Styling
description: Explore the 18 built-in themes, GitHub & Oxocarbon palettes, and custom theme configuration in satteri-reladraw.
---

`satteri-reladraw` includes **18 built-in themes** out of the box — including the 14 core `reladraw` themes plus official **GitHub** (Light/Dark) and **Oxocarbon** (Dark/Light) palettes.

You can set a default theme in your plugin configuration, specify custom themes, or select a theme per diagram using the `theme="<name>"` code fence meta attribute.

---

## GitHub Dark & GitHub Light

Designed to seamlessly match GitHub Primer color systems:

### GitHub Dark

```reladraw theme=github-dark title="GitHub Dark Theme" tag=figure
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

```reladraw theme=github-light title="GitHub Light Theme" tag=figure
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

---

## Oxocarbon Dark & Oxocarbon Light

Based on [nyoom-engineering/base16-oxocarbon](https://github.com/nyoom-engineering/base16-oxocarbon) and IBM Carbon's industrial design language.

### Oxocarbon Dark

```reladraw theme=oxocarbon-dark title="Oxocarbon Dark Theme" tag=figure
node kafka "Kafka Broker"
node flink "Apache Flink" right of kafka
node sink "ClickHouse" right of flink level with flink

edge kafka -> flink "stream telemetry"
edge flink -> sink "windowed aggregation"
```

````markdown
```reladraw theme=oxocarbon-dark
node kafka "Kafka Broker"
node flink "Apache Flink" right of kafka
node sink "ClickHouse" right of flink level with flink

edge kafka -> flink "stream telemetry"
edge flink -> sink "windowed aggregation"
```
````

### Oxocarbon Light

```reladraw theme=oxocarbon-light title="Oxocarbon Light Theme" tag=figure
node kafka "Kafka Broker"
node flink "Apache Flink" right of kafka
node sink "ClickHouse" right of flink level with flink

edge kafka -> flink "stream telemetry"
edge flink -> sink "windowed aggregation"
```

````markdown
```reladraw theme=oxocarbon-light
node kafka "Kafka Broker"
node flink "Apache Flink" right of kafka
node sink "ClickHouse" right of flink level with flink

edge kafka -> flink "stream telemetry"
edge flink -> sink "windowed aggregation"
```
````

---

## Catppuccin Mocha & Latte

```reladraw theme=catppuccin-mocha title="Catppuccin Mocha Theme" tag=figure
node a "Source"
node b "Transform" right of a
node c "Sink" right of b level with b
edge a -> b "step 1"
edge b -> c "step 2"
```

```reladraw theme=catppuccin-latte title="Catppuccin Latte (Light) Theme" tag=figure
node a "Source"
node b "Transform" right of a
node c "Sink" right of b level with b
edge a -> b "step 1"
edge b -> c "step 2"
```

---

## Nord & Dracula

```reladraw theme=nord title="Nord Theme" tag=figure
node api "API Gateway"
node srv "Microservice" right of api
edge api -> srv "route request"
```

```reladraw theme=dracula title="Dracula Theme" tag=figure
node api "API Gateway"
node srv "Microservice" right of api
edge api -> srv "route request"
```

---

## Vesper & Solarized

```reladraw theme=vesper title="Vesper Theme" tag=figure
node queue "Job Queue"
node worker "Worker Pool" right of queue
edge queue -> worker "dispatch task"
```

```reladraw theme=solarized-dark title="Solarized Dark Theme" tag=figure
node a "Solarized Dark"
node b "Target" right of a
edge a -> b "sync"
```

---

## Configuring Custom Themes

You can register custom themes in your plugin configuration using the `themes` option:

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import { satteri } from "@astrojs/markdown-satteri";
import { satteriReladraw, defineTheme } from "satteri-reladraw";

export default defineConfig({
  markdown: {
    processor: satteri({
      mdastPlugins: [
        satteriReladraw({
          defaultTheme: "github-dark",
          themes: {
            // Register a custom theme
            synthwave: defineTheme({
              background: "#262335",
              boxFill: "#241b2f",
              boxStroke: "#fe4450",
              text: "#f92aad",
              edge: "#72f1b8",
            }),
            // Or override an existing built-in theme like 'dark'
            dark: {
              background: "#0d0d0d",
              boxFill: "#1a1a1a",
              boxStroke: "#333333",
              containerFill: "#141414",
              containerStroke: "#222222",
              text: "#ffffff",
              mutedText: "#888888",
              edge: "#3b82f6",
              iconInk: "#cccccc",
              iconShade: "#222222",
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

---

## Theme Helper Utilities

`satteri-reladraw` provides built-in utilities to make theme authoring effortless:

- **`defineTheme(definition)`**: Automatically computes missing colors like `containerFill`, `containerStroke`, `mutedText`, `iconInk`, and accents.
- **`createAccent(color, page, on?, subtle?)`**: Helper for creating valid `primary` or `secondary` theme accent objects.
- **`mixColors(color, page, amount?)`**: Blends two hex colors by a specified ratio.

```ts
import { defineTheme, createAccent } from "satteri-reladraw";

const myTheme = defineTheme({
  background: "#181825",
  boxFill: "#1e1e2e",
  boxStroke: "#45475a",
  text: "#cdd6f4",
  edge: "#cba6f7",
  primary: createAccent("#89b4fa", "#181825", "#ffffff"),
});
```

---

## List of All Available Theme Names

| Theme Name            | Type  | Palette Origin          | Notes                        |
| :-------------------- | :---- | :---------------------- | :--------------------------- |
| `github-dark`         | Dark  | GitHub Primer           | Modern GitHub dark canvas    |
| `github-light`        | Light | GitHub Primer           | Modern GitHub light canvas   |
| `oxocarbon-dark`      | Dark  | Base16 Oxocarbon / IBM  | Industrial high-contrast     |
| `oxocarbon-light`     | Light | Base16 Oxocarbon / IBM  | Crisp light canvas           |
| `dark`                | Dark  | reladraw default        | Default fallback theme       |
| `light`               | Light | reladraw core           | Clean white background       |
| `catppuccin-mocha`    | Dark  | Catppuccin              | Soothing pastel dark         |
| `catppuccin-latte`    | Light | Catppuccin              | Soothing pastel light        |
| `nord`                | Dark  | Arctic Nord             | Arctic, north-bluish palette |
| `dracula`             | Dark  | Dracula                 | Classic dark vampire palette |
| `vesper`              | Dark  | Vesper (Rauno Freiberg) | Deep black & amber accents   |
| `solarized-dark`      | Dark  | Ethan Schoonover        | Teal-slate precision palette |
| `solarized-light`     | Light | Ethan Schoonover        | Cream precision palette      |
| `gruvbox-dark`        | Dark  | Pavel Pertsev           | Retro groove warm dark       |
| `gruvbox-light`       | Light | Pavel Pertsev           | Retro groove warm light      |
| `high-contrast-dark`  | Dark  | Accessibility           | Maximum readability dark     |
| `high-contrast-light` | Light | Accessibility           | Maximum readability light    |
| `print`               | Light | Print-friendly          | Monochrome ink saver         |
