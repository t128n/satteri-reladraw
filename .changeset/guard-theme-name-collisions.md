---
"satteri-reladraw": patch
---

`registerTheme`/`registerThemes` throw if a name collides with an existing built-in reladraw theme they didn't register themselves. The `options.themes` override path is unaffected.
