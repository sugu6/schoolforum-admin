<template>
  <div class="container">
    <a-card class="general-card" title="用户管理">
      <template #extra>
        <a-button type="primary" @click="search">
          <template #icon><icon-refresh /></template>
          刷新
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
        <template #avatarUrl="{ record }">
          <a-avatar :size="40">
            <img v-if="record.avatarUrl" :src="record.avatarUrl" alt="avatar" />
            <span v-else>{{ record.username?.charAt(0)?.toUpperCase() }}</span>
          </a-avatar>
        </template>
        <template #role="{ record }">
          <a-tag v-if="record.role === 'SUPER_ADMIN'" color="#7C3AED"
            >超级管理员</a-tag
          >
          <a-tag v-else-if="record.role === 'ADMIN'" color="orangered"
            >管理员</a-tag
          >
          <a-tag v-else color="green">用户</a-tag>
        </template>
        <template #isActive="{ record }">
          <a-tag v-if="record.isActive === 'ACTIVE'" color="green">正常</a-tag>
          <a-tag v-else color="red">禁用</a-tag>
        </template>
        <template #createdAt="{ record }">
          {{ formatDate(record.createdAt) }}
        </template>
        <template #operations="{ record }">
          <a-button type="text" size="small" @click="editUser(record)">
            编辑
          </a-button>
          <a-button type="text" size="small" @click="viewUser(record)">
            查看
          </a-button>
          <a-popconfirm
            content="确定要删除该用户吗？"
            @ok="handleDelete(record.id)"
          >
            <a-button type="text" size="small" status="danger"> 删除 </a-button>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:visible="detailVisible"
      title="用户详情"
      :footer="false"
      width="600px"
    >
      <a-descriptions :column="2" bordered>
        <a-descriptions-item label="用户ID">{{
          currentUser?.id
        }}</a-descriptions-item>
        <a-descriptions-item label="用户名">{{
          currentUser?.username
        }}</a-descriptions-item>
        <a-descriptions-item label="邮箱">{{
          currentUser?.email
        }}</a-descriptions-item>
        <a-descriptions-item label="年龄">{{
          currentUser?.age || "-"
        }}</a-descriptions-item>
        <a-descriptions-item label="性别">{{
          currentUser?.gender || "-"
        }}</a-descriptions-item>
        <a-descriptions-item label="角色">
          <a-tag v-if="currentUser?.role === 'SUPER_ADMIN'" color="#7C3AED"
            >超级管理员</a-tag
          >
          <a-tag v-else-if="currentUser?.role === 'ADMIN'" color="orangered"
            >管理员</a-tag
          >
          <a-tag v-else color="green">用户</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="状态">
          <a-tag v-if="currentUser?.isActive === 'ACTIVE'" color="green"
            >正常</a-tag
          >
          <a-tag v-else color="red">禁用</a-tag>
        </a-descriptions-item>
        <a-descriptions-item label="等级">{{
          currentUser?.level || 1
        }}</a-descriptions-item>
        <a-descriptions-item label="积分">{{
          currentUser?.points || 0
        }}</a-descriptions-item>
        <a-descriptions-item label="经验值">{{
          currentUser?.exp || 0
        }}</a-descriptions-item>
        <a-descriptions-item label="连续签到"
          >{{ currentUser?.continuousSignDays || 0 }}天</a-descriptions-item
        >
        <a-descriptions-item label="注册时间" :span="2">{{
          formatDate(currentUser?.createdAt)
        }}</a-descriptions-item>
        <a-descriptions-item label="最后登录" :span="2">{{
          formatDate(currentUser?.lastLoginAt)
        }}</a-descriptions-item>
        <a-descriptions-item label="个人简介" :span="2">{{
          currentUser?.bio || "-"
        }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>

    <a-modal
      v-model:visible="editVisible"
      title="编辑用户"
      width="500px"
      @ok="handleEditSubmit"
      @cancel="editVisible = false"
    >
      <a-form :model="editForm" layout="vertical">
        <a-form-item label="用户名">
          <a-input v-model="editForm.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="邮箱">
          <a-input v-model="editForm.email" placeholder="请输入邮箱" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select v-model="editForm.role" placeholder="请选择角色">
            <a-option value="USER">用户</a-option>
            <a-option value="ADMIN">管理员</a-option>
            <a-option value="SUPER_ADMIN">超级管理员</a-option>
          </a-select>
        </a-form-item>
        <a-form-item label="状态">
          <a-select v-model="editForm.isActive" placeholder="请选择状态">
            <a-option value="ACTIVE">正常</a-option>
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
  getUserList,
  getUserInfoById,
  deleteUser,
  updateUser,
  type User,
  type UpdateUserData,
} from "@/api/user";
import { formatDate } from "@/utils/format";
import { useTableData } from "@/hooks/use-table-data";

const detailVisible = ref(false);
const currentUser = ref<User | null>(null);

const editVisible = ref(false);
const editingUserId = ref<number | null>(null);
const editForm = reactive<UpdateUserData>({
  username: "",
  email: "",
  role: "",
  isActive: "",
});

// 使用可复用的表格数据 composable
const { tableData, loading, pagination, fetchData, onPageChange, refresh } =
  useTableData<User>({
    fetchFn: async () => {
      const res = await getUserList({
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      });
      return res;
    },
    pageSize: 10,
    immediate: false, // 手动控制加载时机
  });

const columns: TableColumnData[] = [
  { title: "头像", slotName: "avatarUrl", width: 80 },
  { title: "用户名", dataIndex: "username", width: 120 },
  { title: "邮箱", dataIndex: "email", width: 200 },
  { title: "角色", slotName: "role", width: 100 },
  { title: "状态", slotName: "isActive", width: 100 },
  { title: "注册时间", slotName: "createdAt", width: 180 },
  { title: "操作", slotName: "operations", width: 180 },
];

const search = () => {
  refresh();
};

const viewUser = async (user: User) => {
  try {
    const res = await getUserInfoById(user.id);
    currentUser.value = res;
    detailVisible.value = true;
  } catch {
    Message.error("获取用户详情失败");
  }
};

const handleDelete = async (id: number) => {
  try {
    await deleteUser(id);
    Message.success("删除成功");
    fetchData();
  } catch {
    Message.error("删除失败");
  }
};

const editUser = (user: User) => {
  editingUserId.value = user.id;
  editForm.username = user.username || "";
  editForm.email = user.email || "";
  editForm.role = user.role || "";
  editForm.isActive = user.isActive || "";
  editVisible.value = true;
};

const handleEditSubmit = async () => {
  if (!editingUserId.value) return;
  try {
    await updateUser(editingUserId.value, { ...editForm });
    Message.success("编辑成功");
    editVisible.value = false;
    fetchData();
  } catch {
    Message.error("编辑失败");
  }
};

onMounted(() => {
  fetchData();
});

defineOptions({
  name: "UserManagement",
});
</script>

<style lang="scss" scoped>
.container {
  padding: 16px;
}

.general-card {
  min-height: 100%;
}
</style>
