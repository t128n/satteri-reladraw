---
title: Themes & Styling
description: Explore the 14 built-in themes and color palettes supported by satteri-reladraw.
---

`satteri-reladraw` supports all 14 official themes provided by `reladraw`. Themes determine backgrounds, node fills, borders, text colors, and edge strokes.

You can set a default theme in your plugin configuration, or specify a theme per diagram using the `theme="<name>"` code fence meta attribute.

---

## Catppuccin Mocha

```reladraw theme=catppuccin-mocha title="Catppuccin Mocha Theme" tag=figure
node a "Source"
node b "Transform" right of a
node c "Sink" right of b level with b
edge a -> b "step 1"
edge b -> c "step 2"
```

````markdown
```reladraw theme=catppuccin-mocha
node a "Source"
node b "Transform" right of a
node c "Sink" right of b level with b
edge a -> b "step 1"
edge b -> c "step 2"
```
````

---

## Catppuccin Latte (Light)

```reladraw theme=catppuccin-latte title="Catppuccin Latte (Light) Theme" tag=figure
node a "Source"
node b "Transform" right of a
node c "Sink" right of b level with b
edge a -> b "step 1"
edge b -> c "step 2"
```

````markdown
```reladraw theme=catppuccin-latte
node a "Source"
node b "Transform" right of a
node c "Sink" right of b level with b
edge a -> b "step 1"
edge b -> c "step 2"
```
````

---

## Nord

```reladraw theme=nord title="Nord Theme" tag=figure
node api "API Gateway"
node srv "Microservice" right of api
edge api -> srv "route request"
```

````markdown
```reladraw theme=nord
node api "API Gateway"
node srv "Microservice" right of api
edge api -> srv "route request"
```
````

---

## Dracula

```reladraw theme=dracula title="Dracula Theme" tag=figure
node api "API Gateway"
node srv "Microservice" right of api
edge api -> srv "route request"
```

````markdown
```reladraw theme=dracula
node api "API Gateway"
node srv "Microservice" right of api
edge api -> srv "route request"
```
````

---

## Vesper

```reladraw theme=vesper title="Vesper Theme" tag=figure
node queue "Job Queue"
node worker "Worker Pool" right of queue
edge queue -> worker "dispatch task"
```

````markdown
```reladraw theme=vesper
node queue "Job Queue"
node worker "Worker Pool" right of queue
edge queue -> worker "dispatch task"
```
````

---

## Solarized Dark & Solarized Light

```reladraw theme=solarized-dark title="Solarized Dark Theme" tag=figure
node a "Solarized Dark"
node b "Target" right of a
edge a -> b "sync"
```

```reladraw theme=solarized-light title="Solarized Light Theme" tag=figure
node a "Solarized Light"
node b "Target" right of a
edge a -> b "sync"
```

---

## Gruvbox Dark

```reladraw theme=gruvbox-dark title="Gruvbox Dark Theme" tag=figure
node a "Gruvbox"
node b "Palette" right of a
edge a -> b "cozy colors"
```

---

## List of All Available Theme Names

| Theme Name            | Type  | Notes                        |
| :-------------------- | :---- | :--------------------------- |
| `dark`                | Dark  | Default fallback theme       |
| `light`               | Light | Clean white background       |
| `catppuccin-mocha`    | Dark  | Soothing pastel dark         |
| `catppuccin-latte`    | Light | Soothing pastel light        |
| `nord`                | Dark  | Arctic, north-bluish palette |
| `dracula`             | Dark  | Classic dark vampire palette |
| `vesper`              | Dark  | Deep black & amber accents   |
| `solarized-dark`      | Dark  | Teal-slate precision palette |
| `solarized-light`     | Light | Cream precision palette      |
| `gruvbox-dark`        | Dark  | Retro groove warm dark       |
| `gruvbox-light`       | Light | Retro groove warm light      |
| `high-contrast-dark`  | Dark  | Maximum readability dark     |
| `high-contrast-light` | Light | Maximum readability light    |
| `print`               | Light | Monochrome print-friendly    |
