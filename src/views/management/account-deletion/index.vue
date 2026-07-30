<template>
  <div class="container">
    <a-card class="general-card" title="注销账号管理">
      <template #extra>
        <a-space>
          <a-select
            v-model="filterStatus"
            placeholder="状态筛选"
            style="width: 150px"
            allow-clear
            @change="handleStatusChange"
          >
            <a-option value="PENDING">待处理</a-option>
            <a-option value="CANCELLED">已撤销</a-option>
            <a-option value="COMPLETED">已完成</a-option>
          </a-select>
          <a-button type="primary" @click="search">
            <template #icon><icon-refresh /></template>
            刷新
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
        <template #status="{ record }">
          <a-tag v-if="record.status === 'PENDING'" color="orange"
            >待处理</a-tag
          >
          <a-tag v-else-if="record.status === 'CANCELLED'" color="gray"
            >已撤销</a-tag
          >
          <a-tag v-else-if="record.status === 'COMPLETED'" color="green"
            >已完成</a-tag
          >
        </template>
        <template #reason="{ record }">
          <a-tooltip :content="record.reason">
            <span class="reason-text">{{ record.reason || '-' }}</span>
          </a-tooltip>
        </template>
        <template #requestedAt="{ record }">
          {{ formatDate(record.requestedAt) }}
        </template>
        <template #scheduledAt="{ record }">
          {{ formatDate(record.scheduledAt) }}
        </template>
        <template #countdown="{ record }">
          <div v-if="record.status === 'PENDING'" class="countdown-wrapper">
            <a-countdown
              :value="getCountdownValue(record.scheduledAt)"
              :now="Date.now()"
              :value-style="getCountdownStyle(record.scheduledAt)"
              format="D 天 H 时 m 分 s 秒"
            />
          </div>
          <span v-else class="countdown-empty">-</span>
        </template>
        <template #completedAt="{ record }">
          {{ formatDate(record.completedAt) }}
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import dayjs from 'dayjs';
  import type { TableColumnData } from '@arco-design/web-vue';
  import {
    getAccountDeletionList,
    type AccountDeletionRequest,
  } from '@/api/account-deletion';
  import { formatDate } from '@/utils/format';

  const loading = ref(false);
  const tableData = ref<AccountDeletionRequest[]>([]);
  const filterStatus = ref<string | undefined>(undefined);

  const pagination = reactive({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const columns: TableColumnData[] = [
    { title: '申请ID', dataIndex: 'userId', width: 100 },
    { title: '用户名', dataIndex: 'username', width: 120 },
    { title: '注销原因', slotName: 'reason', ellipsis: true, tooltip: true },
    { title: '状态', slotName: 'status', width: 120 },
    { title: '申请时间', slotName: 'requestedAt', width: 180 },
    { title: '计划执行时间', slotName: 'scheduledAt', width: 180 },
    { title: '倒计时', slotName: 'countdown', width: 200 },
    { title: '完成时间', slotName: 'completedAt', width: 180 },
  ];

  const getCountdownValue = (scheduledAt: string | undefined) => {
    if (!scheduledAt) return 0;
    return dayjs(scheduledAt).valueOf();
  };

  const getCountdownStyle = (scheduledAt: string | undefined) => {
    if (!scheduledAt) return {};
    const diff = dayjs(scheduledAt).diff(dayjs(), 'hour');
    const isUrgent = diff < 24;

    return {
      fontSize: '14px',
      fontWeight: '600',
      color: isUrgent ? '#f53f3f' : '#165dff',
    };
  };

  const fetchData = async () => {
    loading.value = true;
    try {
      const params: any = {
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      };
      if (filterStatus.value) {
        params.status = filterStatus.value;
      }
      const res = await getAccountDeletionList(params);
      const records = (res as any).records || [];
      tableData.value = records.sort(
        (a: any, b: any) => (a as any).id - (b as any).id,
      );
      pagination.total = (res as any).totalRow || 0;
    } catch (error) {
      Message.error('获取注销账号列表失败');
    } finally {
      loading.value = false;
    }
  };

  const handleStatusChange = () => {
    pagination.current = 1;
    fetchData();
  };

  const search = () => {
    pagination.current = 1;
    fetchData();
  };

  const onPageChange = (page: number) => {
    pagination.current = page;
    fetchData();
  };

  onMounted(() => {
    fetchData();
  });
</script>

<script lang="ts">
  export default {
    name: 'AccountDeletionManagement',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 16px;
  }
  .general-card {
    min-height: 100%;
  }
  .reason-text {
    display: inline-block;
    max-width: 200px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .countdown-wrapper {
    display: flex;
    align-items: center;
  }

  .countdown-empty {
    color: #c9cdd4;
  }
</style>
