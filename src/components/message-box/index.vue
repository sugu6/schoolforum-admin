<template>
  <a-spin style="display: block; width: 280px" :loading="loading">
    <a-tabs v-model:active-key="activeType" type="rounded" destroy-on-hide>
      <a-tab-pane v-for="item in tabList" :key="item.key">
        <template #title>
          <span>{{ item.title }}{{ formatUnreadLength(item.key) }}</span>
        </template>
        <a-result v-if="!filteredList.length" status="404">
          <template #subtitle>{{ $t("messageBox.noContent") }}</template>
        </a-result>
        <List
          v-else
          :render-list="filteredList"
          @item-click="handleItemClick"
          @read-all="handleReadAll"
        />
      </a-tab-pane>
      <template #extra>
        <a-button type="text" @click="handleClearAll">
          {{ $t("messageBox.tab.button") }}
        </a-button>
      </template>
    </a-tabs>
  </a-spin>
</template>

<script lang="ts" setup>
import { useI18n } from "vue-i18n";
import useLoading from "@/hooks/loading";
import List from "./list.vue";

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  content: string;
  sender?: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  isRead: boolean;
  createdAt: string;
}

const NOTIFICATION_TAB_MAP: Record<string, string[]> = {
  all: [],
  comment: ["COMMENT", "MENTION"],
  like: ["LIKE"],
  follow: ["FOLLOW"],
  system: ["SYSTEM"],
};

interface TabItem {
  key: string;
  title: string;
}

const { loading, setLoading } = useLoading(false);
const activeType = ref("all");
const { t } = useI18n();
const notificationList = ref<NotificationItem[]>([]);

const tabList: TabItem[] = [
  { key: "all", title: t("messageBox.tab.title.all") },
  { key: "comment", title: t("messageBox.tab.title.comment") },
  { key: "like", title: t("messageBox.tab.title.like") },
  { key: "follow", title: t("messageBox.tab.title.follow") },
  { key: "system", title: t("messageBox.tab.title.system") },
];

const filteredList = computed(() => {
  const types = NOTIFICATION_TAB_MAP[activeType.value];
  if (!types || types.length === 0) return notificationList.value;
  return notificationList.value.filter((item) => types.includes(item.type));
});

const getUnreadList = (tabKey: string) => {
  const types = NOTIFICATION_TAB_MAP[tabKey];
  const list = types?.length
    ? notificationList.value.filter((item) => types.includes(item.type))
    : notificationList.value;
  return list.filter((item) => !item.isRead);
};

const formatUnreadLength = (tabKey: string) => {
  const count = getUnreadList(tabKey).length;
  return count ? `(${count})` : "";
};

const handleItemClick = (item: NotificationItem) => {
  if (!item.isRead) {
    item.isRead = true;
  }
};

const handleReadAll = () => {
  notificationList.value.forEach((item) => {
    item.isRead = true;
  });
};

const handleClearAll = () => {
  notificationList.value = [];
};

setLoading(false);
</script>

<style scoped lang="scss">
:deep(.arco-list-item-meta) {
  align-items: flex-start;
}
:deep(.arco-tabs-nav) {
  padding: 14px 0 12px 16px;
  border-bottom: 1px solid var(--color-neutral-3);
}
:deep(.arco-tabs-content) {
  padding-top: 0;
  .arco-result-subtitle {
    color: rgb(var(--gray-6));
  }
}
</style>
