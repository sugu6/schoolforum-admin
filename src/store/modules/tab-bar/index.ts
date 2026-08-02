import type { RouteLocationNormalized } from "vue-router";
import { defineStore } from "pinia";
import {
  DEFAULT_ROUTE,
  DEFAULT_ROUTE_NAME,
  REDIRECT_ROUTE_NAME,
} from "@/router/constants";
import { isString } from "@/utils/is";
import { TabBarState, TagProps } from "./types";

const formatTag = (route: RouteLocationNormalized): TagProps => {
  const { name, meta, fullPath, query } = route;
  return {
    title: meta.locale || "",
    name: String(name),
    fullPath,
    query,
    ignoreCache: meta.ignoreCache,
  };
};

const BAN_LIST = [REDIRECT_ROUTE_NAME];

const useAppStore = defineStore("tabBar", {
  state: (): TabBarState => ({
    cacheTabList: [DEFAULT_ROUTE_NAME],
    tagList: [DEFAULT_ROUTE],
  }),

  getters: {
    getTabList(): TagProps[] {
      return this.tagList;
    },
    getCacheList(): string[] {
      return this.cacheTabList;
    },
  },

  actions: {
    updateTabList(route: RouteLocationNormalized) {
      if (BAN_LIST.includes(route.name as string)) return;
      this.tagList.push(formatTag(route));
      if (!route.meta.ignoreCache) {
        const name = route.name as string;
        if (!this.cacheTabList.includes(name)) {
          this.cacheTabList.push(name);
        }
      }
    },
    deleteTag(idx: number, tag: TagProps) {
      this.tagList.splice(idx, 1);
      const index = this.cacheTabList.indexOf(tag.name);
      if (index > -1) this.cacheTabList.splice(index, 1);
    },
    addCache(name: string) {
      if (isString(name) && name !== "" && !this.cacheTabList.includes(name)) {
        this.cacheTabList.push(name);
      }
    },
    deleteCache(tag: TagProps) {
      const index = this.cacheTabList.indexOf(tag.name);
      if (index > -1) this.cacheTabList.splice(index, 1);
    },
    freshTabList(tags: TagProps[]) {
      this.tagList = tags;
      this.cacheTabList = [];
      this.tagList
        .filter((el) => !el.ignoreCache)
        .map((el) => el.name)
        .forEach((x) => this.cacheTabList.push(x));
    },
    resetTabList() {
      this.tagList = [DEFAULT_ROUTE];
      this.cacheTabList = [DEFAULT_ROUTE_NAME];
    },
  },
});

export default useAppStore;
