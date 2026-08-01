import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';
import configCompressPlugin from './plugin/compress';
import configVisualizerPlugin from './plugin/visualizer';

export default mergeConfig(
  {
    mode: 'production',
    // 管理端部署在 /admin/ 子路径（与用户端同域），生产构建使用该 base
    base: '/admin/',
    plugins: [configCompressPlugin('gzip'), configVisualizerPlugin()],
    build: {
      rollupOptions: {
        output: {
          // rolldown 要求 manualChunks 为函数形式
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            // Vue 核心
            if (
              id.includes('/vue/') ||
              id.includes('/vue-router/') ||
              id.includes('/pinia/') ||
              id.includes('/vue-i18n/') ||
              id.includes('/@vueuse/')
            ) {
              return 'vue-core';
            }
            // Arco Design - 基础组件
            if (id.includes('/@arco-design/')) return 'arco-base';
            // 图表库
            if (id.includes('/echarts/') || id.includes('/vue-echarts/')) {
              return 'echarts';
            }
            // 工具库
            if (
              id.includes('/dayjs/') ||
              id.includes('/dompurify/') ||
              id.includes('/marked/') ||
              id.includes('/nprogress/')
            ) {
              return 'utils';
            }
            // HTTP
            if (id.includes('/axios/')) return 'axios';
            return undefined;
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
          "script-src 'self' 'unsafe-inline'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self' data:",
          "connect-src 'self' https:",
          "frame-src 'none'",
          "frame-ancestors 'self'",
          "object-src 'none'",
          "base-uri 'self'",
          "form-action 'self'",
        ].join('; '),
        // HTTP Strict Transport Security (HSTS)
        'Strict-Transport-Security':
          'max-age=31536000; includeSubDomains; preload',
        // 额外的安全头
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      },
    },
  },
  baseConfig,
);
