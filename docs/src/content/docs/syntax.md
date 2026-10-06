---
title: reladraw Syntax Cheat Sheet
description: Quick reference guide for the reladraw diagram language.
---

`reladraw` is a declarative text language where you place nodes relative to other nodes. This guide summarizes common syntax patterns.

---

## 1. Declaring Nodes

A node has an identifier and a display label:

```reladraw
node a "Standalone Node"
```

````markdown
```reladraw
node a "Standalone Node"
```
````

---

## 2. Relative Placement

Nodes are placed relative to existing nodes:

- `right of <node>`
- `left of <node>`
- `below <node>`
- `above <node>`
- `level with <node>` (aligns on the same horizontal baseline)

```reladraw theme=nord
node a "Node A"
node b "Right of A" right of a
node c "Below A" below a
node d "Right of C & Level with C" right of c level with c
```

````markdown
```reladraw
node a "Node A"
node b "Right of A" right of a
node c "Below A" below a
node d "Right of C & Level with C" right of c level with c
```
````

---

## 3. Connecting with Edges

Connect nodes using `->` (unidirectional) or `<->` (bidirectional), with optional labels:

```reladraw theme=vesper
node client "Client"
node api "API" right of client
node db "Database" right of api level with api

edge client -> api "HTTP Request"
edge api <-> db "Connection Pool"
```

````markdown
```reladraw
node client "Client"
node api "API" right of client
node db "Database" right of api level with api

edge client -> api "HTTP Request"
edge api <-> db "Connection Pool"
```
````

---

## 4. Edge Attachment Sides

Specify which side of the node the edge attaches to using `from:` and `to:`:

- `top`, `bottom`, `left`, `right`

```reladraw theme=catppuccin-mocha
node source "Source"
node target "Target" below source right of source

edge source -> target "diagonal flow" from: right to: top
```

````markdown
```reladraw
node source "Source"
node target "Target" below source right of source

edge source -> target "diagonal flow" from: right to: top
```
````

---

## 5. Multi-line Node Text

Use `/` (slash with surrounding spaces) to break lines inside text strings:

```reladraw theme=dracula
node server "Application Server / Node.js 22 / Port 3000"
node db "PostgreSQL Cluster / Primary (Write)" right of server level with server
edge server -> db "Connection"
```

````markdown
```reladraw
node server "Application Server / Node.js 22 / Port 3000"
node db "PostgreSQL Cluster / Primary (Write)" right of server level with server
edge server -> db "Connection"
```
````

---

## 6. Containers and Child Nodes

Dots in node names declare container relationships:

```reladraw theme=solarized-dark
node cluster "Kubernetes Cluster"
node cluster.pod1 "Pod 1"
node cluster.pod2 "Pod 2" right of cluster.pod1
```

````markdown
```reladraw
node cluster "Kubernetes Cluster"
node cluster.pod1 "Pod 1"
node cluster.pod2 "Pod 2" right of cluster.pod1
```
````
