<template>
  <div class="container">
    <a-card class="general-card" title="帖子管理" :bordered="false">
      <template #extra>
        <a-space :size="12" wrap>
          <a-select
            v-model="filterCategoryId"
            placeholder="全部分类"
            allow-clear
            style="width: 160px"
            @change="handleSearch"
          >
            <a-option
              v-for="cat in flatCategories"
              :key="cat.id"
              :value="cat.id"
              :label="cat.label"
            />
          </a-select>
          <a-select
            v-model="filterStatus"
            placeholder="全部状态"
            allow-clear
            style="width: 120px"
            @change="handleSearch"
          >
            <a-option value="PINNED" label="置顶" />
            <a-option value="ESSENTIAL" label="精华" />
            <a-option value="NORMAL" label="正常" />
          </a-select>
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :stripe="true"
        hoverable
        :virtual-list-props="
          pagination.pageSize >= 50 ? { height: 600, threshold: 50 } : undefined
        "
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #titleCell="{ record }">
          <span class="title">{{ record.title }}</span>
          <a-tag
            v-if="record.isPinned === 'PINNED'"
            size="small"
            color="arcoblue"
            class="tag"
          >
            置顶
          </a-tag>
          <a-tag
            v-if="record.isEssential === 'ESSENTIAL'"
            size="small"
            color="orangered"
            class="tag"
          >
            精华
          </a-tag>
        </template>

        <template #user="{ record }">
          <a-space :size="6">
            <a-avatar :size="24">
              <img
                v-if="record.authorAvatar"
                :src="record.authorAvatar"
                alt=""
              />
              <span v-else>{{
                record.authorName?.charAt(0)?.toUpperCase()
              }}</span>
            </a-avatar>
            <span class="name">{{ record.authorName }}</span>
          </a-space>
        </template>

        <template #category="{ record }">
          <div class="meta-cell">
            <a-tag size="small" color="arcoblue">
              {{ record.parentCategoryName || record.categoryName || '-' }}
            </a-tag>
            <template v-if="record.tagNames && record.tagNames.length > 0">
              <a-tooltip v-if="record.tagNames.length > 2" position="top">
                <a-tag size="small" color="green">
                  {{ record.tagNames.slice(0, 2).join('、') }}...
                </a-tag>
                <template #content>
                  <span>{{ record.tagNames.join('、') }}</span>
                </template>
              </a-tooltip>
              <a-tag v-else size="small" color="green">
                {{ record.tagNames.join('、') }}
              </a-tag>
            </template>
          </div>
        </template>

        <template #stats="{ record }">
          <a-space :size="6" class="stats-wrap">
            <span class="stat-pill"> <icon-eye /> {{ record.viewCount }} </span>
            <span class="stat-pill like">
              <icon-heart-fill /> {{ record.likeCount }}
            </span>
            <span class="stat-pill comment">
              <icon-message /> {{ record.commentCount }}
            </span>
            <span class="stat-pill star">
              <icon-star-fill /> {{ record.favoriteCount || 0 }}
            </span>
          </a-space>
        </template>

        <template #operations="{ record }">
          <a-space :size="4">
            <a-button type="text" size="mini" @click="viewPost(record)">
              查看
            </a-button>
            <a-button
              type="text"
              size="mini"
              @click="handleTogglePinned(record)"
            >
              {{ record.isPinned === 'PINNED' ? '取消置顶' : '置顶' }}
            </a-button>
            <a-button
              type="text"
              size="mini"
              @click="handleToggleEssential(record)"
            >
              {{ record.isEssential === 'ESSENTIAL' ? '取消精华' : '精华' }}
            </a-button>
            <a-popconfirm
              content="确定删除该帖子？"
              @ok="handleDelete(record.id)"
            >
              <a-button type="text" size="mini" status="danger">
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:visible="detailVisible"
      title="帖子详情"
      :footer="false"
      width="640px"
      unmount-on-close
      :loading="detailLoading"
    >
      <a-descriptions :column="2" bordered :label-width="80">
        <a-descriptions-item label="ID">{{
          currentPost?.id
        }}</a-descriptions-item>
        <a-descriptions-item label="作者">{{
          currentPost?.authorName
        }}</a-descriptions-item>
        <a-descriptions-item label="分类">
          <a-tag v-if="currentPost?.parentCategoryName" color="arcoblue">
            {{ currentPost?.parentCategoryName }}
          </a-tag>
          <a-tag color="cyan">{{ currentPost?.categoryName || '-' }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="时间">{{
          formatDate(currentPost?.createdAt)
        }}</a-descriptions-item>
        <a-descriptions-item label="浏览">{{
          currentPost?.viewCount
        }}</a-descriptions-item>
        <a-descriptions-item label="点赞">{{
          currentPost?.likeCount
        }}</a-descriptions-item>
        <a-descriptions-item label="评论">{{
          currentPost?.commentCount
        }}</a-descriptions-item>
        <a-descriptions-item label="收藏">{{
          currentPost?.favoriteCount || 0
        }}</a-descriptions-item>
        <a-descriptions-item label="标题" :span="2">
          <strong>{{ currentPost?.title }}</strong>
        </a-descriptions-item>
        <a-descriptions-item
          v-if="currentPost?.tagNames && currentPost.tagNames.length > 0"
          label="标签"
          :span="2"
        >
          <a-tag v-for="t in currentPost.tagNames" :key="t" color="green">{{
            t
          }}</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="内容" :span="2">
          <div class="post-content">
            <MarkdownRenderer :content="currentPost?.content || ''" />
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import type { TableColumnData, TableData } from '@arco-design/web-vue';
  import {
    getPostList,
    getPostDetail,
    deletePost,
    setPostPinned,
    setPostEssential,
    type Post,
  } from '@/api/post';
  import { getCategoryTree, type Category } from '@/api/category';
  import { MarkdownRenderer } from '@/components';
  import dayjs from 'dayjs';
  import { formatDate } from '@/utils/format';
  import { useTableData as useTableManagement } from '@/hooks/use-table-data';

  const detailVisible = ref(false);
  const detailLoading = ref(false);
  const currentPost = ref<Post | null>(null);

  // 筛选条件
  const filterCategoryId = ref<number | undefined>(undefined);
  const filterStatus = ref<string | undefined>(undefined);
  const categoryTree = ref<Category[]>([]);

  // 使用可复用的表格管理 composable
  const {
    tableData,
    loading,
    pagination,
    fetchData,
    onPageChange,
    onPageSizeChange,
    refresh,
  } = useTableManagement<Post>({
    fetchFn: async () => {
      let pinnedFilter: boolean | undefined;
      let essentialFilter: boolean | undefined;
      if (filterStatus.value === 'PINNED') {
        pinnedFilter = true;
      } else if (filterStatus.value === 'NORMAL') {
        pinnedFilter = false;
      }
      if (filterStatus.value === 'ESSENTIAL') {
        essentialFilter = true;
      } else if (filterStatus.value === 'NORMAL') {
        essentialFilter = false;
      }

      const res = await getPostList({
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
        categoryId: filterCategoryId.value,
        isPinned: pinnedFilter,
        isEssential: essentialFilter,
      });

      // 客户端排序
      tableData.value = (res.records || []).sort((a, b) => a.id - b.id);
      return res;
    },
    pageSize: 10,
    immediate: false,
  });

  // 扁平化分类树用于下拉选择
  const flatCategories = computed(() => {
    const result: { id: number; label: string }[] = [];
    const flatten = (items: Category[], prefix = '') => {
      items.forEach((item) => {
        const label = prefix ? `${prefix} / ${item.name}` : item.name;
        result.push({ id: item.id, label });
        if (item.children?.length) flatten(item.children, label);
      });
    };
    flatten(categoryTree.value);
    return result;
  });

  const columns: TableColumnData[] = [
    { title: 'ID', dataIndex: 'id', width: 70, align: 'center' },
    {
      title: '标题',
      slotName: 'titleCell',
      width: 240,
      ellipsis: true,
      tooltip: true,
    },
    { title: '作者', slotName: 'user', width: 130 },
    { title: '分类 / 标签', slotName: 'category', width: 180 },
    {
      title: '浏览 / 点赞 / 评论 / 收藏',
      slotName: 'stats',
      width: 230,
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'createdAt',
      width: 165,
      render: ({ record }: { record: TableData }) =>
        formatDate((record as Post).createdAt),
    },
    {
      title: '操作',
      slotName: 'operations',
      width: 320,
      align: 'center',
      fixed: 'right',
    },
  ];

  const fetchCategories = async () => {
    try {
      const res = await getCategoryTree();
      categoryTree.value = res || [];
    } catch {
      categoryTree.value = [];
    }
  };

  const handleSearch = () => {
    refresh();
  };

  const viewPost = async (post: Post) => {
    detailLoading.value = true;
    detailVisible.value = true;
    try {
      const res = await getPostDetail(post.id);
      currentPost.value = res;
    } catch {
      Message.error('获取详情失败');
      detailVisible.value = false;
    } finally {
      detailLoading.value = false;
    }
  };

  const handleTogglePinned = async (post: Post) => {
    try {
      await setPostPinned(post.id, post.isPinned !== 'PINNED');
      Message.success('操作成功');
      fetchData();
    } catch {
      Message.error('操作失败');
    }
  };

  const handleToggleEssential = async (post: Post) => {
    try {
      await setPostEssential(post.id, post.isEssential !== 'ESSENTIAL');
      Message.success('操作成功');
      fetchData();
    } catch {
      Message.error('操作失败');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      Message.success('已删除');
      fetchData();
    } catch {
      Message.error('删除失败');
    }
  };

  onMounted(() => {
    fetchCategories();
    fetchData();
  });

  defineOptions({
    name: 'PostManagement',
  });
</script>

<style lang="less" scoped>
  .container {
    min-height: 100%;
    padding: 20px;
    background: var(--color-bg-2);
  }

  .general-card {
    border-radius: 8px;

    :deep(.arco-card-header) {
      border-bottom: none;
    }
  }

  .title {
    font-weight: 500;
  }

  .tag {
    flex-shrink: 0;
    margin-left: 6px;
    font-size: 11px;
  }

  .name {
    max-width: 70px;
    overflow: hidden;
    font-size: 13px;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .meta-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    align-items: center;
  }

  .stats-wrap {
    display: flex;
    justify-content: center;
  }

  .stat-pill {
    display: inline-flex;
    gap: 3px;
    align-items: center;
    padding: 2px 8px;
    color: var(--color-text-3);
    font-size: 12px;
    line-height: 20px;
    background: var(--color-fill-1);
    border-radius: 10px;

    &.like {
      color: rgb(var(--red-5));
      background: rgba(var(--red-1), 0.5);
    }

    &.comment {
      color: rgb(var(--arcoblue-5));
      background: rgba(var(--arcoblue-1), 0.5);
    }

    &.star {
      color: rgb(var(--gold-6));
      background: rgba(var(--gold-1), 0.6);
    }
  }

  .post-content {
    max-height: 400px;
    padding: 12px 16px;
    overflow-y: auto;
    font-size: 13px;
    line-height: 1.8;
    background: var(--color-fill-1);
    border-radius: 6px;
  }
</style>
