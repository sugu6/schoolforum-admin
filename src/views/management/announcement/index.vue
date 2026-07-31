<template>
  <div class="container">
    <a-card class="general-card" title="公告管理">
      <template #extra>
        <a-button type="primary" @click="handleCreate">
          <template #icon><icon-plus /></template>
          新建公告
        </a-button>
      </template>
      <a-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :stripe="true"
        @page-change="onPageChange"
      >
        <template #type="{ record }">
          <a-tag v-if="record.type === 'INFO'" color="blue"> 通知 </a-tag>
          <a-tag v-else-if="record.type === 'WARNING'" color="orange">
            警告
          </a-tag>
          <a-tag v-else-if="record.type === 'ERROR'" color="red"> 错误 </a-tag>
        </template>
        <template #status="{ record }">
          <a-tag v-if="record.status === 'PUBLISHED'" color="green">
            已发布
          </a-tag>
          <a-tag v-else-if="record.status === 'DRAFT'" color="gray">
            草稿
          </a-tag>
          <a-tag v-else-if="record.status === 'OFFLINE'" color="red">
            已下架
          </a-tag>
        </template>
        <template #isTop="{ record }">
          <a-tag v-if="record.isTop === 1" color="arcoblue">已置顶</a-tag>
          <a-tag v-else color="gray">未置顶</a-tag>
        </template>
        <template #createdAt="{ record }">
          {{ formatDate(record.createdAt) }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button
              v-if="record.status === 'DRAFT' || record.status === 'OFFLINE'"
              type="text"
              size="small"
              @click="handlePublish(record.id)"
            >
              发布
            </a-button>
            <a-button
              v-if="record.status === 'PUBLISHED'"
              type="text"
              size="small"
              @click="handleOffline(record.id)"
            >
              下架
            </a-button>
            <a-button
              v-if="record.status === 'PUBLISHED'"
              type="text"
              size="small"
              @click="handleToggleTop(record.id)"
            >
              {{ record.isTop === 1 ? '取消置顶' : '置顶' }}
            </a-button>
            <a-button type="text" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-popconfirm
              content="确定要删除该公告吗？"
              @ok="handleDelete(record.id)"
            >
              <a-button type="text" size="small" status="danger">
                删除
              </a-button>
            </a-popconfirm>
          </a-space>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:visible="formVisible"
      :title="isEdit ? '编辑公告' : '新建公告'"
      width="700px"
      @ok="handleSubmit"
      @cancel="resetForm"
    >
      <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
        <a-form-item field="title" label="标题">
          <a-input v-model="formData.title" placeholder="请输入公告标题" />
        </a-form-item>
        <a-form-item field="type" label="类型">
          <a-select v-model="formData.type" placeholder="请选择公告类型">
            <a-option value="INFO">通知</a-option>
            <a-option value="WARNING">警告</a-option>
            <a-option value="ERROR">错误</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="content" label="内容">
          <a-tabs type="card" size="small">
            <a-tab-pane key="edit" title="编辑">
              <a-textarea
                v-model="formData.content"
                placeholder="请输入公告内容（支持Markdown格式）"
                :auto-size="{ minRows: 6, maxRows: 15 }"
              />
            </a-tab-pane>
            <a-tab-pane key="preview" title="预览">
              <div class="markdown-preview">
                <MarkdownRenderer
                  v-if="formData.content"
                  :content="formData.content"
                />
                <span v-else class="preview-empty">暂无内容</span>
              </div>
            </a-tab-pane>
          </a-tabs>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import type { TableColumnData } from '@arco-design/web-vue';
  import {
    getAnnouncementList,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    publishAnnouncement,
    offlineAnnouncement,
    toggleAnnouncementTop,
    type Announcement,
    type AnnouncementType,
  } from '@/api/announcement';
  import { MarkdownRenderer } from '@/components';
  import { formatDate } from '@/utils/format';

  const loading = ref(false);
  const tableData = ref<Announcement[]>([]);
  const formVisible = ref(false);
  const isEdit = ref(false);
  const currentId = ref<number | null>(null);
  const formRef = ref();

  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const formData = reactive({
    title: '',
    type: 'INFO' as AnnouncementType,
    content: '',
  });

  const rules = {
    title: [{ required: true, message: '请输入公告标题' }],
    type: [{ required: true, message: '请选择公告类型' }],
    content: [{ required: true, message: '请输入公告内容' }],
  };

  const columns: TableColumnData[] = [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '标题', dataIndex: 'title' },
    { title: '类型', slotName: 'type', width: 100 },
    { title: '状态', slotName: 'status', width: 100 },
    { title: '置顶', slotName: 'isTop', width: 80 },
    { title: '创建时间', slotName: 'createdAt', width: 180 },
    { title: '操作', slotName: 'operations', width: 280 },
  ];

  const fetchData = async () => {
    loading.value = true;
    try {
      const res = await getAnnouncementList({
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      });
      tableData.value = res.records || [];
      pagination.total = res.totalRow || 0;
    } catch (error) {
      Message.error('获取公告列表失败');
    } finally {
      loading.value = false;
    }
  };

  const onPageChange = (page: number) => {
    pagination.current = page;
    fetchData();
  };

  const handleCreate = () => {
    isEdit.value = false;
    currentId.value = null;
    formVisible.value = true;
  };

  const handleEdit = (record: Announcement) => {
    isEdit.value = true;
    currentId.value = record.id;
    formData.title = record.title;
    formData.type = record.type;
    formData.content = record.content;
    formVisible.value = true;
  };

  const handleSubmit = async () => {
    try {
      await formRef.value?.validate();
      if (isEdit.value && currentId.value) {
        await updateAnnouncement(currentId.value, formData);
        Message.success('更新成功');
      } else {
        await createAnnouncement(formData);
        Message.success('创建成功');
      }
      formVisible.value = false;
      resetForm();
      fetchData();
    } catch (error) {
      Message.error('操作失败');
    }
  };

  const resetForm = () => {
    formData.title = '';
    formData.type = 'INFO';
    formData.content = '';
    formRef.value?.resetFields();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAnnouncement(id);
      Message.success('删除成功');
      fetchData();
    } catch (error) {
      Message.error('删除失败');
    }
  };

  const handlePublish = async (id: number) => {
    try {
      await publishAnnouncement(id);
      Message.success('发布成功');
      fetchData();
    } catch (error) {
      Message.error('发布失败');
    }
  };

  const handleOffline = async (id: number) => {
    try {
      await offlineAnnouncement(id);
      Message.success('下架成功');
      fetchData();
    } catch (error) {
      Message.error('下架失败');
    }
  };

  const handleToggleTop = async (id: number) => {
    try {
      await toggleAnnouncementTop(id);
      Message.success('操作成功');
      fetchData();
    } catch (error) {
      Message.error('操作失败');
    }
  };

  onMounted(() => {
    fetchData();
  });
</script>

<script lang="ts">
  export default {
    name: 'AnnouncementManagement',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 16px;
  }
  .general-card {
    min-height: 100%;
  }

  .markdown-preview {
    min-height: 120px;
    max-height: 400px;
    overflow-y: auto;
    padding: 12px 16px;
    background: var(--color-fill-1);
    border-radius: 6px;
    border: 1px solid var(--color-border-2);
    font-size: 13px;
    line-height: 1.8;

    .preview-empty {
      color: var(--color-text-3);
      font-style: italic;
    }
  }
</style>
