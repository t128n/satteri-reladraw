---
title: Web Component Mode
description: Using client-side reladraw web components with satteri-reladraw.
---

By default, `satteri-reladraw` pre-renders diagrams directly to SVG at build time (`mode: "svg"`). This provides the fastest page loads with zero runtime JavaScript required on the client.

However, you can also emit `<reladraw-diagram>` custom elements using `mode: "element"`.

## When to Use Web Component Mode

- **Client-Side Theme Switching**: When you want diagrams to dynamically react to browser color scheme changes.
- **Client-Side Interactivity**: When diagrams are dynamically updated or manipulated via the DOM.
- **Micro-Frontends**: When diagram source code should be distributed as raw text in HTML payloads.

---

## Configuring Web Component Mode

### Per-Diagram via Code Fence Meta

Add `mode=element` to a code block:

````markdown
```reladraw mode=element theme=dark
node a "Client Web Component"
node b "Rendered in Browser" right of a
edge a -> b
```
````

Output HTML:

```html
<div class="reladraw">
  <reladraw-diagram theme="dark"
    >node a "Client Web Component" node b "Rendered in Browser" right of a edge a ->
    b</reladraw-diagram
  >
</div>
```

### Global Setting

Set `mode: "element"` in your plugin options:

```js title="astro.config.mjs"
import { satteriReladraw } from "satteri-reladraw";

export default defineConfig({
  markdown: {
    processor: satteri({
      mdastPlugins: [
        satteriReladraw({
          mode: "element",
        }),
      ],
    }),
  },
});
```

---

## Loading the Custom Element Script

To enable the browser to register and render `<reladraw-diagram>` elements, load the reladraw element script:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/reladraw/dist/element.js"></script>
```

In Astro Starlight, you can inject this script globally in `astro.config.mjs`:

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
