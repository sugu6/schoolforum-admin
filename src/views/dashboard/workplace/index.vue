<template>
  <div class="workplace">
    <!-- 欢迎横幅 -->
    <div class="welcome-banner">
      <div class="welcome-info">
        <a-typography-title :heading="4" class="welcome-title">
          {{ $t('workplace.welcomeBack')
          }}{{ userInfo.name ? `，${userInfo.name}` : '' }}
        </a-typography-title>
        <a-typography-text class="welcome-subtitle">
          {{ $t('workplace.welcomeDesc') }}
        </a-typography-text>
      </div>
      <div class="welcome-meta">
        <div class="meta-item">
          <span class="meta-label">{{ $t('workplace.todayDate') }}</span>
          <span class="meta-value">{{ todayDate }}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">{{ $t('workplace.userRole') }}</span>
          <span class="role-tag">
            <span
              class="role-dot"
              :style="{ backgroundColor: roleColor }"
            ></span>
            {{ roleLabel }}
          </span>
        </div>
      </div>
    </div>

    <!-- 核心指标卡片 -->
    <a-row :gutter="16" class="stat-row">
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <a-card class="stat-card stat-card--users" :bordered="false">
          <div class="stat-card-inner">
            <div class="stat-icon">
              <icon-user-group />
            </div>
            <div class="stat-info">
              <a-statistic
                :title="$t('workplace.totalUsers')"
                :value="stats.users"
                animation
                show-group-separator
              />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <a-card class="stat-card stat-card--posts" :bordered="false">
          <div class="stat-card-inner">
            <div class="stat-icon">
              <icon-file />
            </div>
            <div class="stat-info">
              <a-statistic
                :title="$t('workplace.totalPosts')"
                :value="stats.posts"
                animation
                show-group-separator
              />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <a-card class="stat-card stat-card--comments" :bordered="false">
          <div class="stat-card-inner">
            <div class="stat-icon">
              <icon-message />
            </div>
            <div class="stat-info">
              <a-statistic
                :title="$t('workplace.totalComments')"
                :value="stats.comments"
                animation
                show-group-separator
              />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <a-card class="stat-card stat-card--announcements" :bordered="false">
          <div class="stat-card-inner">
            <div class="stat-icon">
              <icon-notification />
            </div>
            <div class="stat-info">
              <a-statistic
                :title="$t('workplace.totalAnnouncements')"
                :value="stats.announcements"
                animation
                show-group-separator
              />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <a-card class="stat-card stat-card--categories" :bordered="false">
          <div class="stat-card-inner">
            <div class="stat-icon">
              <icon-folder />
            </div>
            <div class="stat-info">
              <a-statistic
                :title="$t('workplace.totalCategories')"
                :value="stats.categories"
                animation
                show-group-separator
              />
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="12" :sm="12" :md="8" :lg="4" :xl="4">
        <a-card class="stat-card stat-card--tags" :bordered="false">
          <div class="stat-card-inner">
            <div class="stat-icon">
              <icon-tags />
            </div>
            <div class="stat-info">
              <a-statistic
                :title="$t('workplace.totalTags')"
                :value="stats.tags"
                animation
                show-group-separator
              />
            </div>
          </div>
        </a-card>
      </a-col>
    </a-row>

    <!-- 快捷入口 + 图表区域 -->
    <a-row :gutter="16" class="content-row">
      <a-col :xs="24" :sm="24" :md="24" :lg="8" :xl="8">
        <!-- 快捷操作 -->
        <a-card
          class="section-card"
          :title="$t('workplace.quickActions')"
          :bordered="false"
        >
          <a-row :gutter="[12, 12]">
            <a-col v-for="action in quickActions" :key="action.key" :span="8">
              <div class="quick-action-item" @click="navigateTo(action.path)">
                <div
                  class="quick-action-icon"
                  :style="{
                    backgroundColor: action.bgColor,
                    color: action.iconColor,
                  }"
                >
                  <component :is="action.icon" :size="20" />
                </div>
                <span class="quick-action-label">{{ $t(action.label) }}</span>
              </div>
            </a-col>
          </a-row>
        </a-card>

        <!-- 公告列表 -->
        <a-card
          class="section-card section-card--large"
          :title="$t('workplace.latestAnnouncements')"
          :bordered="false"
        >
          <template #extra>
            <a-link
              :font-size="14"
              @click="navigateTo('/management/announcement')"
            >
              {{ $t('workplace.viewAll') }}
            </a-link>
          </template>
          <div class="announcement-list">
            <div
              v-for="item in recentAnnouncements"
              :key="item.id"
              class="announcement-item"
              @click="navigateTo('/management/announcement')"
            >
              <a-tooltip :content="getTypeLabel(item.type)">
                <span
                  class="announcement-dot"
                  :class="`announcement-dot--${item.type.toLowerCase()}`"
                ></span>
              </a-tooltip>
              <span class="announcement-title">{{ item.title }}</span>
              <span class="announcement-time">{{ item.time }}</span>
            </div>
          </div>
        </a-card>
      </a-col>

      <a-col :xs="24" :sm="24" :md="24" :lg="16" :xl="16">
        <!-- 最近帖子 -->
        <a-card
          class="section-card section-card--large"
          :title="$t('workplace.recentPosts')"
          :bordered="false"
        >
          <template #extra>
            <a-link :font-size="14" @click="navigateTo('/management/post')">
              {{ $t('workplace.viewAll') }}
            </a-link>
          </template>
          <a-table
            :data="recentPosts"
            :pagination="false"
            :bordered="false"
            :stripe="true"
            size="large"
          >
            <template #columns>
              <a-table-column
                :title="$t('workplace.postTitle')"
                data-index="title"
                :width="220"
                :ellipsis="true"
                :tooltip="true"
              />
              <a-table-column
                :title="$t('workplace.postAuthor')"
                data-index="authorName"
                :width="90"
              />
              <a-table-column :title="$t('workplace.postViews')" :width="75">
                <template #cell="{ record }">
                  <span class="view-count">{{ record.viewCount }}</span>
                </template>
              </a-table-column>
              <a-table-column :title="$t('workplace.postComments')" :width="75">
                <template #cell="{ record }">
                  <span class="comment-count">{{ record.commentCount }}</span>
                </template>
              </a-table-column>
              <a-table-column :title="$t('workplace.postStatus')" :width="120">
                <template #cell="{ record }">
                  <a-space :size="4">
                    <a-tag
                      v-if="record.isPinned === 'PINNED'"
                      color="red"
                      size="small"
                    >
                      {{ $t('workplace.pinned') }}
                    </a-tag>
                    <a-tag
                      v-if="record.isEssential === 'ESSENTIAL'"
                      color="arcoblue"
                      size="small"
                    >
                      {{ $t('workplace.essential') }}
                    </a-tag>
                  </a-space>
                </template>
              </a-table-column>
              <a-table-column
                :title="$t('workplace.postTime')"
                data-index="createdAt"
                :width="140"
                :ellipsis="false"
              />
            </template>
          </a-table>
        </a-card>

        <!-- 最近评论 -->
        <a-card
          class="section-card section-card--large"
          :title="$t('workplace.recentComments')"
          :bordered="false"
        >
          <template #extra>
            <a-link :font-size="14" @click="navigateTo('/management/comment')">
              {{ $t('workplace.viewAll') }}
            </a-link>
          </template>
          <a-table
            :data="recentComments"
            :pagination="false"
            :bordered="false"
            :stripe="true"
            size="large"
          >
            <template #columns>
              <a-table-column
                :title="$t('workplace.commentContent')"
                data-index="content"
                :width="240"
                :ellipsis="true"
                :tooltip="true"
              />
              <a-table-column
                :title="$t('workplace.commentUser')"
                data-index="authorName"
                :width="90"
              />
              <a-table-column
                :title="$t('workplace.commentPost')"
                data-index="postTitle"
                :ellipsis="true"
                :tooltip="true"
                :width="180"
              />
              <a-table-column
                :title="$t('workplace.commentTime')"
                data-index="createdAt"
                :width="140"
                :ellipsis="false"
              />
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script lang="ts" setup>
  import { computed, onMounted, reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store';
  import {
    queryDashboardStats,
    queryRecentAnnouncements,
    queryRecentPosts,
    queryRecentComments,
  } from '@/api/dashboard';
  import type { Announcement } from '@/api/announcement';
  import type { Post } from '@/api/post';
  import type { Comment } from '@/api/comment';
  import dayjs from 'dayjs';

  const router = useRouter();
  const userStore = useUserStore();

  const userInfo = computed(() => ({
    name: userStore.name || '',
    role: userStore.role || '',
  }));

  const roleLabel = computed(() => {
    const map: Record<string, string> = {
      SUPER_ADMIN: '超级管理员',
      ADMIN: '管理员',
      USER: '用户',
    };
    return map[userInfo.value.role] || '用户';
  });

  const roleColor = computed(() => {
    const map: Record<string, string> = {
      SUPER_ADMIN: '#FACC15',
      ADMIN: '#C084FC',
      USER: '#67E8F9',
    };
    return map[userInfo.value.role] || '#67E8F9';
  });

  const todayDate = computed(() => dayjs().format('YYYY-MM-DD'));

  const stats = reactive({
    users: 0,
    posts: 0,
    comments: 0,
    announcements: 0,
    categories: 0,
    tags: 0,
  });

  async function fetchStats() {
    try {
      const data = await queryDashboardStats();
      Object.assign(stats, data);
    } catch (e) {
      // 记录错误以便调试
      console.error('Failed to fetch dashboard stats:', e);
    }
  }

  const recentAnnouncements = ref<
    { id: number; title: string; type: string; time: string }[]
  >([]);

  async function fetchRecentAnnouncements() {
    try {
      const res = (await queryRecentAnnouncements({
        pageNumber: 1,
        pageSize: 5,
      })) as any;
      const records: Announcement[] = res.data?.records || [];
      recentAnnouncements.value = records.map((item) => ({
        id: item.id,
        title: item.title,
        type: item.type,
        time: item.createdAt,
      }));
    } catch (e) {
      // 记录错误以便调试
      console.error('Operation failed:', e);
    }
  }

  const recentPosts = ref<Post[]>([]);

  async function fetchRecentPosts() {
    try {
      const res = (await queryRecentPosts({
        pageNumber: 1,
        pageSize: 7,
      })) as any;
      recentPosts.value = res.data?.records || [];
    } catch (e) {
      // 记录错误以便调试
      console.error('Operation failed:', e);
    }
  }

  const recentComments = ref<
    {
      id: number;
      content: string;
      authorName: string;
      postTitle: string;
      createdAt: string;
    }[]
  >([]);

  async function fetchRecentComments() {
    try {
      const res = (await queryRecentComments({
        pageNumber: 1,
        pageSize: 5,
      })) as any;
      const records: Comment[] = res.data?.records || [];
      recentComments.value = records.map((item) => ({
        id: item.id,
        content: item.content,
        authorName: item.post?.authorName || '',
        postTitle: item.post?.title || '',
        createdAt: item.createdAt,
      }));
    } catch (e) {
      // 记录错误以便调试
      console.error('Operation failed:', e);
    }
  }

  onMounted(async () => {
    // 并行加载所有数据，提升性能
    await Promise.all([
      fetchStats(),
      fetchRecentAnnouncements(),
      fetchRecentPosts(),
      fetchRecentComments(),
    ]);
  });

  // 快捷操作
  const quickActions = [
    {
      key: 'user',
      label: 'workplace.action.user',
      icon: 'icon-user-group',
      bgColor: '#E8F4FF',
      iconColor: '#1677FF',
      path: '/management/user',
    },
    {
      key: 'post',
      label: 'workplace.action.post',
      icon: 'icon-file',
      bgColor: '#F0F9EB',
      iconColor: '#52C41A',
      path: '/management/post',
    },
    {
      key: 'comment',
      label: 'workplace.action.comment',
      icon: 'icon-message',
      bgColor: '#FFF7E6',
      iconColor: '#FA8C16',
      path: '/management/comment',
    },
    {
      key: 'announcement',
      label: 'workplace.action.announcement',
      icon: 'icon-notification',
      bgColor: '#FFF0F6',
      iconColor: '#EB2F96',
      path: '/management/announcement',
    },
    {
      key: 'category',
      label: 'workplace.action.category',
      icon: 'icon-folder',
      bgColor: '#F5F0FF',
      iconColor: '#722ED1',
      path: '/management/category',
    },
    {
      key: 'tag',
      label: 'workplace.action.tag',
      icon: 'icon-tags',
      bgColor: '#E6F7FF',
      iconColor: '#13C2C2',
      path: '/management/tag',
    },
    {
      key: 'accountDeletion',
      label: 'workplace.action.accountDeletion',
      icon: 'icon-delete',
      bgColor: '#FFEDED',
      iconColor: '#F5222D',
      path: '/management/account-deletion',
    },
    {
      key: 'searchIndex',
      label: 'workplace.action.searchIndex',
      icon: 'icon-search',
      bgColor: '#FFF4E6',
      iconColor: '#FA8C16',
      path: '/management/search-index',
    },
  ];

  function navigateTo(path: string) {
    router.push(path);
  }

  function getTypeLabel(type: string) {
    const map: Record<string, string> = {
      INFO: '通知',
      WARNING: '警告',
      ERROR: '重要',
    };
    return map[type] || type;
  }

  defineOptions({
    name: 'Dashboard',
  });
</script>

<style lang="less" scoped>
  .workplace {
    padding: 16px 20px;
    background-color: var(--color-fill-2);
    min-height: 100%;
  }

  // 欢迎横幅
  .welcome-banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    margin-bottom: 16px;
    background: linear-gradient(135deg, #165dff 0%, #4096ff 50%, #69b1ff 100%);
    border-radius: 8px;
    color: #fff;

    .welcome-title {
      margin: 0 0 4px 0 !important;
      color: #fff;
    }

    .welcome-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
    }

    .welcome-meta {
      display: flex;
      align-items: center;
      gap: 24px;

      .meta-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        .meta-label {
          color: rgba(255, 255, 255, 0.65);
          font-size: 12px;
        }

        .meta-value {
          color: rgba(255, 255, 255, 0.95);
          font-size: 14px;
          font-weight: 500;
          line-height: 24px;
        }

        .role-tag {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 2px 12px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          line-height: 20px;
          color: #fff;
          background: rgba(255, 255, 255, 0.18);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.25);

          .role-dot {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            flex-shrink: 0;
          }
        }
      }
    }
  }

  // 统计卡片行
  .stat-row {
    margin-bottom: 16px;
  }

  .stat-card {
    margin-bottom: 16px;
    border-radius: 8px;
    transition: all 0.2s ease;
    cursor: default;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }

    .stat-card-inner {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .stat-icon {
      width: 44px;
      height: 44px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      flex-shrink: 0;
    }

    // 各卡片配色
    &--users .stat-icon {
      background-color: #e8f3ff;
      color: #165dff;
    }
    &--posts .stat-icon {
      background-color: #e8ffea;
      color: #00b42a;
    }
    &--comments .stat-icon {
      background-color: #fff3e8;
      color: #ff7d00;
    }
    &--announcements .stat-icon {
      background-color: #ffe8f2;
      color: #f5319d;
    }
    &--categories .stat-icon {
      background-color: #f3e8ff;
      color: #722ed1;
    }
    &--tags .stat-icon {
      background-color: #e8f9ff;
      color: #14c9c9;
    }

    :deep(.arco-statistic) {
      .arco-statistic-title {
        font-size: 12px;
        color: var(--color-text-3);
        margin-bottom: 2px;
      }
      .arco-statistic-value {
        font-size: 22px;
        font-weight: 600;
      }
    }
  }

  // 内容区域
  .content-row {
    .section-card {
      margin-bottom: 16px;
      border-radius: 8px;

      :deep(.arco-card-header) {
        border-bottom: 1px solid var(--color-border-2);
      }
    }
  }

  // 快捷操作
  .quick-action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 8px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      background-color: var(--color-fill-2);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

      .quick-action-icon {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .quick-action-label {
        color: rgb(var(--primary-6));
        font-weight: 500;
      }
    }

    &:active {
      transform: translateY(0);
    }

    .quick-action-icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .quick-action-label {
      font-size: 13px;
      color: var(--color-text-2);
      text-align: center;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      line-height: 1.3;
    }
  }

  // 公告
  .announcement-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .announcement-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--color-fill-2);

      .announcement-title {
        color: rgb(var(--primary-6));
      }
    }
  }

  .announcement-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;

    &--info {
      background-color: #1677ff;
    }

    &--warning {
      background-color: #ff7d00;
    }

    &--error {
      background-color: #f53f3f;
    }
  }

  .announcement-title {
    flex: 1;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-text-1);
    transition: color 0.2s ease;
  }

  .announcement-time {
    font-size: 13px;
    color: var(--color-text-4);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
    flex-shrink: 0;
  }

  // 大尺寸卡片
  .section-card--large {
    :deep(.arco-card-header-title) {
      font-size: 16px;
      font-weight: 600;
    }

    :deep(.arco-card-body) {
      padding: 20px;
    }

    // 表格行悬浮样式（最近帖子、最近评论）
    :deep(.arco-table-tr) {
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: var(--color-fill-2);
      }

      &:active {
        background-color: var(--color-fill-3);
      }
    }
  }

  // 表格
  .view-count {
    color: var(--color-text-3);
    font-size: 14px;
    font-weight: 500;
  }

  .comment-count {
    color: rgb(var(--primary-6));
    font-weight: 600;
    font-size: 14px;
  }

  :deep(.arco-table) {
    .arco-table-th {
      background-color: var(--color-fill-1);
      font-weight: 600;
    }
  }

  // 响应式
  @media (max-width: 768px) {
    .workplace {
      padding: 12px;
    }

    .welcome-banner {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .welcome-meta {
        width: 100%;
      }
    }

    .stat-card .stat-card-inner {
      gap: 8px;
    }
  }
</style>
