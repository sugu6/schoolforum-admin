import { RouteLocationNormalized, RouteRecordRaw } from 'vue-router';
import { useUserStore } from '@/store';

export default function usePermission() {
  const userStore = useUserStore();
  return {
    accessRouter(route: RouteLocationNormalized | RouteRecordRaw) {
      return (
        !route.meta?.requiresAuth ||
        !route.meta?.roles ||
        route.meta?.roles?.includes('*') ||
        route.meta?.roles?.includes(userStore.role)
      );
    },
    findFirstPermissionRoute(routers: RouteRecordRaw[], role = 'admin') {
      const cloneRouters = [...routers];
      while (cloneRouters.length) {
        const firstElement = cloneRouters.shift();
        if (
          firstElement?.meta?.roles?.some((el: string) => {
            return el === '*' || el === role;
          })
        ) {
          return { name: firstElement.name };
        }
        if (firstElement?.children) {
          cloneRouters.push(...firstElement.children);
        }
      }
      return null;
    },
  };
}
