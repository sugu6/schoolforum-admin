<template>
  <div class="container">
    <a-card class="general-card" title="搜索索引管理">
      <a-space direction="vertical" size="large" fill>
        <a-alert type="info">
          <template #title>索引管理说明</template>
          <div>
            <p
              >•
              重建索引：删除旧索引并全量同步数据，适用于数据不一致或需要重新构建搜索索引的场景</p
            >
            <p
              >•
              清空索引：清空所有搜索索引数据，执行后搜索功能将不可用直到重建索引</p
            >
          </div>
        </a-alert>

        <a-card title="索引操作" :bordered="false">
          <a-space size="large">
            <div>
              <a-button
                type="primary"
                :loading="rebuildLoading"
                @click="handleRebuildIndex"
              >
                <template #icon><icon-sync /></template>
                重建索引
              </a-button>
              <span class="operation-desc">删除旧索引并全量同步数据</span>
            </div>
            <div>
              <a-button
                status="danger"
                :loading="clearLoading"
                @click="handleClearIndex"
              >
                <template #icon><icon-delete /></template>
                清空索引
              </a-button>
              <span class="operation-desc">清空所有搜索索引数据</span>
            </div>
          </a-space>
        </a-card>

        <a-card title="操作日志" :bordered="false">
          <a-timeline>
            <a-timeline-item
              v-for="(log, index) in operationLogs"
              :key="index"
              :label="log.time"
            >
              <a-tag :color="log.type === 'success' ? 'green' : 'red'">
                {{ log.type === 'success' ? '成功' : '失败' }}
              </a-tag>
              {{ log.action }}
            </a-timeline-item>
            <a-timeline-item v-if="operationLogs.length === 0">
              <span class="text-gray">暂无操作记录</span>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-space>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import { rebuildIndex, clearIndex } from '@/api/search';
  import dayjs from 'dayjs';

  interface OperationLog {
    time: string;
    action: string;
    type: 'success' | 'error';
  }

  const rebuildLoading = ref(false);
  const clearLoading = ref(false);
  const operationLogs = ref<OperationLog[]>([]);

  const addLog = (action: string, type: 'success' | 'error') => {
    operationLogs.value.unshift({
      time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      action,
      type,
    });
  };

  const handleRebuildIndex = () => {
    Modal.confirm({
      title: '确认重建索引',
      content:
        '重建索引将删除旧索引并全量同步数据,此操作可能需要较长时间,确定继续吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        rebuildLoading.value = true;
        try {
          await rebuildIndex();
          Message.success('索引重建成功');
          addLog('重建索引', 'success');
        } catch (error) {
          Message.error('索引重建失败');
          addLog('重建索引', 'error');
        } finally {
          rebuildLoading.value = false;
        }
      },
    });
  };

  const handleClearIndex = () => {
    Modal.confirm({
      title: '确认清空索引',
      content: '清空索引后搜索功能将不可用,直到重新构建索引,确定继续吗?',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        clearLoading.value = true;
        try {
          await clearIndex();
          Message.success('索引清空成功');
          addLog('清空索引', 'success');
        } catch (error) {
          Message.error('索引清空失败');
          addLog('清空索引', 'error');
        } finally {
          clearLoading.value = false;
        }
      },
    });
  };
</script>

<script lang="ts">
  export default {
    name: 'SearchIndexManagement',
  };
</script>

<style lang="less" scoped>
  .container {
    padding: 16px;
  }
  .general-card {
    min-height: 100%;
  }
  .text-gray {
    color: var(--color-text-3);
  }
  .operation-desc {
    margin-left: 12px;
    color: var(--color-text-3);
    font-size: 14px;
  }
</style>
