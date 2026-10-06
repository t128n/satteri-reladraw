# satteri-reladraw

## 0.1.1

### Patch Changes

- ffd35c7: Merged the duplicated MDAST/HAST error-handling code in `satteriReladraw`/`satteriReladrawHast` into one helper.
- ffd35c7: `registerTheme`/`registerThemes` throw if a name collides with an existing built-in reladraw theme they didn't register themselves. The `options.themes` override path is unaffected.
- ffd35c7: `options.themes` is registered once per plugin instance instead of once per diagram.
- ffd35c7: `AUTO_THEME_CSS` is derived from `theme.css` at build time instead of being hand-maintained as a separate minified copy.
- ffd35c7: Auto-themed diagrams now parse and resolve once and render twice (dark/light), instead of calling `compile()` twice.
- ffd35c7: Split `renderReladraw` into smaller functions.

## 0.1.0

### Minor Changes

- Initial release with Astro-integrated auto-theming, transparent canvas backgrounds, and extended theme support:
  - **Astro / Starlight Auto-Theming**:
    - Add `theme: "auto"` and `autoTheme: true | string | ThemePair` support.
    - Compile dual SVGs (dark and light variants) wrapped in `.reladraw-auto` with zero runtime JavaScript.
    - Responsive CSS automatically matches Starlight's `:root[data-theme='dark']` / `:root[data-theme='light']`, Tailwind `.dark` / `.light`, and `@media (prefers-color-scheme: dark)`.
    - Add built-in theme pairs: `auto`, `github`, `oxocarbon`, `catppuccin`, `solarized`, `gruvbox`, and `high-contrast`.
    - Add support for arbitrary pair syntax in code fences (`theme="dark:light"` or `theme="github-dark/github-light"`).
    - Export `satteri-reladraw/theme.css` and `AUTO_THEME_CSS` constant, with automatic inline injection by default (`injectStyles`).
  - **Transparent Canvas Background**:
    - Add `transparent: true` plugin option and code fence meta flag (`transparent` or `transparent=true`) to render the SVG canvas background rect with `fill="none"`.
  - **Extended Built-In Themes**:
    - Add `github-light` and `github-dark` palettes based on GitHub Primer.
    - Add `oxocarbon-dark` and `oxocarbon-light` palettes based on base16-oxocarbon / IBM Carbon.
    - Total 18 built-in themes available out of the box.
  - **In-Diagram Theming & Reladraw Registration**:
    - Register built-in and user-defined custom themes into reladraw's runtime dictionaries (`THEMES`, `THEME_NAMES`) via `registerTheme()` and `registerThemes()`.
    - Native in-diagram `diagram theme: <name>` statements now resolve seamlessly without conflicts with global defaults.
  - **Custom Palette Authoring Helpers**:
    - Export `defineTheme()`, `createAccent()`, and `mixColors()` helper utilities.
