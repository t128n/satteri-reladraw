import {
  defineHastPlugin,
  defineMdastPlugin,
  type HastNode,
  type HastPluginDefinition,
  type MdastPluginDefinition,
} from "satteri";
import type { DiagramMeta, SatteriReladrawOptions } from "./types.js";
import { parseMeta, renderDefaultError, renderReladraw } from "./utils.js";

export type {
  DiagramMeta,
  ReladrawMode,
  ReladrawOnError,
  SatteriReladrawOptions,
} from "./types.js";
export {
  escapeHtml,
  parseMeta,
  renderDefaultError,
  renderReladraw,
  resolveTheme,
} from "./utils.js";
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
  }
}

/**
 * Sätteri MDAST plugin for reladraw diagrams.
 *
 * Intercepts code blocks matching `languages` (defaulting to `reladraw`)
 * and transforms them into inline SVG or `<reladraw-diagram>` elements.
 *
 * @example
 * ```ts
 * import { markdownToHtml } from "satteri";
 * import { satteriReladraw } from "satteri-reladraw";
 *
 * const { html } = await markdownToHtml(source, {
 *   mdastPlugins: [satteriReladraw({ theme: "dark" })],
 * });
 * ```
 */
export function satteriReladraw(options: SatteriReladrawOptions = {}): MdastPluginDefinition {
  const languages = (options.languages ?? ["reladraw"]).map((l) => l.toLowerCase());
  const onError = options.onError ?? "report";

  return defineMdastPlugin({
    name: "satteri-reladraw",
    code(node, ctx) {
      const lang = node.lang?.trim().toLowerCase();
      if (!lang || !languages.includes(lang)) {
        return;
      }

      const meta: DiagramMeta = parseMeta(node.meta);

      try {
        const output = renderReladraw(node.value, meta, options);
        return { raw: output, mdxExpressions: false };
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        const line =
          error && typeof error === "object" && "line" in error
            ? (error as { line: number }).line
            : undefined;
        const lineSuffix = line != null ? ` (line ${line})` : "";
        const message = `Failed to compile reladraw diagram${lineSuffix}: ${error.message}`;

        const severity = onError === "fallback" ? "warning" : "error";
        ctx.report({
          message,
          node,
          severity,
        });

        const diagnostics = (ctx.data.reladrawDiagnostics ??= []);
        diagnostics.push({ message, severity, line });

        if (onError === "throw") {
          throw error;
        }

        if (onError === "fallback") {
          return;
        }

        // Default: 'report'
        const errorHtml = options.renderError
          ? options.renderError(error, node.value)
          : renderDefaultError(error, node.value, options.className);

        return { raw: errorHtml, mdxExpressions: false };
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

        try {
          const output = renderReladraw(codeText, meta, options);
          ctx.replaceNode(node, {
            type: "raw",
            value: output,
          } as HastNode);
        } catch (err) {
          const error = err instanceof Error ? err : new Error(String(err));
          const line =
            error && typeof error === "object" && "line" in error
              ? (error as { line: number }).line
              : undefined;
          const lineSuffix = line != null ? ` (line ${line})` : "";
          const message = `Failed to compile reladraw diagram${lineSuffix}: ${error.message}`;

          const severity = onError === "fallback" ? "warning" : "error";
          ctx.report({
            message,
            node,
            severity,
          });

          const diagnostics = (ctx.data.reladrawDiagnostics ??= []);
          diagnostics.push({ message, severity, line });

          if (onError === "throw") {
            throw error;
          }

          if (onError === "fallback") {
            return;
          }

          const errorHtml = options.renderError
            ? options.renderError(error, codeText)
            : renderDefaultError(error, codeText, options.className);

          ctx.replaceNode(node, {
            type: "raw",
            value: errorHtml,
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
