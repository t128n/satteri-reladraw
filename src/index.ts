import {
  defineHastPlugin,
  defineMdastPlugin,
  type HastNode,
  type HastPluginDefinition,
  type MdastPluginDefinition,
} from "satteri";
import { registerThemeOverrides } from "./themes.js";
import type { DiagramMeta, ReladrawOnError, SatteriReladrawOptions } from "./types.js";
import { parseMeta, renderDefaultError, renderReladraw } from "./utils.js";

export type {
  AutoThemeOption,
  DiagramMeta,
  ReladrawMode,
  ReladrawOnError,
  SatteriReladrawOptions,
} from "./types.js";
export {
  applyTransparency,
  escapeHtml,
  hasDiagramTheme,
  isAutoTheme,
  makeThemeTransparent,
  parseMeta,
  renderDefaultError,
  renderReladraw,
  resolveTheme,
  resolveThemePair,
} from "./utils.js";
export {
  AUTO_THEME_CSS,
  BUILTIN_THEMES,
  BUILTIN_THEME_NAMES,
  DEFAULT_ADDITIONAL_THEMES,
  THEME_PAIRS,
  createAccent,
  defineTheme,
  githubDark,
  githubLight,
  mixColors,
  oxocarbonDark,
  oxocarbonLight,
  registerTheme,
  registerThemes,
  type Accent,
  type ThemeDefinition,
  type ThemePair,
} from "./themes.js";
export {
  DARK_THEME,
  DEFAULT_THEME,
  THEME_NAMES,
  THEMES,
  type RenderOptions,
  type ResolveOptions,
  type Theme,
} from "reladraw";

/**
 * Diagnostic record emitted by satteri-reladraw.
 */
export interface ReladrawDiagnostic {
  message: string;
  severity: "error" | "warning";
  line?: number;
}

declare module "satteri" {
  interface DataMap {
    reladrawDiagnostics?: ReladrawDiagnostic[];
    reladrawStylesInjected?: boolean;
  }
}

type RenderErrorOutcome =
  | { action: "throw"; error: Error }
  | { action: "skip" }
  | { action: "html"; html: string };

/**
 * Shared error-handling logic for both the MDAST and HAST plugins: normalizes
 * the thrown error, reports/records a diagnostic, and decides what the caller
 * should do next based on `onError`. Reporting and diagnostics are taken as
 * callbacks since `ctx.report`'s `node` parameter type differs between the
 * MDAST and HAST contexts.
 */
function handleRenderError(
  err: unknown,
  code: string,
  options: SatteriReladrawOptions,
  onError: ReladrawOnError,
  report: (message: string, severity: "error" | "warning") => void,
  pushDiagnostic: (diagnostic: ReladrawDiagnostic) => void,
): RenderErrorOutcome {
  const error = err instanceof Error ? err : new Error(String(err));
  const line =
    error && typeof error === "object" && "line" in error
      ? (error as { line: number }).line
      : undefined;
  const lineSuffix = line != null ? ` (line ${line})` : "";
  const message = `Failed to compile reladraw diagram${lineSuffix}: ${error.message}`;
  const severity = onError === "fallback" ? "warning" : "error";

  report(message, severity);
  pushDiagnostic({ message, severity, line });

  if (onError === "throw") {
    return { action: "throw", error };
  }

  if (onError === "fallback") {
    return { action: "skip" };
  }

  // Default: 'report'
  const html = options.renderError
    ? options.renderError(error, code)
    : renderDefaultError(error, code, options.className);
  return { action: "html", html };
}

/**
 * Sätteri MDAST plugin for reladraw diagrams.
 *
 * Intercepts code blocks matching `languages` (defaulting to `reladraw`)
 * and transforms them into inline SVG, auto-themed dual SVGs, or `<reladraw-diagram>` elements.
 *
 * @example
 * ```ts
 * import { markdownToHtml } from "satteri";
 * import { satteriReladraw } from "satteri-reladraw";
 *
 * const { html } = await markdownToHtml(source, {
 *   mdastPlugins: [satteriReladraw({ theme: "auto" })],
 * });
 * ```
 */
export function satteriReladraw(options: SatteriReladrawOptions = {}): MdastPluginDefinition {
  const languages = (options.languages ?? ["reladraw"]).map((l) => l.toLowerCase());
  const onError = options.onError ?? "report";

  if (options.themes) {
    registerThemeOverrides(options.themes);
  }

  return defineMdastPlugin({
    name: "satteri-reladraw",
    code(node, ctx) {
      const lang = node.lang?.trim().toLowerCase();
      if (!lang || !languages.includes(lang)) {
        return;
      }

      const meta: DiagramMeta = parseMeta(node.meta);
      const shouldInjectStyles = options.injectStyles !== false && !ctx.data.reladrawStylesInjected;

      try {
        const output = renderReladraw(node.value, meta, {
          ...options,
          injectStyles: shouldInjectStyles,
        });

        if (output.includes("<style data-reladraw-styles>")) {
          ctx.data.reladrawStylesInjected = true;
        }

        return { raw: output, mdxExpressions: false };
      } catch (err) {
        const outcome = handleRenderError(
          err,
          node.value,
          options,
          onError,
          (message, severity) => ctx.report({ message, node, severity }),
          (diagnostic) => {
            const diagnostics = (ctx.data.reladrawDiagnostics ??= []);
            diagnostics.push(diagnostic);
          },
        );

        if (outcome.action === "throw") {
          throw outcome.error;
        }
        if (outcome.action === "skip") {
          return;
        }
        return { raw: outcome.html, mdxExpressions: false };
      }
    },
  });
}

/**
 * Sätteri HAST plugin for reladraw diagrams.
 *
 * Intercepts `<pre><code class="language-reladraw">` elements in the HAST tree.
 */
export function satteriReladrawHast(options: SatteriReladrawOptions = {}): HastPluginDefinition {
  const languages = (options.languages ?? ["reladraw"]).map((l) => l.toLowerCase());
  const onError = options.onError ?? "report";

  if (options.themes) {
    registerThemeOverrides(options.themes);
  }

  return defineHastPlugin({
    name: "satteri-reladraw-hast",
    element: {
      filter: ["pre"],
      visit(node, ctx) {
        const children = node.children as HastNode[];
        if (!children || children.length === 0) return;

        const codeChild = children.find((c) => c.type === "element" && c.tagName === "code");
        if (!codeChild || codeChild.type !== "element" || !codeChild.properties) {
          return;
        }

        const classList = Array.isArray(codeChild.properties.className)
          ? (codeChild.properties.className as string[])
          : typeof codeChild.properties.className === "string"
            ? (codeChild.properties.className as string).split(" ")
            : [];

        const langClass = classList.find((c) => c.startsWith("language-"));
        if (!langClass) return;

        const lang = langClass.replace("language-", "").toLowerCase();
        if (!languages.includes(lang)) return;

        const codeText = ctx.textContent(codeChild);
        const meta: DiagramMeta = {};
        const shouldInjectStyles =
          options.injectStyles !== false && !ctx.data.reladrawStylesInjected;

        try {
          const output = renderReladraw(codeText, meta, {
            ...options,
            injectStyles: shouldInjectStyles,
          });

          if (output.includes("<style data-reladraw-styles>")) {
            ctx.data.reladrawStylesInjected = true;
          }

          ctx.replaceNode(node, {
            type: "raw",
            value: output,
          } as HastNode);
        } catch (err) {
          const outcome = handleRenderError(
            err,
            codeText,
            options,
            onError,
            (message, severity) => ctx.report({ message, node, severity }),
            (diagnostic) => {
              const diagnostics = (ctx.data.reladrawDiagnostics ??= []);
              diagnostics.push(diagnostic);
            },
          );

          if (outcome.action === "throw") {
            throw outcome.error;
          }
          if (outcome.action === "skip") {
            return;
          }
          ctx.replaceNode(node, {
            type: "raw",
            value: outcome.html,
          } as HastNode);
        }
      },
    },
  });
}

/**
 * Default export is the MDAST plugin factory.
 */
export default satteriReladraw;
