---
"satteri-reladraw": minor
---

Add configurable theming system and built-in themes:

- Add `github-light` and `github-dark` built-in themes based on GitHub Primer.
- Add `oxocarbon-dark` and `oxocarbon-light` built-in themes based on base16-oxocarbon / IBM Carbon.
- Add `themes` option to `satteriReladraw()` and `satteriReladrawHast()` for registering and overriding custom themes.
- Add `defineTheme()`, `createAccent()`, and `mixColors()` helper utilities.
- Export `BUILTIN_THEMES`, `BUILTIN_THEME_NAMES`, and `DEFAULT_ADDITIONAL_THEMES`.
- Improve error reporting when an unknown theme is specified.
