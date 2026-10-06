import { describe, expect, it } from "bun:test";
import { markdownToHtml, mdxToJs } from "satteri";
import {
  BUILTIN_THEME_NAMES,
  BUILTIN_THEMES,
  createAccent,
  defineTheme,
  githubDark,
  githubLight,
  mixColors,
  oxocarbonDark,
  oxocarbonLight,
  satteriReladraw,
  satteriReladrawHast,
} from "./index.js";

const basicDiagram = `
node app "Web App"
node db "Database" right of app
edge app -> db "queries"
`;

describe("satteriReladraw (MDAST plugin)", () => {
  it("compiles reladraw code fence into inline SVG inside a div", async () => {
    const markdown = `# Diagram\n\`\`\`reladraw\n${basicDiagram}\n\`\`\``;
    const result = await markdownToHtml(markdown, {
      mdastPlugins: [satteriReladraw()],
    });

    expect(result.html).toContain('<div class="reladraw">');
    expect(result.html).toContain("<svg");
    expect(result.html).toContain("Web App");
    expect(result.html).toContain("Database");
    expect(result.html).toContain("queries");
  });

  it("leaves other code fence languages unchanged", async () => {
    const markdown = "```typescript\nconst x: number = 42;\n```";
    const result = await markdownToHtml(markdown, {
      mdastPlugins: [satteriReladraw()],
    });

    expect(result.html).not.toContain("<svg");
    expect(result.html).toContain("<pre");
    expect(result.html).toContain("const x: number = 42;");
  });

  it("supports custom language tags", async () => {
    const markdown = `\`\`\`rela\n${basicDiagram}\n\`\`\``;
    const result = await markdownToHtml(markdown, {
      mdastPlugins: [satteriReladraw({ languages: ["rela"] })],
    });

    expect(result.html).toContain("<svg");
    expect(result.html).toContain("Web App");
  });

  it("applies theme specified in plugin options", async () => {
    const markdown = `\`\`\`reladraw\n${basicDiagram}\n\`\`\``;
    const result = await markdownToHtml(markdown, {
      mdastPlugins: [satteriReladraw({ theme: "light" })],
    });

    expect(result.html).toContain("<svg");
    // Light theme uses white background
    expect(result.html).toContain('fill="#ffffff"');
  });

  it("allows theme override via code fence meta", async () => {
    const markdown = `\`\`\`reladraw theme="light"\n${basicDiagram}\n\`\`\``;
    const result = await markdownToHtml(markdown, {
      mdastPlugins: [satteriReladraw({ theme: "dark" })],
    });

    expect(result.html).toContain("<svg");
    expect(result.html).toContain('fill="#ffffff"');
  });

  describe("built-in additional themes", () => {
    it("renders with github-light theme", async () => {
      const markdown = `\`\`\`reladraw theme=github-light\n${basicDiagram}\n\`\`\``;
      const result = await markdownToHtml(markdown, {
        mdastPlugins: [satteriReladraw()],
      });

      expect(result.html).toContain("<svg");
      // GitHub light edge color is #0969da
      expect(result.html).toContain("#0969da");
    });

    it("renders with github-dark theme", async () => {
      const markdown = `\`\`\`reladraw theme=github-dark\n${basicDiagram}\n\`\`\``;
      const result = await markdownToHtml(markdown, {
        mdastPlugins: [satteriReladraw()],
      });

      expect(result.html).toContain("<svg");
      // GitHub dark page background is #0d1117
      expect(result.html).toContain("#0d1117");
      // GitHub dark edge color is #58a6ff
      expect(result.html).toContain("#58a6ff");
    });

    it("renders with oxocarbon-dark theme", async () => {
      const markdown = `\`\`\`reladraw theme=oxocarbon-dark\n${basicDiagram}\n\`\`\``;
      const result = await markdownToHtml(markdown, {
        mdastPlugins: [satteriReladraw()],
      });

      expect(result.html).toContain("<svg");
      // Oxocarbon dark background is #161616
      expect(result.html).toContain("#161616");
      // Oxocarbon dark edge color is #78a9ff
      expect(result.html).toContain("#78a9ff");
    });

    it("renders with oxocarbon-light theme", async () => {
      const markdown = `\`\`\`reladraw theme=oxocarbon-light\n${basicDiagram}\n\`\`\``;
      const result = await markdownToHtml(markdown, {
        mdastPlugins: [satteriReladraw()],
      });

      expect(result.html).toContain("<svg");
      // Oxocarbon light background is #f2f4f8
      expect(result.html).toContain("#f2f4f8");
      // Oxocarbon light edge color is #0f62fe
      expect(result.html).toContain("#0f62fe");
    });
  });

  describe("configurable custom themes", () => {
    it("registers custom themes via options.themes and uses in code fence meta", async () => {
      const markdown = `\`\`\`reladraw theme=synthwave\n${basicDiagram}\n\`\`\``;
      const result = await markdownToHtml(markdown, {
        mdastPlugins: [
          satteriReladraw({
            themes: {
              synthwave: {
                background: "#262335",
                boxFill: "#241b2f",
                boxStroke: "#fe4450",
                text: "#f92aad",
                edge: "#72f1b8",
              },
            },
          }),
        ],
      });

      expect(result.html).toContain("<svg");
      expect(result.html).toContain("#262335");
      expect(result.html).toContain("#72f1b8");
    });

    it("allows overriding built-in theme via options.themes", async () => {
      const markdown = `\`\`\`reladraw theme=dark\n${basicDiagram}\n\`\`\``;
      const result = await markdownToHtml(markdown, {
        mdastPlugins: [
          satteriReladraw({
            themes: {
              dark: {
                background: "#010101",
                boxFill: "#020202",
                boxStroke: "#030303",
                text: "#040404",
                edge: "#ff00ff",
              },
            },
          }),
        ],
      });

      expect(result.html).toContain("<svg");
      expect(result.html).toContain("#010101");
      expect(result.html).toContain("#ff00ff");
    });

    it("supports ThemeDefinition object directly in options.theme", async () => {
      const markdown = `\`\`\`reladraw\n${basicDiagram}\n\`\`\``;
      const result = await markdownToHtml(markdown, {
        mdastPlugins: [
          satteriReladraw({
            theme: {
              background: "#0a0a0a",
              boxFill: "#1a1a1a",
              boxStroke: "#333333",
              text: "#f5f5f5",
              edge: "#e11d48",
            },
          }),
        ],
      });

      expect(result.html).toContain("<svg");
      expect(result.html).toContain("#0a0a0a");
      expect(result.html).toContain("#e11d48");
    });

    it("throws helpful error when unknown theme is requested", async () => {
      const markdown = `\`\`\`reladraw theme=nonexistent-theme\n${basicDiagram}\n\`\`\``;
      const result = await markdownToHtml(markdown, {
        mdastPlugins: [satteriReladraw({ onError: "report" })],
      });

      expect(result.html).toContain('class="reladraw-error"');
      expect(result.html).toContain("Unknown reladraw theme");
      expect(result.html).toContain("nonexistent-theme");
      expect(result.html).toContain("github-dark");
      expect(result.html).toContain("oxocarbon-dark");
    });
  });

  it("supports mode='element' for client-side web component output", async () => {
    const markdown = `\`\`\`reladraw\nnode a "Hello" <-> b "World"\n\`\`\``;
    const result = await markdownToHtml(markdown, {
      mdastPlugins: [satteriReladraw({ mode: "element", theme: "light" })],
    });

    expect(result.html).toContain('<div class="reladraw">');
    expect(result.html).toContain('<reladraw-diagram theme="light">');
    expect(result.html).toContain("&lt;-&gt;");
    expect(result.html).toContain("</reladraw-diagram>");
    expect(result.html).not.toContain("<svg");
  });

  it("supports mode='element' via code fence meta", async () => {
    const markdown = `\`\`\`reladraw mode=element\nnode a "Hello"\n\`\`\``;
    const result = await markdownToHtml(markdown, {
      mdastPlugins: [satteriReladraw({ mode: "svg" })],
    });

    expect(result.html).toContain("<reladraw-diagram");
    expect(result.html).not.toContain("<svg");
  });

  it("supports tag='figure' with caption in code fence meta", async () => {
    const markdown = `\`\`\`reladraw title="System Architecture"\n${basicDiagram}\n\`\`\``;
    const result = await markdownToHtml(markdown, {
      mdastPlugins: [satteriReladraw({ tag: "figure" })],
    });

    expect(result.html).toContain('<figure class="reladraw">');
    expect(result.html).toContain("<figcaption>System Architecture</figcaption>");
    expect(result.html).toContain("</figure>");
  });

  it("supports tag=null for raw SVG output without wrapper", async () => {
    const markdown = `\`\`\`reladraw\n${basicDiagram}\n\`\`\``;
    const result = await markdownToHtml(markdown, {
      mdastPlugins: [satteriReladraw({ tag: null })],
    });

    expect(result.html.trim().startsWith("<svg")).toBe(true);
    expect(result.html).not.toContain('<div class="reladraw">');
  });

  it("customizes wrapper class name", async () => {
    const markdown = `\`\`\`reladraw\n${basicDiagram}\n\`\`\``;
    const result = await markdownToHtml(markdown, {
      mdastPlugins: [satteriReladraw({ className: "custom-diagram" })],
    });

    expect(result.html).toContain('<div class="custom-diagram">');
  });

  describe("error handling", () => {
    const invalidDiagram = `\`\`\`reladraw\nnode a\nnode invalid syntax without quotes ???\n\`\`\``;

    it("reports diagnostic and renders error container with onError='report'", async () => {
      const result = await markdownToHtml(invalidDiagram, {
        mdastPlugins: [satteriReladraw({ onError: "report" })],
      });

      expect(result.html).toContain('class="reladraw-error"');
      expect(result.html).toContain("Error compiling reladraw diagram");
      expect(result.data.reladrawDiagnostics?.length).toBe(1);
      expect(result.data.reladrawDiagnostics?.[0]?.severity).toBe("error");
    });

    it("falls back to original code block with onError='fallback'", async () => {
      const result = await markdownToHtml(invalidDiagram, {
        mdastPlugins: [satteriReladraw({ onError: "fallback" })],
      });

      expect(result.html).toContain("<pre");
      expect(result.html).toContain("node invalid syntax without quotes ???");
      expect(result.data.reladrawDiagnostics?.length).toBe(1);
      expect(result.data.reladrawDiagnostics?.[0]?.severity).toBe("warning");
    });

    it("throws error with onError='throw'", () => {
      expect(async () => {
        await markdownToHtml(invalidDiagram, {
          mdastPlugins: [satteriReladraw({ onError: "throw" })],
        });
      }).toThrow();
    });

    it("allows custom error renderer", async () => {
      const result = await markdownToHtml(invalidDiagram, {
        mdastPlugins: [
          satteriReladraw({
            onError: "report",
            renderError: (err) => `<p class="my-err">Failed: ${err.message}</p>`,
          }),
        ],
      });

      expect(result.html).toContain('<p class="my-err">Failed:');
    });
  });

  describe("MDX compatibility", () => {
    it("compiles properly under mdxToJs", async () => {
      const markdown = `# Architecture\n\`\`\`reladraw\n${basicDiagram}\n\`\`\``;
      const result = await mdxToJs(markdown, {
        mdastPlugins: [satteriReladraw()],
      });

      expect(result.code).toContain("svg");
      expect(result.code).toContain("Web App");
    });
  });
});

describe("satteriReladrawHast (HAST plugin)", () => {
  it("compiles reladraw pre/code elements in HAST stage", async () => {
    const markdown = `\`\`\`reladraw\n${basicDiagram}\n\`\`\``;
    const result = await markdownToHtml(markdown, {
      hastPlugins: [satteriReladrawHast()],
    });

    expect(result.html).toContain("<svg");
    expect(result.html).toContain("Web App");
  });
});

describe("theming utilities & exports", () => {
  it("exports all built-in themes and lists their names", () => {
    expect(BUILTIN_THEME_NAMES).toContain("github-light");
    expect(BUILTIN_THEME_NAMES).toContain("github-dark");
    expect(BUILTIN_THEME_NAMES).toContain("oxocarbon-dark");
    expect(BUILTIN_THEME_NAMES).toContain("oxocarbon-light");
    expect(BUILTIN_THEMES["github-dark"]).toBe(githubDark);
    expect(BUILTIN_THEMES["github-light"]).toBe(githubLight);
    expect(BUILTIN_THEMES["oxocarbon-dark"]).toBe(oxocarbonDark);
    expect(BUILTIN_THEMES["oxocarbon-light"]).toBe(oxocarbonLight);
  });

  it("mixColors correctly blends two hex colors", () => {
    // 50% between black and white should be mid-gray
    const midGray = mixColors("#ffffff", "#000000", 0.5);
    expect(midGray).toBe("#808080");

    // 100% color over page returns color
    expect(mixColors("#ff0000", "#000000", 1.0)).toBe("#ff0000");

    // 0% color over page returns page
    expect(mixColors("#ff0000", "#000000", 0.0)).toBe("#000000");
  });

  it("createAccent generates valid Accent objects", () => {
    const accent = createAccent("#ff0000", "#ffffff", "#000000");
    expect(accent.color).toBe("#ff0000");
    expect(accent.on).toBe("#000000");
    expect(accent.subtle).toBeDefined();
    expect(accent.subtle.startsWith("#")).toBe(true);
  });

  it("defineTheme fills in default values for optional properties", () => {
    const custom = defineTheme({
      background: "#101010",
      boxFill: "#202020",
      boxStroke: "#404040",
      text: "#ffffff",
      edge: "#3b82f6",
    });

    expect(custom.background).toBe("#101010");
    expect(custom.boxFill).toBe("#202020");
    expect(custom.boxStroke).toBe("#404040");
    expect(custom.text).toBe("#ffffff");
    expect(custom.edge).toBe("#3b82f6");
    expect(custom.containerFill).toBeDefined();
    expect(custom.containerStroke).toBeDefined();
    expect(custom.mutedText).toBeDefined();
    expect(custom.iconInk).toBeDefined();
    expect(custom.iconShade).toBeDefined();
    expect(custom.primary).toBeDefined();
    expect(custom.secondary).toBeDefined();
  });
});
