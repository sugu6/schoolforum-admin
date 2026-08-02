import type { Router, LocationQueryRaw } from "vue-router";
import NProgress from "nprogress";

import { useUserStore } from "@/store";
import { DEFAULT_ROUTE_NAME } from "@/router/constants";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("timeout")), ms);
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

    if (to.name === "login") {
      // 若已有有效会话（如从用户端跳转而来，共享同一登录 Cookie），直接进入工作台
      try {
        await withTimeout(userStore.info(), 3000);
        next({ name: DEFAULT_ROUTE_NAME });
      } catch {
        next();
      }
      return;
    }

    try {
      await withTimeout(userStore.info(), 5000);
      next();
    } catch {
      await userStore.logout();
      next({
        name: "login",
        query: {
          redirect: to.name,
          ...to.query,
        } as LocationQueryRaw,
      });
    }
  });
}
