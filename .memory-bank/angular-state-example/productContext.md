# Product Context — angular-state-example

## Why it exists

Angular offers many ways to hold and react to state (hand-rolled signals,
`effect()`, `rxResource`, NgRx SignalStore, facade services) and to wire
`ControlValueAccessor` / dynamic forms. Docs show each in isolation; this repo
shows them against **the same use cases** so the trade-offs are visible.

## The recurring use cases

| Use case | Where it appears |
|---|---|
| Search + pagination over a list | `user` (twice), `todo`, `invoice` |
| CRUD on a collection | `todo`, `invoice` |
| Single selected entity | `user` (detail), `invoice` (detail) |
| Debounced search input → switchMap | `todo` store |
| URL-backed query state | `invoice` |
| Custom form control (CVA) kept in sync with reactive-forms status | `cva` |
| Config-driven dynamic forms with conditional logic | `dynform` |

## What "good" looks like here

- Public state is read-only (`computed()` / store signals); mutation only through
  named methods. Never expose a `WritableSignal`.
- Components depend on the layer the pattern intends (store, facade, or state
  service) — never directly on a repository.
- Each feature stays a faithful, minimal illustration of its pattern.

## Non-goals

Real persistence, network error UX beyond a simple error string, accessibility
polish, responsive design, SSR.

## Related

- [[projectbrief]] · [[systemPatterns]] · [[progress]]
