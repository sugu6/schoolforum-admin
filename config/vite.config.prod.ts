import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';

export default mergeConfig(
  {
    mode: 'production',
    plugins: [
      configCompressPlugin('gzip'),
      configVisualizerPlugin(),
    ],
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            // Vue 核心
            'vue-core': ['vue'],
            'vue-router': ['vue-router'],
            'pinia': ['pinia'],
            'vue-i18n': ['vue-i18n'],
            '@vueuse/core': ['@vueuse/core'],

            // Arco Design - 基础组件
            'arco-base': ['@arco-design/web-vue'],

            // 图表库
            'echarts-core': ['echarts/core'],
            'echarts-charts': ['echarts/charts'],
            'echarts-components': ['echarts/components'],
            'vue-echarts': ['vue-echarts'],

            // 工具库
            'utils': ['dayjs', 'dompurify', 'marked', 'nprogress'],

            // HTTP
            'axios': ['axios'],
          },
        },
        chunkSizeWarningLimit: 1500,
      },
      // 启用更好的 tree-shaking
      treeshake: true,
      // 移除 console 和 debugger（生产环境）
      drop: ['console', 'debugger'],
    },
    // 生产环境预览服务器配置
    preview: {
      headers: {
        // Content Security Policy - 生产环境应该根据实际需求调整
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https: http:",
          "font-src 'self' data:",
          "connect-src 'self' https:",
          "frame-src 'none'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
        // HTTP Strict Transport Security (HSTS)
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
        // 额外的安全头
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      },
    },
  },
  baseConfig
);
