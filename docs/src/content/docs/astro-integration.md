---
title: Astro Starlight Integration Guide
description: Step-by-step guide for integrating satteri-reladraw into Astro Starlight using Sätteri.
---

This guide walks you through integrating `satteri-reladraw` into an [Astro](https://astro.build) project using [Starlight](https://starlight.astro.build) and [Sätteri](https://satteri.dev).

## Background: Astro & Sätteri

In modern Astro (v7+), **Sätteri** powers Markdown and MDX processing via the `@astrojs/markdown-satteri` adapter. Because Sätteri operates on a high-performance Rust-backed AST, it uses Sätteri MDAST and HAST plugins rather than legacy remark or rehype plugins.

Because Starlight is built on top of Astro's content layer, any plugin added to Astro's `markdown.processor` is automatically applied to all documentation pages in your Starlight site!

```reladraw theme=vesper title="Astro & Starlight Sätteri Pipeline" tag=figure
node source "Markdown / MDX"
node satteri "Sätteri Compiler" right of source
node plugin "satteri-reladraw" below satteri
node starlight "Starlight Documentation Site" right of satteri

edge source -> satteri "parses"
edge satteri <-> plugin "transforms code blocks"
edge satteri -> starlight "HTML + Static SVG"
```

## Step 1: Install Dependencies

In your Astro / Starlight project, install `satteri-reladraw`, `reladraw`, and `@astrojs/markdown-satteri`:

```bash
bun add satteri-reladraw reladraw @astrojs/markdown-satteri
# or
npm install satteri-reladraw reladraw @astrojs/markdown-satteri
```

## Step 2: Configure `astro.config.mjs`

Open your `astro.config.mjs` and configure `markdown.processor` using `satteri()` with `satteriReladraw()`:

```js title="astro.config.mjs"
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { satteri } from "@astrojs/markdown-satteri";
import { satteriReladraw } from "satteri-reladraw";

export default defineConfig({
  markdown: {
    processor: satteri({
      mdastPlugins: [
        satteriReladraw({
          // Default theme for diagrams (e.g., 'dark', 'light', 'catppuccin-mocha')
          theme: "dark",
          // Container tag ('div', 'figure', or null)
          tag: "div",
          // Class name applied to the container element
          className: "reladraw",
        }),
      ],
    }),
  },
  integrations: [
    starlight({
      title: "My Documentation",
      social: [{ icon: "github", label: "GitHub", href: "https://github.com/my-org/my-project" }],
      sidebar: [
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
      ],
    }),
  ],
});
```

## Step 3: Write Diagrams in Starlight Docs

Once configured, simply write reladraw code blocks inside any Markdown (`.md`) or MDX (`.mdx`) file under `src/content/docs/`:

````markdown title="src/content/docs/guides/architecture.md"
---
title: System Architecture
---

Here is our system architecture:

```reladraw theme=nord title="Data Processing Flow" tag=figure
node broker "Kafka Queue"
node worker "Worker Service" right of broker
node db "ClickHouse" right of worker level with worker
edge broker -> worker "consumes batch"
edge worker -> db "bulk insert"
```
````

### Live Result

```reladraw theme=nord title="Data Processing Flow" tag=figure
node broker "Kafka Queue"
node worker "Worker Service" right of broker
node db "ClickHouse" right of worker level with worker
edge broker -> worker "consumes batch"
edge worker -> db "bulk insert"
```

## Customizing Starlight Theme Harmony

You can match the diagram theme to Starlight's dark mode or light mode, or override the theme per code block using the `theme` meta tag:

````markdown
<!-- Override theme for a specific diagram -->

```reladraw theme=solarized-dark
node a "Solarized"
node b "Theme" right of a
edge a -> b
```
````

```reladraw theme=solarized-dark
node a "Solarized"
node b "Theme" right of a
edge a -> b
```

## Client-Side Rendering with Web Component Mode

If you prefer client-side rendering where diagrams are rendered by reladraw's `<reladraw-diagram>` custom element in the browser, configure `mode: "element"`:

```js title="astro.config.mjs"
satteriReladraw({
  mode: "element",
});
```

And include the web component script in your head via Starlight's `head` option:

```js title="astro.config.mjs"
starlight({
  head: [
    {
      tag: "script",
      attrs: {
        type: "module",
        src: "https://cdn.jsdelivr.net/npm/reladraw/dist/element.js",
      },
    },
  ],
});
```
