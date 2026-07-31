import { resolve } from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import configArcoStyleImportPlugin from './plugin/arcoStyleImport';
import configArcoResolverPlugin from './plugin/arcoResolver';

export default defineConfig({
  plugins: [
    vue(),
    configArcoStyleImportPlugin(),
    configArcoResolverPlugin(),
  ],
  resolve: {
    alias: [
      {
        find: 'vue',
        replacement: resolve(__dirname, '../node_modules/vue/dist/vue.esm-bundler.js'),
      },
      {
        find: '@',
        replacement: resolve(__dirname, '../src'),
      },
      {
        find: 'assets',
        replacement: resolve(__dirname, '../src/assets'),
      },
    ],
    extensions: ['.ts', '.js'],
  },
  define: {
    'process.env': {},
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
    __VUE_OPTIONS_API__: 'true',
    __VUE_PROD_DEVTOOLS__: 'false',
    // 安全配置
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
  css: {
    preprocessorOptions: {
      less: {
        modifyVars: {
          hack: `true; @import (reference) "${resolve(
            'src/assets/style/breakpoint.less'
          )}";`,
        },
        javascriptEnabled: true,
      },
    },
  },
  // 构建时添加安全相关的配置
  build: {
    rollupOptions: {
      output: {
        // 防止信息泄露
        intro: '/* 海语校园论坛后台管理系统 - 版权所有 */\n',
      },
    },
  },
  // 开发服务器安全配置
  server: {
    headers: {
      // 防止 MIME 类型嗅探
      'X-Content-Type-Options': 'nosniff',
      // 禁止在 frame 中显示（防止点击劫持）
      'X-Frame-Options': 'DENY',
      // XSS 保护
      'X-XSS-Protection': '1; mode=block',
      // Referrer 策略
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      // 禁止缓存敏感内容
      'Cache-Control': 'no-store',
    },
  },
});
