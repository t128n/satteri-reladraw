---
title: Getting Started
description: How to install and get started with satteri-reladraw in your project.
---

`satteri-reladraw` integrates [reladraw](https://reladraw.dev) diagram generation into [Sätteri](https://satteri.dev) Markdown compilation.

## Installation

Install `satteri-reladraw` and `reladraw` using your package manager of choice:

```bash
# Using Bun (recommended)
bun add satteri-reladraw reladraw

# Using npm
npm install satteri-reladraw reladraw

# Using pnpm
pnpm add satteri-reladraw reladraw
```

Ensure `satteri` (>= 0.10.0) is installed in your project.

## Basic Usage

Import the plugin and add it to `mdastPlugins` when compiling Markdown with Sätteri:

````ts
import { markdownToHtml } from "satteri";
import { satteriReladraw } from "satteri-reladraw";

const markdown = `
# My Document

```reladraw
node server "Application Server"
node db "PostgreSQL" right of server level with server
edge server -> db "query data"
```
`;

const { html } = await markdownToHtml(markdown, {
  mdastPlugins: [satteriReladraw({ theme: "dark" })],
});

console.log(html);
````

## Your First Diagram

In any Markdown or MDX file processed by Sätteri, declare a code fence with language `reladraw`:

````markdown
```reladraw
node user "User"
node cdn "CloudFront CDN" right of user
node web "Web Application" right of cdn
edge user -> cdn "Request"
edge cdn -> web "Cache miss"
```
````

### Live Result

```reladraw
node user "User"
node cdn "CloudFront CDN" right of user
node web "Web Application" right of cdn
edge user -> cdn "Request"
edge cdn -> web "Cache miss"
```

## MDX Support

When compiling MDX using `mdxToJs`, `satteri-reladraw` automatically emits JSX elements compatible with React / JSX runtimes:

```ts
import { mdxToJs } from "satteri";
import { satteriReladraw } from "satteri-reladraw";

const { code } = await mdxToJs(markdown, {
  mdastPlugins: [satteriReladraw()],
});
```

Next, see the [Astro Starlight Integration](/satteri-reladraw/astro-integration/) guide to integrate diagrams into documentation sites.
