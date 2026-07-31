/**
 * Generic BFS (Breadth-First Search) utilities for route tree traversal.
 * Shared between hooks/permission.ts and router/guard/permission.ts.
 */

export interface RouteRecordItem {
  name?: string;
  path: string;
  meta?: Record<string, any>;
  children?: RouteRecordItem[];
}

/**
 * Find the first route (breadth-first) whose meta.roles includes at least one
 * of the roles that the current user holds.
 *
 * @param userRole  Single role string (e.g. 'SUPER_ADMIN', 'ADMIN', 'USER')
 * @param routes    Flat or nested route list to search
 * @returns         First matching route record, or undefined if none found
 */
export function findFirstPermissionRoute(
  userRole: string,
  routes: RouteRecordItem[],
): RouteRecordItem | undefined {
  const queue: RouteRecordItem[] = [...routes];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) continue;

    const roles = current.meta?.roles;
    if (roles) {
      if (Array.isArray(roles) && roles.includes(userRole)) {
        return current;
      }
      if (roles === '*') {
        return current;
      }
    }

    if (current.children && current.children.length > 0) {
      queue.push(...current.children);
    }
  }
  return undefined;
}
