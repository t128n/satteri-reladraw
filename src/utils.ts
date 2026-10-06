import { compile, type Theme } from "reladraw";
import {
  BUILTIN_THEMES,
  BUILTIN_THEME_NAMES,
  defineTheme,
  type ThemeDefinition,
} from "./themes.js";
import type { DiagramMeta, SatteriReladrawOptions } from "./types.js";

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
 * Parses code fence meta attributes (e.g. `theme="light" mode=element title="My Diagram"`).
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
      }
    }
  }

  return result;
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
 * Renders reladraw code to either an SVG string or a `<reladraw-diagram>` element.
 */
export function renderReladraw(
  code: string,
  meta: DiagramMeta,
  options: SatteriReladrawOptions = {},
): string {
  const mode = meta.mode ?? options.mode ?? "svg";
  const rawTheme = meta.theme ?? options.theme;
  const tag = meta.tag !== undefined ? meta.tag : options.tag !== undefined ? options.tag : "div";

  const defaultClass = options.className !== undefined ? options.className : "reladraw";
  const classNames: string[] = [];
  if (defaultClass) {
    classNames.push(defaultClass);
  }
  if (meta.className) {
    classNames.push(meta.className);
  }
  const classAttr = classNames.length > 0 ? ` class="${escapeHtml(classNames.join(" "))}"` : "";

  let innerContent: string;

  if (mode === "element") {
    const themeName = typeof rawTheme === "string" ? rawTheme : undefined;
    const themeAttr = themeName ? ` theme="${escapeHtml(themeName)}"` : "";
    // Inside web component, escape < and & to prevent HTML parsing collisions
    const escapedCode = escapeHtml(code);
    innerContent = `<reladraw-diagram${themeAttr}>${escapedCode}</reladraw-diagram>`;
  } else {
    // Mode: svg
    const resolvedTheme = resolveTheme(rawTheme, options.themes);
    if (rawTheme && !resolvedTheme) {
      const available = [
        ...(options.themes ? Object.keys(options.themes) : []),
        ...BUILTIN_THEME_NAMES,
      ];
      throw new Error(
        `Unknown reladraw theme "${String(rawTheme)}". Available themes: ${available.join(", ")}`,
      );
    }
    const compileOptions: Record<string, unknown> = {
      ...options.resolveOptions,
      ...options.renderOptions,
    };
    if (resolvedTheme) {
      compileOptions.theme = resolvedTheme;
    }
    innerContent = compile(code, compileOptions);
  }

  if (!tag) {
    return innerContent;
  }

  const captionText = meta.caption ?? meta.title;
  const figcaption =
    tag === "figure" && captionText ? `<figcaption>${escapeHtml(captionText)}</figcaption>` : "";

  return `<${tag}${classAttr}>${innerContent}${figcaption}</${tag}>`;
}
