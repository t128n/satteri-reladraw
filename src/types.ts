import type { RenderOptions, ResolveOptions, Theme } from "reladraw";

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
   * Default theme name or Theme object for diagrams.
   * Can be overridden per-diagram via code fence meta (e.g. `theme="light"`).
   */
  theme?: string | Theme;

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
  mode?: ReladrawMode;
  className?: string;
  tag?: "div" | "figure" | null;
  title?: string;
  caption?: string;
  [key: string]: unknown;
}
