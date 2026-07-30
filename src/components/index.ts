export { default as Chart } from './chart/index.vue';
export { default as Breadcrumb } from './breadcrumb/index.vue';
export { default as MarkdownRenderer } from './markdown-renderer/index.vue';

export function setupECharts() {
  import('echarts/core').then(({ use }) => {
    Promise.all([
      import('echarts/renderers'),
      import('echarts/charts'),
      import('echarts/components'),
    ]).then(
      ([
        { CanvasRenderer },
        { BarChart, LineChart, PieChart, RadarChart },
        {
          GridComponent,
          TooltipComponent,
          LegendComponent,
          DataZoomComponent,
          GraphicComponent,
        },
      ]) => {
        use([
          CanvasRenderer,
          BarChart,
          LineChart,
          PieChart,
          RadarChart,
          GridComponent,
          TooltipComponent,
          LegendComponent,
          DataZoomComponent,
          GraphicComponent,
        ]);
      },
    );
  });
}
