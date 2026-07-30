import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress';

import { useUserStore } from '@/store';

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (val) => {
        clearTimeout(timer);
        resolve(val);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    NProgress.start();
    const userStore = useUserStore();

    if (to.name === 'login') {
      next();
      return;
    }

    try {
      await withTimeout(userStore.info(), 5000);
      next();
    } catch (error) {
      await userStore.logout();
      next({
        name: 'login',
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
