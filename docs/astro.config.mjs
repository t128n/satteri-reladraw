import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import { satteri } from "@astrojs/markdown-satteri";
import { satteriReladraw } from "satteri-reladraw";

export default defineConfig({
  site: "https://t128n.github.io",
  base: "/satteri-reladraw",
  markdown: {
    processor: satteri({
      mdastPlugins: [satteriReladraw({ theme: "auto" })],
    }),
  },
  integrations: [
    starlight({
      title: "satteri-reladraw",
      description: "Sätteri plugin for reladraw diagrams in Markdown and MDX",
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/t128n/satteri-reladraw",
        },
        {
          icon: "npmx",
          label: "npmx",
          href: "https://npmx.dev/package/satteri-reladraw",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", slug: "index" },
            { label: "Installation & Setup", slug: "getting-started" },
            { label: "Astro Starlight Integration", slug: "astro-integration" },
          ],
        },
        {
          label: "Showcase & Demos",
          items: [
            { label: "Diagram Showcase", slug: "showcase" },
            { label: "Themes & Styling", slug: "themes" },
            { label: "Containers & Figures", slug: "containers" },
            { label: "Web Component Mode", slug: "web-component" },
          ],
        },
        {
          label: "Reference",
          items: [
            { label: "Plugin Configuration", slug: "configuration" },
            { label: "reladraw Syntax Cheat Sheet", slug: "syntax" },
          ],
        },
      ],
    }),
  ],
});
