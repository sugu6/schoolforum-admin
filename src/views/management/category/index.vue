<template>
  <div class="container">
    <a-card class="general-card" title="分类管理">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleCreate(1)">
            <template #icon><icon-plus /></template>
            新建一级分类
          </a-button>
          <a-button @click="handleCreate(2)">
            <template #icon><icon-plus /></template>
            新建二级分类
          </a-button>
        </a-space>
      </template>
      <a-table
        :columns="columns"
        :data="treeData"
        :loading="loading"
        :pagination="pagination"
        :stripe="true"
        row-key="id"
        :default-expand-all-rows="true"
        @page-change="onPageChange"
      >
        <template #name="{ record }">
          {{ record.name }}
        </template>
        <template #level="{ record }">
          <a-tag v-if="record.level === 1" color="blue" size="small"
            >一级</a-tag
          >
          <a-tag v-else-if="record.level === 2" color="cyan" size="small"
            >二级</a-tag
          >
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
              :content="
                record.children && record.children.length > 0
                  ? '该分类下存在子分类，确定要删除吗？'
                  : '确定要删除该分类吗？'
              "
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
      :title="modalTitle"
      @ok="handleSubmit"
      @cancel="resetForm"
    >
      <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
        <a-form-item field="name" label="分类名称">
          <a-input v-model="formData.name" placeholder="请输入分类名称" />
        </a-form-item>
        <a-form-item
          v-if="createLevel === 2 && !isEdit"
          field="parentId"
          label="所属一级分类"
        >
          <a-select
            v-model="formData.parentId"
            placeholder="请选择所属一级分类"
            allow-clear
          >
            <a-option
              v-for="cat in firstLevelCategories"
              :key="cat.id"
              :value="cat.id"
            >
              {{ cat.name }}
            </a-option>
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
import { ref, reactive, computed, onMounted } from "vue";
import { Message } from "@arco-design/web-vue";
import type { TableColumnData } from "@arco-design/web-vue";
import {
  getCategoryTree,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
  type CategoryStatus,
} from "@/api/category";
import { formatDate } from "@/utils/format";

const loading = ref(false);
const treeData = ref<Category[]>([]);
const formVisible = ref(false);
const isEdit = ref(false);
const createLevel = ref(1);
const currentId = ref<number | null>(null);
const formRef = ref();

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
});

const formData = reactive({
  name: "",
  parentId: undefined as number | undefined,
  status: "ACTIVE" as CategoryStatus,
});

const rules = {
  name: [{ required: true, message: "请输入分类名称" }],
  parentId: [
    {
      required: true,
      message: "请选择所属一级分类",
      validator: (value: number | undefined, cb: (error?: string) => void) => {
        if (createLevel.value === 2 && !isEdit.value && !value) {
          cb("请选择所属一级分类");
        } else {
          cb();
        }
      },
    },
  ],
};

const firstLevelCategories = computed(() => {
  return treeData.value.filter((cat) => cat.level === 1);
});

const modalTitle = computed(() => {
  if (isEdit.value) return "编辑分类";
  return createLevel.value === 1 ? "新建一级分类" : "新建二级分类";
});

const columns: TableColumnData[] = [
  { title: "ID", dataIndex: "id", width: 80 },
  { title: "分类名称", dataIndex: "name", width: 200 },
  { title: "层级", slotName: "level", width: 80 },
  { title: "帖子数", dataIndex: "postCount", width: 100 },
  { title: "状态", slotName: "status", width: 100 },
  { title: "创建时间", slotName: "createdAt", width: 180 },
  { title: "操作", slotName: "operations", width: 150 },
];

const fetchData = async () => {
  loading.value = true;
  try {
    const res = await getCategoryTree();
    treeData.value = res || [];
    pagination.total = treeData.value.length;
  } catch (error) {
    Message.error("获取分类列表失败");
  } finally {
    loading.value = false;
  }
};

const onPageChange = (page: number) => {
  pagination.current = page;
};

const handleCreate = (level: number) => {
  isEdit.value = false;
  createLevel.value = level;
  currentId.value = null;
  formVisible.value = true;
};

const handleEdit = (record: Category) => {
  isEdit.value = true;
  createLevel.value = record.level;
  currentId.value = record.id;
  formData.name = record.name;
  formData.parentId = record.parentId || undefined;
  formData.status = record.status;
  formVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    if (isEdit.value && currentId.value) {
      await updateCategory(currentId.value, {
        name: formData.name,
        status: formData.status,
      });
      Message.success("更新成功");
    } else {
      await createCategory({
        name: formData.name,
        level: createLevel.value,
        parentId: createLevel.value === 2 ? formData.parentId : undefined,
      });
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
  formData.parentId = undefined;
  formData.status = "ACTIVE";
  formRef.value?.resetFields();
};

const handleDelete = async (id: number) => {
  try {
    await deleteCategory(id);
    Message.success("删除成功");
    fetchData();
  } catch (error) {
    Message.error("删除失败");
  }
};

onMounted(() => {
  fetchData();
});
</script>

<script lang="ts">
export default {
  name: "CategoryManagement",
};
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;
}

.general-card {
  min-height: 100%;
}
</style>
