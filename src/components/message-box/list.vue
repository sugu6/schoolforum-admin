<template>
  <a-list :bordered="false">
    <a-list-item
      v-for="item in renderList"
      :key="item.id"
      action-layout="vertical"
      :style="{ opacity: item.isRead ? 0.5 : 1 }"
    >
      <template #extra>
        <a-tag v-if="item.type === 'COMMENT'" color="blue">
          {{ $t("messageBox.type.comment") }}
        </a-tag>
        <a-tag v-else-if="item.type === 'LIKE'" color="red">
          {{ $t("messageBox.type.like") }}
        </a-tag>
        <a-tag v-else-if="item.type === 'FOLLOW'" color="green">
          {{ $t("messageBox.type.follow") }}
        </a-tag>
        <a-tag v-else-if="item.type === 'MENTION'" color="purple">
          {{ $t("messageBox.type.mention") }}
        </a-tag>
        <a-tag v-else color="gray"> {{ $t("messageBox.type.system") }} </a-tag>
      </template>
      <div class="item-wrap" @click="onItemClick(item)">
        <a-list-item-meta>
          <template #avatar>
            <a-avatar shape="circle">
              <img v-if="item.sender?.avatarUrl" :src="item.sender.avatarUrl" />
              <icon-notification v-else />
            </a-avatar>
          </template>
          <template #title>
            <a-space :size="4">
              <span>{{ item.title }}</span>
              <a-typography-text v-if="item.sender" type="secondary">
                {{ item.sender.username }}
              </a-typography-text>
            </a-space>
          </template>
          <template #description>
            <div>
              <a-typography-paragraph :ellipsis="{ rows: 1 }">
                {{ item.content }}
              </a-typography-paragraph>
              <a-typography-text class="time-text">
                {{ formatTime(item.createdAt) }}
              </a-typography-text>
            </div>
          </template>
        </a-list-item-meta>
      </div>
    </a-list-item>
    <template #footer>
      <a-space
        fill
        :size="0"
        :class="{ 'add-border-top': renderList.length < showMax }"
      >
        <div class="footer-wrap">
          <a-link @click="emit('readAll')">
            {{ $t("messageBox.allRead") }}
          </a-link>
        </div>
        <div class="footer-wrap">
          <a-link>{{ $t("messageBox.viewMore") }}</a-link>
        </div>
      </a-space>
    </template>
    <div
      v-if="renderList.length && renderList.length < 3"
      :style="{ height: (showMax - renderList.length) * 86 + 'px' }"
    ></div>
  </a-list>
</template>

<script lang="ts" setup>
import type { NotificationItem } from "./index.vue";

defineProps<{
  renderList: NotificationItem[];
}>();

const emit = defineEmits<{
  itemClick: [item: NotificationItem];
  readAll: [];
}>();

const onItemClick = (item: NotificationItem) => {
  if (!item.isRead) {
    emit("itemClick", item);
  }
};

const formatTime = (dateStr: string) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  return date.toLocaleDateString();
};

const showMax = 3;
</script>

<style scoped lang="scss">
:deep(.arco-list) {
  .arco-list-item {
    min-height: 86px;
    border-bottom: 1px solid rgb(var(--gray-3));
  }
  .arco-list-item-extra {
    position: absolute;
    right: 20px;
  }
  .arco-list-item-meta-content {
    flex: 1;
  }
  .item-wrap {
    cursor: pointer;
  }
  .time-text {
    font-size: 12px;
    color: rgb(var(--gray-6));
  }
  .arco-empty {
    display: none;
  }
  .arco-list-footer {
    padding: 0;
    height: 50px;
    line-height: 50px;
    border-top: none;
    .arco-space-item {
      width: 100%;
      border-right: 1px solid rgb(var(--gray-3));
      &:last-child {
        border-right: none;
      }
    }
    .add-border-top {
      border-top: 1px solid rgb(var(--gray-3));
    }
  }
  .footer-wrap {
    text-align: center;
  }
  .arco-typography {
    margin-bottom: 0;
  }
  .add-border {
    border-top: 1px solid rgb(var(--gray-3));
  }
}
</style>
