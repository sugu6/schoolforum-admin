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
      proxy: {
        '/users': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/posts': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/comments': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/tags': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/categories': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/announcements': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/dashboard': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/upload': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/avatars': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/account-deletion': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/search': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
      },
    },
  },
  baseConfig
);
