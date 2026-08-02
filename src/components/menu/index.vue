<script lang="ts">
import { useI18n } from "vue-i18n";
import { Menu, MenuItem, SubMenu } from "@arco-design/web-vue";
import { useAppStore } from "@/store";
import { listenerRouteChange } from "@/utils/route-listener";
import { openWindow, regexUrl } from "@/utils";
import useMenuTree from "./use-menu-tree";

export default defineComponent({
  emit: ["collapse"],
  setup() {
    const { t } = useI18n();
    const appStore = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const { menuTree } = useMenuTree();

    // 在 setup 顶层预解析 Arco 图标组件(resolveComponent 必须在 setup 同步阶段调用)
    const ICON_MAP: Record<string, Component> = {
      "icon-dashboard": resolveComponent("icon-dashboard") as Component,
      "icon-settings": resolveComponent("icon-settings") as Component,
    };

    const collapsed = computed({
      get() {
        if (appStore.device === "desktop") return appStore.menuCollapse;
        return false;
      },
      set(value: boolean) {
        appStore.updateSettings({ menuCollapse: value });
      },
    });

    const topMenu = computed(() => appStore.topMenu);
    const openKeys = ref<string[]>([]);
    const selectedKey = ref<string[]>([]);

    const getAllSubMenuKeys = (routes: RouteRecordRaw[]): string[] => {
      const keys: string[] = [];
      const traverse = (items: RouteRecordRaw[]) => {
        items.forEach((item) => {
          if (item.children && item.children.length > 0) {
            keys.push(item.name as string);
            traverse(item.children);
          }
        });
      };
      traverse(routes);
      return keys;
    };

    const goto = (item: RouteRecordRaw) => {
      // Open external link
      if (regexUrl.test(item.path)) {
        openWindow(item.path);
        selectedKey.value = [item.name as string];
        return;
      }
      // Eliminate external link side effects
      const { hideInMenu, activeMenu } = item.meta as RouteMeta;
      if (route.name === item.name && !hideInMenu && !activeMenu) {
        selectedKey.value = [item.name as string];
        return;
      }
      // Trigger router change
      router.push({
        name: item.name,
      });
    };
    const findMenuOpenKeys = (target: string) => {
      const result: string[] = [];
      let isFind = false;
      const backtrack = (item: RouteRecordRaw, keys: string[]) => {
        if (item.name === target) {
          isFind = true;
          result.push(...keys);
          return;
        }
        if (item.children?.length) {
          item.children.forEach((el) => {
            backtrack(el, [...keys, el.name as string]);
          });
        }
      };
      menuTree.value.forEach((el: RouteRecordRaw) => {
        if (isFind) return; // Performance optimization
        backtrack(el, [el.name as string]);
      });
      return result;
    };
    listenerRouteChange((newRoute) => {
      const { requiresAuth, activeMenu, hideInMenu } = newRoute.meta;
      if (requiresAuth && (!hideInMenu || activeMenu)) {
        const menuOpenKeys = findMenuOpenKeys(
          (activeMenu || newRoute.name) as string,
        );

        const allSubMenuKeys = getAllSubMenuKeys(menuTree.value);
        const keySet = new Set([...allSubMenuKeys, ...menuOpenKeys]);
        openKeys.value = [...keySet];

        selectedKey.value = [
          activeMenu || menuOpenKeys[menuOpenKeys.length - 1],
        ];
      }
    }, true);
    const setCollapse = (val: boolean) => {
      if (appStore.device === "desktop")
        appStore.updateSettings({ menuCollapse: val });
    };

    const renderSubMenu = () => {
      function travel(_route: RouteRecordRaw[], nodes = []) {
        if (_route) {
          _route.forEach((element) => {
            const iconComp = element?.meta?.icon
              ? ICON_MAP[element.meta.icon]
              : null;
            const icon = iconComp ? () => h(iconComp) : null;
            const localeTitle = t(element?.meta?.locale || "");
            const hasChildren =
              element?.children && element?.children.length !== 0;

            const node = hasChildren
              ? h(
                  SubMenu,
                  { key: element?.name },
                  {
                    icon,
                    title: () => localeTitle,
                    default: () => travel(element?.children || []),
                  },
                )
              : h(
                  MenuItem,
                  {
                    key: element?.name,
                    onClick: () => goto(element),
                  },
                  {
                    icon,
                    default: () => localeTitle,
                  },
                );
            nodes.push(node as never);
          });
        }
        return nodes;
      }
      return travel(menuTree.value);
    };

    return () =>
      h(
        Menu,
        {
          mode: topMenu.value ? "horizontal" : "vertical",
          collapsed: collapsed.value,
          "onUpdate:collapsed": (val: boolean) => {
            collapsed.value = val;
          },
          openKeys: openKeys.value,
          "onUpdate:openKeys": (val: string[]) => {
            openKeys.value = val;
          },
          showCollapseButton: appStore.device !== "mobile",
          selectedKeys: selectedKey.value,
          autoOpenSelected: true,
          levelIndent: 34,
          style: "height: 100%;width:100%;",
          onCollapse: setCollapse,
        },
        () => renderSubMenu(),
      );
  },
});
</script>

<style lang="scss" scoped>
:deep(.arco-menu-inner) {
  .arco-menu-inline-header {
    display: flex;
    align-items: center;
  }

  .arco-icon {
    &:not(.arco-icon-down) {
      font-size: 18px;
    }
  }
}
</style>
