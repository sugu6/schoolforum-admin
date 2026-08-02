import AutoImport from "unplugin-auto-import/vite";

export default function configAutoImportPlugin() {
  return AutoImport({
    imports: [
      "vue",
      "vue-router",
      "pinia",
      "@vueuse/core",
      {
        from: "vue-router",
        imports: [
          { name: "RouteRecordRaw", type: true },
          { name: "RouteRecordNormalized", type: true },
          { name: "RouteMeta", type: true },
          { name: "RouteLocationNormalized", type: true },
          { name: "NavigationGuard", type: true },
        ],
      },
    ],
    dts: "src/auto-imports.d.ts",
    eslintrc: {
      enabled: true,
      filepath: "./.eslintrc-auto-import.json",
    },
  });
}
