import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

export default defineConfig({
  site: "https://uwpdver.github.io",
  base: "/blog-2025",
  integrations: [mdx(), sitemap(), tailwind()],
});
