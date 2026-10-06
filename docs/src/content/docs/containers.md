---
title: Containers & Figures
description: How to customize HTML wrapper elements, captions, and styling in satteri-reladraw.
---

`satteri-reladraw` provides flexible options for wrapping your SVG diagrams in semantic HTML elements and adding captions.

## Wrapping in `<figure>` with `<figcaption>`

When creating documentation, wrapping diagrams in `<figure>` elements with a `<figcaption>` improves readability and accessibility.

Set `tag=figure` and provide a `title="Caption text"` or `caption="Caption text"`:

```reladraw tag=figure title="Figure 1: Authentication & Authorization Flow" theme=dracula
node client "Mobile App"
node idp "Identity Provider" right of client
node api "Resource API" right of idp level with idp

edge client -> idp "login (OAuth2)"
edge idp -> client "JWT tokens"
edge client -> api "Bearer Token"
```

````markdown
```reladraw tag=figure title="Figure 1: Authentication & Authorization Flow" theme=dracula
node client "Mobile App"
node idp "Identity Provider" right of client
node api "Resource API" right of idp level with idp

edge client -> idp "login (OAuth2)"
edge idp -> client "JWT tokens"
edge client -> api "Bearer Token"
```
````

Generated HTML output:

```html
<figure class="reladraw">
  <svg ...></svg>
  <figcaption>Figure 1: Authentication & Authorization Flow</figcaption>
</figure>
```

---

## Default `<div>` Container

By default, diagrams are wrapped in a `<div class="reladraw">` container:

```reladraw
node a "Start"
node b "Finish" right of a
edge a -> b
```

Generated HTML output:

```html
<div class="reladraw">
  <svg ...></svg>
</div>
```

---

## Raw SVG Without Wrapper (`tag=none` or `tag=null`)

If you want the standalone `<svg>` element emitted directly into the document without any surrounding wrapper tags:

````markdown
```reladraw tag=none
node a "Raw SVG"
node b "No Wrapper" right of a
edge a -> b
```
````

Or configure it globally in `astro.config.mjs`:

```js
satteriReladraw({
  tag: null,
});
```

---

## Custom CSS Classes

You can append custom classes to style the diagram container via `class="my-custom-class"`:

````markdown
```reladraw class="bordered-diagram center-diagram"
node a "Box A"
node b "Box B" right of a
edge a -> b
```
````

Generated HTML output:

```html
<div class="reladraw bordered-diagram center-diagram">
  <svg ...></svg>
</div>
```
