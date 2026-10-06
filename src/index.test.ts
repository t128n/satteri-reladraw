import { describe, expect, it } from "bun:test";
import { markdownToHtml, mdxToJs } from "satteri";
import { satteriReladraw, satteriReladrawHast } from "./index.js";

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
