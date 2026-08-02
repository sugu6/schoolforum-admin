<template>
  <div class="container">
    <a-card class="general-card" title="评论管理" :bordered="false">
      <a-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :stripe="true"
        hoverable
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #author="{ record }">
          <span>{{ record.authorId }}</span>
        </template>

        <template #post="{ record }">
          <span>{{ record.postId }}</span>
        </template>

        <template #content="{ record }">
          <a-tooltip :content="record.content" position="top">
            <span class="content-text">{{ record.content }}</span>
          </a-tooltip>
        </template>

        <template #likeCount="{ record }">
          <span class="stat-pill like">
            <icon-heart-fill /> {{ record.likeCount }}
          </span>
        </template>

        <template #isDeleted="{ record }">
          <a-tag v-if="record.isDeleted === 1" color="red" size="small">
            已删除
          </a-tag>
          <a-tag v-else color="green" size="small"> 正常 </a-tag>
        </template>

        <template #createdAt="{ record }">
          {{ formatDate(record.createdAt) }}
        </template>

        <template #operations="{ record }">
          <a-space :size="4">
            <a-button type="text" size="mini" @click="viewComment(record)">
              查看
            </a-button>
            <a-popconfirm
              content="确定要删除该评论吗？"
              @ok="handleDelete(record.id)"
            >
              <a-button
                type="text"
                size="mini"
                status="danger"
                :disabled="record.isDeleted === 1"
              >
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:visible="detailVisible"
      title="评论详情"
      :footer="false"
      width="640px"
      unmount-on-close
      :loading="detailLoading"
    >
      <a-descriptions :column="2" bordered :label-width="80">
        <a-descriptions-item label="评论ID">{{
          currentComment?.id
        }}</a-descriptions-item>
        <a-descriptions-item label="评论者ID">
          {{ currentComment?.authorId }}
        </a-descriptions-item>
        <a-descriptions-item label="帖子ID">
          {{ currentComment?.postId }}
        </a-descriptions-item>
        <a-descriptions-item
          v-if="currentComment?.parent"
          label="父评论"
          :span="2"
        >
          <div class="parent-comment">
            <span class="parent-author"
              >用户 #{{ currentComment.parent.authorId }}：</span
            >
            <MarkdownRenderer :content="currentComment.parent.content || ''" />
          </div>
        </a-descriptions-item>
        <a-descriptions-item label="点赞数">{{
          currentComment?.likeCount
        }}</a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag
            v-if="currentComment?.isDeleted === 1"
            color="red"
            size="small"
          >
            已删除
          </a-tag>
          <a-tag v-else color="green" size="small"> 正常 </a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="创建时间">{{
          formatDate(currentComment?.createdAt)
        }}</a-descriptions-item>
        <a-descriptions-item label="更新时间">{{
          formatDate(currentComment?.updatedAt)
        }}</a-descriptions-item>
        <a-descriptions-item label="评论内容" :span="2">
          <div class="comment-content">
            <MarkdownRenderer :content="currentComment?.content || ''" />
          </div>
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Message } from "@arco-design/web-vue";
import type { TableColumnData } from "@arco-design/web-vue";
import {
  getCommentList,
  getCommentDetail,
  deleteComment,
  type Comment,
} from "@/api/comment";
import { MarkdownRenderer } from "@/components";
import { formatDate } from "@/utils/format";
import { useTableData } from "@/hooks/use-table-data";

const detailVisible = ref(false);
const detailLoading = ref(false);
const currentComment = ref<Comment | null>(null);

// 使用可复用的表格数据 composable
const {
  tableData,
  loading,
  pagination,
  fetchData,
  onPageChange,
  onPageSizeChange,
} = useTableData<Comment>({
  fetchFn: async () => {
    const res = await getCommentList({
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
    });
    return res;
  },
  pageSize: 10,
  immediate: false,
});

const columns: TableColumnData[] = [
  { title: "ID", dataIndex: "id", width: 70, align: "center" },
  { title: "评论者ID", slotName: "author", width: 120 },
  {
    title: "帖子ID",
    slotName: "post",
    width: 120,
  },
  {
    title: "评论内容",
    slotName: "content",
    width: 200,
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "点赞",
    slotName: "likeCount",
    width: 80,
    align: "center",
  },
  {
    title: "状态",
    slotName: "isDeleted",
    width: 90,
    align: "center",
  },
  {
    title: "创建时间",
    slotName: "createdAt",
    width: 170,
  },
  {
    title: "操作",
    slotName: "operations",
    width: 140,
    align: "center",
    fixed: "right",
  },
];

const viewComment = async (comment: Comment) => {
  detailLoading.value = true;
  detailVisible.value = true;
  try {
    const res = await getCommentDetail(comment.id);
    currentComment.value = res;
  } catch {
    Message.error("获取评论详情失败");
    detailVisible.value = false;
  } finally {
    detailLoading.value = false;
  }
};

const handleDelete = async (id: number) => {
  try {
    await deleteComment(id);
    Message.success("已删除");
    fetchData();
  } catch {
    Message.error("删除失败");
  }
};

onMounted(() => {
  fetchData();
});

defineOptions({
  name: "CommentManagement",
});
</script>

<style lang="scss" scoped>
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

.author-id {
  color: rgb(var(--arcoblue-6));
  font-size: 13px;
}

.post-link {
  font-size: 13px;
}

.content-text {
  display: inline-block;
  max-width: 180px;
  overflow: hidden;
  font-size: 13px;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.stat-pill {
  display: inline-flex;
  gap: 3px;
  align-items: center;
  padding: 2px 8px;
  font-size: 12px;
  line-height: 20px;
  border-radius: 10px;

  &.like {
    color: rgb(var(--red-5));
    background: rgba(var(--red-1), 0.5);
  }
}

.parent-comment {
  max-height: 120px;
  padding: 8px 12px;
  overflow-y: auto;
  color: var(--color-text-2);
  font-size: 13px;
  line-height: 1.7;
  background: var(--color-fill-1);
  border-radius: 6px;

  .parent-author {
    margin-right: 4px;
    color: rgb(var(--arcoblue-6));
    font-weight: 500;
  }
}

.comment-content {
  max-height: 300px;
  padding: 12px 16px;
  overflow-y: auto;
  font-size: 13px;
  line-height: 1.8;
  background: var(--color-fill-1);
  border-radius: 6px;
}
</style>
