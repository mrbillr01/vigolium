import type { Plugin } from "vite";

// This report always embeds every generated script/style; it needs no glob matcher.
export function singleFilePlugin(): Plugin {
  return {
    name: "report-single-file",
    enforce: "post",
    config: () => ({
      base: "./",
      build: {
        assetsDir: "",
        assetsInlineLimit: () => true,
        cssCodeSplit: false,
        chunkSizeWarningLimit: 100000000,
        rollupOptions: { output: { inlineDynamicImports: true } },
      },
    }),
    generateBundle(_options, bundle) {
      const inlined = new Set<string>();
      for (const entry of Object.values(bundle)) {
        if (entry.type !== "asset" || !/\.html?$/.test(entry.fileName)) continue;
        let html = String(entry.source);
        for (const asset of Object.values(bundle)) {
          const filename = asset.fileName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          if (asset.type === "chunk" && /\.[mc]?js$/.test(asset.fileName)) {
            const pattern = new RegExp(`<script([^>]*?) src="(?:[^"]*?/)?${filename}"([^>]*)></script>`);
            if (!pattern.test(html)) continue;
            const code = asset.code.replace(/"?__VITE_PRELOAD__"?/g, "void 0").replace(/<(\/script>|!--)/g, "\\x3C$1");
            html = html.replace(pattern, (_match, before, after) => `<script${before}${after}>${code.trim()}</script>`);
            inlined.add(asset.fileName);
          } else if (asset.type === "asset" && /\.css$/.test(asset.fileName)) {
            const pattern = new RegExp(`<link([^>]*?) href="(?:[^"]*?/)?${filename}"([^>]*)>`);
            if (!pattern.test(html)) continue;
            const css = String(asset.source).replace('@charset "UTF-8";', "");
            html = html.replace(pattern, (_match, before, after) => `<style${before}${after}>${css.trim()}</style>`);
            inlined.add(asset.fileName);
          }
        }
        entry.source = html;
      }
      for (const filename of inlined) delete bundle[filename];
    },
  };
}
