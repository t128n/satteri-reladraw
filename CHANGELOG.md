# satteri-reladraw

## 0.2.0

### Minor Changes

- e8d6e5c: Add Astro-integrated auto-theming, transparent canvas backgrounds, and extended theme support:

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
