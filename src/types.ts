import type { RenderOptions, ResolveOptions, Theme } from "reladraw";
import type { ThemeDefinition, ThemePair } from "./themes.js";

/**
 * Output rendering mode for reladraw diagrams.
 * - 'svg': Pre-renders diagram to static SVG at compile-time (default).
 * - 'element': Outputs client-side `<reladraw-diagram>` web component.
 */
export type ReladrawMode = "svg" | "element";

/**
 * Error handling strategy when diagram compilation fails.
 * - 'report': Reports diagnostic via `ctx.report` and renders an error placeholder (default).
 * - 'fallback': Keeps original code block and reports a warning diagnostic.
 * - 'throw': Rethrows the error, causing compilation to abort.
 */
export type ReladrawOnError = "report" | "fallback" | "throw";

/**
 * Option type for auto-theming configuration.
 * - `boolean`: `true` to enable auto-theming with default pair ('dark' and 'light').
 * - `string`: A theme pair preset name (e.g. 'github', 'oxocarbon', 'catppuccin') or 'dark:light' pair.
 * - `ThemePair`: An explicit `{ dark, light }` theme specification.
 */
export type AutoThemeOption = boolean | string | ThemePair;

/**
 * Configuration options for the satteri-reladraw plugin.
 */
export interface SatteriReladrawOptions {
  /**
   * Code fence language tags to match.
   * Case-insensitive.
   * @default ['reladraw']
   */
  languages?: string[];

  /**
   * Rendering mode.
   * @default 'svg'
   */
  mode?: ReladrawMode;

  /**
   * Default theme name, Theme object, ThemeDefinition, 'auto', or ThemePair for diagrams.
   * Can be overridden per-diagram via code fence meta (e.g. `theme="github-dark"` or `theme="github"`).
   */
  theme?: string | Theme | ThemeDefinition | "auto" | ThemePair;

  /**
   * Auto-theming configuration. When enabled, dual SVGs (dark and light) are rendered,
   * switching automatically based on `:root[data-theme='dark']` (Starlight),
   * `.dark` (Tailwind), or `@media (prefers-color-scheme: dark)`.
   *
   * - `true`: Enables auto-theming using the default pair ('dark' and 'light') or the pair in `theme`.
   * - `false`: Disables auto-theming.
   * - Preset name: 'github', 'oxocarbon', 'catppuccin', 'solarized', 'gruvbox', 'high-contrast'.
   * - Explicit pair: `{ dark: 'github-dark', light: 'github-light' }`.
   */
  autoTheme?: AutoThemeOption;

  /**
   * Whether to inject responsive auto-theming CSS into rendered output.
   * If `false`, you can import `satteri-reladraw/theme.css` in your project or Starlight config.
   * @default true
   */
  injectStyles?: boolean;

  /**
   * If `true`, sets the SVG canvas background to transparent (`none`) instead of
   * the theme's background fill color.
   * Can also be enabled per diagram via code fence meta (`transparent` or `transparent=true`).
   * @default false
   */
  transparent?: boolean;

  /**
   * Custom themes dictionary mapping theme names to Theme objects or ThemeDefinitions.
   * Custom themes can be referenced by name in code fence meta (`theme="my-theme"`)
   * or set as the default `theme` option.
   *
   * Can also be used to override built-in themes.
   */
  themes?: Record<string, Theme | ThemeDefinition>;

  /**
   * CSS class name for wrapper element.
   * Set to `null` or empty string to omit the class.
   * @default 'reladraw'
   */
  className?: string | null;

  /**
   * Wrapper HTML tag around the diagram.
   * If `null`, only the SVG or `<reladraw-diagram>` is emitted.
   * If `'figure'`, a `<figcaption>` is included if `title` or `caption` is set.
   * @default 'div'
   */
  tag?: "div" | "figure" | null;

  /**
   * Error handling behavior when diagram fails to compile.
   * @default 'report'
   */
  onError?: ReladrawOnError;

  /**
   * Custom error renderer function for when `onError` is 'report'.
   */
  renderError?: (error: Error, code: string) => string;

  /**
   * Options passed to reladraw's resolver pass.
   */
  resolveOptions?: ResolveOptions;

  /**
   * Options passed to reladraw's renderer pass.
   */
  renderOptions?: RenderOptions;
}

/**
 * Parsed metadata from code fence meta string.
 */
export interface DiagramMeta {
  theme?: string;
  autoTheme?: boolean | string;
  auto?: boolean;
  transparent?: boolean;
  mode?: ReladrawMode;
  className?: string;
  tag?: "div" | "figure" | null;
  title?: string;
  caption?: string;
  [key: string]: unknown;
}
