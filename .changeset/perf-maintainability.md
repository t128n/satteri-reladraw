---
"satteri-reladraw": patch
---

Performance and maintainability improvements, no public API changes:

- Avoid double parse/layout work for auto-themed diagrams by sharing a single `parse`+`resolve` pass across both the dark and light `render` calls, instead of calling `compile()` twice.
- Register custom themes (`options.themes`) once per plugin instance instead of once per diagram.
- Single-source the auto-theme CSS: `AUTO_THEME_CSS` is now derived from `theme.css` at build time instead of being hand-maintained as a separate minified copy.
- Deduplicate the MDAST/HAST error-handling logic in `satteriReladraw`/`satteriReladrawHast` into one shared helper.
- Split the large `renderReladraw` orchestrator into smaller, single-purpose functions.
- Guard `registerTheme`/`registerThemes` against silently overwriting a built-in reladraw theme name under a different definition; the documented `options.themes` override behavior is unaffected.
