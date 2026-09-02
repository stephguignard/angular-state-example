# Project Brief — angular-state-example

## What this is

A **playground / reference repository**, not a product. Its single purpose is to
put different Angular **state-management** and **form-integration** patterns
side by side so they can be compared in one codebase, one pattern per feature
folder under `src/app/features/`.

## Core rule

Each feature deliberately demonstrates a *different* approach to the same kind of
problem (search + pagination, CRUD, single-entity state, forms). The divergence
between features is the point. When changing a feature, stay consistent with the
pattern **that feature already demonstrates** — do not "harmonise" it toward
another feature.

## Scope

- In scope: adding/extending feature folders that illustrate a pattern; keeping
  each pattern idiomatic and current with the Angular/library version in use.
- Out of scope: real backend, auth, e2e suite, deployment, design system work.
  All data layers are in-memory mocks with simulated latency (`delay(...)`).

## Success criteria

- A reader can open one feature folder and understand that pattern end to end.
- Patterns are directly comparable (same use case, different mechanics).
- Builds and unit tests pass on the pinned Angular version.

## Related

- [[productContext]] — the use cases each feature re-implements
- [[systemPatterns]] — the per-feature pattern catalogue
- [[techContext]] — stack, versions, commands
- [[activeContext]] — what's in flight now
- [[progress]] — per-feature status
