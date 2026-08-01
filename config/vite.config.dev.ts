import { mergeConfig } from 'vite';
import baseConfig from './vite.config.base';

export default mergeConfig(
  {
    mode: 'development',
    server: {
      port: 8081,
      open: true,
      fs: {
        strict: true,
      },
      proxy: {
        '/auth': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/users': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/announcements': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/categories': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/tags': {
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
        '/avatars': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/account-deletion': {
          target: 'http://localhost:8085',
          changeOrigin: true,
        },
        '/post-images': {
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
  baseConfig,
);
