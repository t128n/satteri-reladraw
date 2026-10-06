import { compile, parse, render, resolve, type Theme } from "reladraw";
import {
  AUTO_THEME_CSS,
  BUILTIN_THEMES,
  BUILTIN_THEME_NAMES,
  defineTheme,
  THEME_PAIRS,
  type ThemeDefinition,
  type ThemePair,
} from "./themes.js";
import type { AutoThemeOption, DiagramMeta, SatteriReladrawOptions } from "./types.js";

/**
 * Escapes characters for safe HTML inclusion.
 */
export function escapeHtml(str: string): string {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Parses code fence meta attributes (e.g. `theme="github" auto transparent title="My Diagram"`).
 */
export function parseMeta(meta: string | null | undefined): DiagramMeta {
  if (!meta || typeof meta !== "string") {
    return {};
  }

  const result: DiagramMeta = {};
  // Regex to match key="value", key='value', key=value, or standalone keys
  const regex = /(?:(\w[\w-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\S+)))|(\S+)/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(meta)) !== null) {
    const key = match[1];
    if (key) {
      const value = match[2] ?? match[3] ?? match[4] ?? "";
      if (key === "theme") {
        result.theme = value;
      } else if (key === "mode" && (value === "svg" || value === "element")) {
        result.mode = value;
      } else if (key === "class" || key === "className") {
        result.className = value;
      } else if (key === "tag") {
        if (value === "figure" || value === "div") {
          result.tag = value;
        } else if (value === "none" || value === "null" || value === "false") {
          result.tag = null;
        }
      } else if (key === "title") {
        result.title = value;
      } else if (key === "caption") {
        result.caption = value;
      } else if (key === "auto" || key === "autoTheme") {
        result.auto = value !== "false";
        if (value && value !== "true" && value !== "false") {
          result.autoTheme = value;
        }
      } else if (key === "transparent") {
        result.transparent = value !== "false";
      } else {
        result[key] = value;
      }
    } else {
      // Standalone flag
      const flag = match[5];
      if (flag === "element" || flag === "svg") {
        result.mode = flag;
      } else if (flag === "figure" || flag === "div") {
        result.tag = flag;
      } else if (flag === "auto") {
        result.auto = true;
      } else if (flag === "transparent") {
        result.transparent = true;
      }
    }
  }

  return result;
}

/**
 * Checks whether the reladraw code contains an in-diagram `diagram theme:` statement.
 */
export function hasDiagramTheme(code: string): boolean {
  return /^\s*diagram\b[^\n]*\btheme\s*:/m.test(code);
}

/**
 * Default error renderer for diagram failures.
 */
export function renderDefaultError(error: Error, code: string, className?: string | null): string {
  const baseClass = className !== undefined ? className : "reladraw";
  const errClass = baseClass ? `${baseClass}-error` : "reladraw-error";
  const line =
    error && typeof error === "object" && "line" in error
      ? ` (line ${(error as { line: number }).line})`
      : "";

  return `<div class="${errClass}"><pre><code>Error compiling reladraw diagram${line}: ${escapeHtml(
    error.message,
  )}\n\n${escapeHtml(code)}</code></pre></div>`;
}

/**
 * Resolves a theme name, Theme object, or ThemeDefinition into a Theme object accepted by reladraw.
 */
export function resolveTheme(
  theme: string | Theme | ThemeDefinition | undefined,
  customThemes?: Record<string, Theme | ThemeDefinition>,
): Theme | undefined {
  if (!theme) return undefined;
  if (typeof theme === "string") {
    if (customThemes && theme in customThemes) {
      const custom = customThemes[theme];
      return typeof custom === "object" ? defineTheme(custom) : undefined;
    }
    if (theme in BUILTIN_THEMES) {
      return BUILTIN_THEMES[theme];
    }
    return undefined;
  }
  return defineTheme(theme);
}

/**
 * Determines whether auto-theming (dual SVG dark/light rendering) should be used for a diagram.
 */
export function isAutoTheme(
  meta: DiagramMeta,
  options: SatteriReladrawOptions = {},
  code?: string,
): boolean {
  // 1. Explicit auto flag in code fence meta
  if (meta.auto === true) return true;
  if (meta.auto === false) return false;
  if (meta.autoTheme !== undefined && meta.autoTheme !== false) return true;

  // 2. Fence meta theme specified
  if (typeof meta.theme === "string") {
    if (meta.theme === "auto") return true;
    if (meta.theme in THEME_PAIRS || meta.theme.includes(":") || meta.theme.includes("/")) {
      return true;
    }
    // Specific single theme requested on the code fence
    return false;
  }

  // 3. In-diagram `diagram theme:` statement takes precedence over global auto-theming
  if (code && hasDiagramTheme(code)) {
    return false;
  }

  // 4. Global options
  if (options.autoTheme !== undefined && options.autoTheme !== false) {
    return true;
  }
  if (options.theme === "auto") {
    return true;
  }
  if (typeof options.theme === "string" && options.theme in THEME_PAIRS) {
    return true;
  }
  if (
    typeof options.theme === "object" &&
    options.theme !== null &&
    "dark" in options.theme &&
    "light" in options.theme
  ) {
    return true;
  }

  return false;
}

/**
 * Resolves the `{ dark, light }` Theme pair for an auto-themed diagram.
 */
export function resolveThemePair(
  meta: DiagramMeta,
  options: SatteriReladrawOptions = {},
): { dark: Theme; light: Theme } {
  let pairSource: AutoThemeOption | ThemePair | undefined;

  if (meta.autoTheme && meta.autoTheme !== true) {
    pairSource = meta.autoTheme;
  } else if (meta.theme && meta.theme !== "auto") {
    pairSource = meta.theme;
  } else if (options.autoTheme && options.autoTheme !== true) {
    pairSource = options.autoTheme;
  } else if (options.theme && options.theme !== "auto") {
    if (typeof options.theme === "string") {
      pairSource = options.theme;
    } else if (
      typeof options.theme === "object" &&
      "dark" in options.theme &&
      "light" in options.theme
    ) {
      pairSource = options.theme;
    }
  }

  let darkTarget: string | Theme | ThemeDefinition = "dark";
  let lightTarget: string | Theme | ThemeDefinition = "light";

  if (typeof pairSource === "string") {
    if (pairSource in THEME_PAIRS) {
      const preset = THEME_PAIRS[pairSource];
      if (preset) {
        darkTarget = preset.dark;
        lightTarget = preset.light;
      }
    } else if (pairSource.includes(":") || pairSource.includes("/")) {
      const [d, l] = pairSource.split(/[:/]/);
      if (d && d.trim()) darkTarget = d.trim();
      if (l && l.trim()) lightTarget = l.trim();
    }
  } else if (
    typeof pairSource === "object" &&
    pairSource !== null &&
    "dark" in pairSource &&
    "light" in pairSource
  ) {
    darkTarget = pairSource.dark;
    lightTarget = pairSource.light;
  }

  const darkTheme = resolveTheme(darkTarget, options.themes) ?? BUILTIN_THEMES["dark"]!;
  const lightTheme = resolveTheme(lightTarget, options.themes) ?? BUILTIN_THEMES["light"]!;

  return { dark: darkTheme, light: lightTheme };
}

/**
 * Creates a theme clone with a transparent background.
 */
export function makeThemeTransparent(theme: Theme): Theme {
  return {
    ...theme,
    background: "none",
  };
}

/**
 * Modifies an SVG string so its canvas background rect is transparent (`fill="none"`).
 */
export function applyTransparency(svg: string): string {
  return svg.replace(/<rect\s+x="0"\s+y="0"[^>]*fill="[^"]*"/, (match) => {
    return match.replace(/fill="[^"]*"/, 'fill="none"');
  });
}

/**
 * Renders a `<reladraw-diagram>` custom element for client-side rendering (`mode: "element"`).
 */
function renderElementMode(
  code: string,
  meta: DiagramMeta,
  options: SatteriReladrawOptions,
): string {
  const rawTheme = meta.theme ?? (typeof options.theme === "string" ? options.theme : undefined);
  const themeAttr = rawTheme ? ` theme="${escapeHtml(rawTheme)}"` : "";
  return `<reladraw-diagram${themeAttr}>${escapeHtml(code)}</reladraw-diagram>`;
}

/**
 * Renders a diagram as a dual dark/light SVG pair, parsing and laying out the
 * diagram once and reusing that layout for both themed renders.
 */
function renderAutoThemeSvg(
  code: string,
  meta: DiagramMeta,
  options: SatteriReladrawOptions,
  isTransparent: boolean,
): string {
  const { dark, light } = resolveThemePair(meta, options);
  const darkTheme = isTransparent ? makeThemeTransparent(dark) : dark;
  const lightTheme = isTransparent ? makeThemeTransparent(light) : light;

  const doc = parse(code);
  const layout = resolve(doc, options.resolveOptions);

  let darkSvg = render(layout, { ...options.renderOptions, theme: darkTheme });
  let lightSvg = render(layout, { ...options.renderOptions, theme: lightTheme });

  if (isTransparent) {
    darkSvg = applyTransparency(darkSvg);
    lightSvg = applyTransparency(lightSvg);
  }

  return `<div class="reladraw-dark">${darkSvg}</div><div class="reladraw-light">${lightSvg}</div>`;
}

/**
 * Renders a diagram as a single themed SVG (the non-auto-theme `mode: "svg"` path).
 */
function renderSingleThemeSvg(
  code: string,
  meta: DiagramMeta,
  options: SatteriReladrawOptions,
  isTransparent: boolean,
): string {
  const inDiagramTheme = hasDiagramTheme(code);
  const rawTheme = meta.theme ?? options.theme;
  const compileOptions: Record<string, unknown> = {
    ...options.resolveOptions,
    ...options.renderOptions,
  };

  // Only pass theme if explicitly specified on fence, or if not specified in diagram
  if (meta.theme || !inDiagramTheme) {
    if (rawTheme && rawTheme !== "auto") {
      let resolved = resolveTheme(
        typeof rawTheme === "object" && "dark" in rawTheme
          ? rawTheme.dark
          : (rawTheme as string | Theme | ThemeDefinition),
        options.themes,
      );
      if (!resolved) {
        const available = [
          ...(options.themes ? Object.keys(options.themes) : []),
          ...BUILTIN_THEME_NAMES,
        ];
        throw new Error(
          `Unknown reladraw theme "${String(rawTheme)}". Available themes: ${available.join(", ")}`,
        );
      }
      if (isTransparent) {
        resolved = makeThemeTransparent(resolved);
      }
      compileOptions.theme = resolved;
    } else if (isTransparent) {
      compileOptions.theme = makeThemeTransparent(BUILTIN_THEMES["dark"]!);
    }
  }

  let svg = compile(code, compileOptions);
  if (isTransparent) {
    svg = applyTransparency(svg);
  }
  return svg;
}

/**
 * Wraps rendered diagram content in the configured tag/class/caption, injecting
 * the auto-theme CSS once per document when needed.
 */
function wrapHtml(
  innerContent: string,
  meta: DiagramMeta,
  options: SatteriReladrawOptions,
  classNames: string[],
  tag: "div" | "figure" | null,
  auto: boolean,
): string {
  let resultHtml = "";
  if (options.injectStyles && auto) {
    resultHtml += `<style data-reladraw-styles>${AUTO_THEME_CSS}</style>`;
  }

  if (!tag) {
    const wrapped = auto ? `<div class="reladraw-auto">${innerContent}</div>` : innerContent;
    return resultHtml + wrapped;
  }

  const classAttr = classNames.length > 0 ? ` class="${escapeHtml(classNames.join(" "))}"` : "";
  const captionText = meta.caption ?? meta.title;
  const figcaption =
    tag === "figure" && captionText ? `<figcaption>${escapeHtml(captionText)}</figcaption>` : "";

  resultHtml += `<${tag}${classAttr}>${innerContent}${figcaption}</${tag}>`;
  return resultHtml;
}

/**
 * Renders reladraw code to either an SVG string, dual auto-themed SVGs, or a `<reladraw-diagram>` element.
 */
export function renderReladraw(
  code: string,
  meta: DiagramMeta,
  options: SatteriReladrawOptions = {},
): string {
  const mode = meta.mode ?? options.mode ?? "svg";
  const tag = meta.tag !== undefined ? meta.tag : options.tag !== undefined ? options.tag : "div";
  const isTransparent = Boolean(meta.transparent ?? options.transparent);

  const defaultClass = options.className !== undefined ? options.className : "reladraw";
  const classNames: string[] = [];
  if (defaultClass) {
    classNames.push(defaultClass);
  }
  if (meta.className) {
    classNames.push(meta.className);
  }

  if (mode === "element") {
    return wrapHtml(renderElementMode(code, meta, options), meta, options, classNames, tag, false);
  }

  const auto = isAutoTheme(meta, options, code);
  if (auto) {
    classNames.push("reladraw-auto");
  }

  const innerContent = auto
    ? renderAutoThemeSvg(code, meta, options, isTransparent)
    : renderSingleThemeSvg(code, meta, options, isTransparent);

  return wrapHtml(innerContent, meta, options, classNames, tag, auto);
}
