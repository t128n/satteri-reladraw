---
title: satteri-reladraw
description: A Sätteri plugin for rendering reladraw diagrams in Markdown and MDX.
template: splash
hero:
  tagline: Declarative relative-placement diagrams in your Sätteri Markdown and Starlight docs.
  actions:
    - text: Getting Started
      link: /satteri-reladraw/getting-started/
      icon: right-arrow
      variant: primary
    - text: View Showcase
      link: /satteri-reladraw/showcase/
      icon: rocket
      variant: secondary
    - text: GitHub Repository
      link: https://github.com/t128n/satteri-reladraw
      icon: external
      variant: minimal
---

## Highlights

- 🚀 **Compile-Time SVG**: Diagrams are transformed into standalone SVG graphics directly at compile time with zero browser dependencies.
- 🧩 **Native Sätteri Plugin**: Built for Sätteri's ultra-fast Rust-backed pipeline, supporting both MDAST and HAST plugin architectures.
- 🎨 **18 Built-In Themes**: Out of the box support for GitHub, Oxocarbon, Catppuccin, Dracula, Nord, Vesper, Gruvbox, Solarized, and more.
- 📐 **Clean Relative Syntax**: Write diagrams where things go relative to each other — no manual coordinate math, no unpredictable auto-layout.

## Live Example

Below is a reladraw diagram rendered directly by `satteri-reladraw`:

```reladraw theme=catppuccin-mocha title="Architecture Overview" tag=figure
node client "Client App"
node gateway "API Gateway" right of client
node auth "Auth Service" below gateway
node db "PostgreSQL" right of gateway level with gateway

edge client -> gateway "HTTPS"
edge gateway -> auth "verify"
edge gateway -> db "SQL"
```
