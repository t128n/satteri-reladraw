---
"satteri-reladraw": patch
---

- Auto-themed diagrams now parse and resolve once and render twice (dark/light), instead of calling `compile()` twice.
- `options.themes` is registered once per plugin instance instead of once per diagram.
- `AUTO_THEME_CSS` is derived from `theme.css` at build time instead of being hand-maintained as a separate minified copy.
- Merged the duplicated MDAST/HAST error-handling code in `satteriReladraw`/`satteriReladrawHast` into one helper.
- Split `renderReladraw` into smaller functions.
- `registerTheme`/`registerThemes` throw if a name collides with an existing built-in reladraw theme they didn't register themselves. The `options.themes` override path is unaffected.
