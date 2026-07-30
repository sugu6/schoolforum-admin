import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      port: 8081,
      host: '127.0.0.1',
      open: true,
      fs: {
        strict: true,
      },
      cors: true,
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      // proxy 配置暂时禁用以排查问题
      // proxy: {
      //   '/users': {
      //     target: 'http://localhost:8085',
      //     changeOrigin: true,
      //     withCredentials: true,
      //   },
      // },
    },
  },
  baseConfig
);
