---
title: satteri-reladraw
description: A Sätteri plugin for rendering reladraw diagrams in Markdown and MDX.
template: splash
hero:
  tagline: Declarative relative-placement diagrams in your Sätteri Markdown and Starlight docs.
  actions:
    - text: Getting Started
      link: /getting-started/
      icon: right-arrow
      variant: primary
    - text: View Showcase
      link: /showcase/
      icon: rocket
      variant: secondary
    - text: GitHub Repository
      link: https://github.com/t128n/satteri-reladraw
      icon: external
      variant: minimal
---

import { Card, CardGrid } from '@astrojs/starlight/components';

<CardGrid stagger>
  <Card title="Compile-Time SVG" icon="rocket">
    Diagrams are transformed into standalone SVG graphics directly at compile time with zero browser dependencies.
  </Card>
  <Card title="Native Sätteri Plugin" icon="puzzle">
    Built for Sätteri's ultra-fast Rust-backed pipeline, supporting both MDAST and HAST plugin architectures.
  </Card>
  <Card title="14 Built-In Themes" icon="pencil">
    Out of the box support for Catppuccin, Dracula, Nord, Vesper, Gruvbox, Solarized, and more.
  </Card>
  <Card title="Clean Relative Syntax" icon="document">
    Write diagrams where things go relative to each other — no manual coordinate math, no unpredictable auto-layout.
  </Card>
</CardGrid>

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
