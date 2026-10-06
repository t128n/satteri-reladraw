---
title: Diagram Showcase
description: Live showcase of reladraw diagrams compiled with satteri-reladraw.
---

Explore real-world diagram patterns rendered directly using `satteri-reladraw`. All diagrams on this page are compiled into standalone SVGs at build-time.

---

## 1. Microservices Architecture

A microservices system with API gateway, authentication, business services, and caches:

```reladraw theme=dracula title="Microservices Ecosystem" tag=figure
node client "Client App"
node gateway "API Gateway" right of client
node auth "Auth Service" below gateway
node orders "Orders Service" right of gateway level with gateway
node inventory "Inventory Service" below orders
node redis "Redis Cache" right of orders level with orders

edge client -> gateway "HTTPS / GraphQL"
edge gateway -> auth "verify token"
edge gateway -> orders "place order"
edge orders -> inventory "check stock"
edge orders -> redis "cache lookup"
```

````markdown
```reladraw theme=dracula title="Microservices Ecosystem" tag=figure
node client "Client App"
node gateway "API Gateway" right of client
node auth "Auth Service" below gateway
node orders "Orders Service" right of gateway level with gateway
node inventory "Inventory Service" below orders
node redis "Redis Cache" right of orders level with orders

edge client -> gateway "HTTPS / GraphQL"
edge gateway -> auth "verify token"
edge gateway -> orders "place order"
edge orders -> inventory "check stock"
edge orders -> redis "cache lookup"
```
````

---

## 2. Event-Driven Message Pipeline

Streaming telemetry from IoT devices through a broker and workers to analytics storage:

```reladraw theme=catppuccin-mocha title="Event Streaming Pipeline" tag=figure
node sensors "IoT Sensors"
node ingest "Ingest Gateway" right of sensors
node kafka "Kafka Broker" right of ingest level with ingest
node stream "Flink Stream" right of kafka level with kafka
node sink "Data Lake" right of stream level with stream

edge sensors -> ingest "MQTT"
edge ingest -> kafka "telemetry topic"
edge kafka -> stream "event stream"
edge stream -> sink "Parquet batches"
```

````markdown
```reladraw theme=catppuccin-mocha title="Event Streaming Pipeline" tag=figure
node sensors "IoT Sensors"
node ingest "Ingest Gateway" right of sensors
node kafka "Kafka Broker" right of ingest level with ingest
node stream "Flink Stream" right of kafka level with kafka
node sink "Data Lake" right of stream level with stream

edge sensors -> ingest "MQTT"
edge ingest -> kafka "telemetry topic"
edge kafka -> stream "event stream"
edge stream -> sink "Parquet batches"
```
````

---

## 3. Database Replication Cluster

Primary PostgreSQL node replicating data to secondary read-replicas with health checks:

```reladraw theme=nord title="High-Availability Database Cluster" tag=figure
node app "Application Cluster"
node primary "Primary DB (Write)" right of app
node rep1 "Replica 1 (Read)" below primary
node rep2 "Replica 2 (Read)" right of rep1 level with rep1

edge app -> primary "writes"
edge app -> rep1 "queries"
edge primary -> rep1 "WAL streaming"
edge primary -> rep2 "WAL streaming"
```

````markdown
```reladraw theme=nord title="High-Availability Database Cluster" tag=figure
node app "Application Cluster"
node primary "Primary DB (Write)" right of app
node rep1 "Replica 1 (Read)" below primary
node rep2 "Replica 2 (Read)" right of rep1 level with rep1

edge app -> primary "writes"
edge app -> rep1 "queries"
edge primary -> rep1 "WAL streaming"
edge primary -> rep2 "WAL streaming"
```
````

---

## 4. CI/CD Pipeline

Deployment workflow from Git push to staging and production:

```reladraw theme=vesper title="Continuous Delivery Workflow" tag=figure
node git "Git Push"
node ci "CI (Lint & Test)" right of git
node build "Docker Build" right of ci level with ci
node staging "Staging Deploy" right of build level with build
node prod "Production" below staging

edge git -> ci "trigger"
edge ci -> build "pass"
edge build -> staging "auto deploy"
edge staging -> prod "manual approval"
```

````markdown
```reladraw theme=vesper title="Continuous Delivery Workflow" tag=figure
node git "Git Push"
node ci "CI (Lint & Test)" right of git
node build "Docker Build" right of ci level with ci
node staging "Staging Deploy" right of build level with build
node prod "Production" below staging

edge git -> ci "trigger"
edge ci -> build "pass"
edge build -> staging "auto deploy"
edge staging -> prod "manual approval"
```
````
