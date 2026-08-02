<template>
  <div class="container">
    <a-card class="general-card" title="标签管理">
      <template #extra>
        <a-space>
          <a-select
            v-model="filterCategoryId"
            placeholder="按分类筛选"
            allow-clear
            style="width: 220px"
            @change="handleFilterChange"
          >
            <a-optgroup
              v-for="parent in categoryTree"
              :key="parent.id"
              :label="parent.name"
            >
              <a-option
                v-for="child in parent.children"
                :key="child.id"
                :value="child.id"
              >
                {{ parent.name }} / {{ child.name }}
              </a-option>
            </a-optgroup>
          </a-select>
          <a-button type="primary" @click="handleCreate">
            <template #icon><icon-plus /></template>
            新建标签
          </a-button>
        </a-space>
      </template>
      <a-table
        :columns="columns"
        :data="tableData"
        :loading="loading"
        :pagination="pagination"
        :stripe="true"
        @page-change="onPageChange"
      >
        <template #category="{ record }">
          <span v-if="getCategoryDisplayName(record.categoryId)">
            {{ getCategoryDisplayName(record.categoryId) }}
          </span>
          <span v-else class="text-gray">未分类</span>
        </template>
        <template #status="{ record }">
          <a-tag v-if="record.status === 'ACTIVE'" color="green">启用</a-tag>
          <a-tag v-else-if="record.status === 'INACTIVE'" color="red"
            >禁用</a-tag
          >
          <a-tag v-else color="gray">待删除</a-tag>
        </template>
        <template #createdAt="{ record }">
          {{ formatDate(record.createdAt) }}
        </template>
        <template #operations="{ record }">
          <a-space>
            <a-button type="text" size="small" @click="handleEdit(record)">
              编辑
            </a-button>
            <a-popconfirm
              content="确定要删除该标签吗？"
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
      :title="isEdit ? '编辑标签' : '新建标签'"
      @ok="handleSubmit"
      @cancel="resetForm"
    >
      <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
        <a-form-item field="name" label="标签名称">
          <a-input v-model="formData.name" placeholder="请输入标签名称" />
        </a-form-item>
        <a-form-item field="categoryId" label="关联分类">
          <a-select
            v-model="formData.categoryId"
            placeholder="请选择关联分类"
            allow-clear
          >
            <a-optgroup
              v-for="parent in categoryTree"
              :key="parent.id"
              :label="parent.name"
            >
              <a-option
                v-for="child in parent.children"
                :key="child.id"
                :value="child.id"
              >
                {{ parent.name }} / {{ child.name }}
              </a-option>
            </a-optgroup>
          </a-select>
        </a-form-item>
        <a-form-item field="status" label="状态">
          <a-select v-model="formData.status" placeholder="请选择状态">
            <a-option value="ACTIVE">启用</a-option>
            <a-option value="INACTIVE">禁用</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { Message } from "@arco-design/web-vue";
import type { TableColumnData } from "@arco-design/web-vue";
import {
  getTagList,
  createTag,
  updateTag,
  deleteTag,
  type Tag,
  type TagStatus,
} from "@/api/tag";
import { getCategoryTree, type Category } from "@/api/category";
import { formatDate } from "@/utils/format";

const loading = ref(false);
const tableData = ref<Tag[]>([]);
const categoryTree = ref<Category[]>([]);
const filterCategoryId = ref<number | undefined>(undefined);
const allTags = ref<Tag[]>([]);

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const categoryMap = computed(() => {
  const map = new Map<number, string>();
  categoryTree.value.forEach((parent) => {
    if (parent.children) {
      parent.children.forEach((child) => {
        map.set(child.id, `${parent.name} / ${child.name}`);
      });
    }
  });
  return map;
});

const getCategoryDisplayName = (categoryId: number | undefined) => {
  if (!categoryId) return "";
  return categoryMap.value.get(categoryId) || "";
};

const formVisible = ref(false);
const isEdit = ref(false);
const currentId = ref<number | null>(null);
const formRef = ref();

const formData = reactive({
  name: "",
  categoryId: undefined as number | undefined,
  status: "ACTIVE" as TagStatus,
});

const rules = {
  name: [{ required: true, message: "请输入标签名称" }],
};

const columns: TableColumnData[] = [
  { title: "ID", dataIndex: "id", width: 70 },
  { title: "标签名称", dataIndex: "name", width: 140 },
  { title: "所属分类", slotName: "category", width: 200 },
  { title: "帖子数", dataIndex: "postCount", width: 90 },
  { title: "状态", slotName: "status", width: 90 },
  { title: "创建时间", slotName: "createdAt", width: 180 },
  { title: "操作", slotName: "operations", width: 120 },
];

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getTagList();
    allTags.value = res || [];
    applyFilter();
  } catch (error) {
    Message.error("获取标签列表失败");
  } finally {
    loading.value = false;
  }
};

const applyFilter = () => {
  if (filterCategoryId.value) {
    tableData.value = allTags.value
      .filter((tag) => tag.categoryId === filterCategoryId.value)
      .sort((a, b) => a.id - b.id);
  } else {
    tableData.value = [...allTags.value].sort((a, b) => a.id - b.id);
  }
  pagination.total = tableData.value.length;
};

const handleFilterChange = () => {
  pagination.current = 1;
  applyFilter();
};

const onPageChange = (page: number) => {
  pagination.current = page;
};

const fetchCategoryList = async () => {
  try {
    const res = await getCategoryTree();
    categoryTree.value = res || [];
  } catch (error) {
    //
  }
};

const handleCreate = () => {
  isEdit.value = false;
  currentId.value = null;
  formVisible.value = true;
};

const handleEdit = (record: Tag) => {
  isEdit.value = true;
  currentId.value = record.id;
  formData.name = record.name;
  formData.categoryId = record.categoryId || undefined;
  formData.status = record.status;
  formVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    if (isEdit.value && currentId.value) {
      await updateTag(currentId.value, formData);
      Message.success("更新成功");
    } else {
      await createTag(formData);
      Message.success("创建成功");
    }
    formVisible.value = false;
    resetForm();
    fetchData();
  } catch (error) {
    Message.error("操作失败");
  }
};

const resetForm = () => {
  formData.name = "";
  formData.categoryId = undefined;
  formData.status = "ACTIVE";
  formRef.value?.resetFields();
};

const handleDelete = async (id: number) => {
  try {
    await deleteTag(id);
    Message.success("删除成功");
    fetchData();
  } catch (error) {
    Message.error("删除失败");
  }
};

onMounted(() => {
  fetchData();
  fetchCategoryList();
});
</script>

<script lang="ts">
export default {
  name: "TagManagement",
};
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;
}

.general-card {
  min-height: 100%;
}

.text-gray {
  color: var(--color-text-3);
}
</style>
