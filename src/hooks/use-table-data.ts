import { ref, reactive, type Ref, type Reactive } from 'vue';
import type { AxiosResponse } from 'axios';
import type { PageResponse } from '@/types/api';

export interface UseTableDataOptions<T> {
  fetchFn: () => Promise<AxiosResponse<PageResponse<T>>>;
  pageSize?: number;
  immediate?: boolean;
}

export interface UseTableDataReturn<T> {
  tableData: Ref<any[]>;
  loading: Ref<boolean>;
  pagination: Reactive<{
    current: number;
    pageSize: number;
    total: number;
    showTotal?: boolean;
    showPageSize?: boolean;
  }>;
  fetchData: () => Promise<void>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  refresh: () => Promise<void>;
}

export function useTableData<T>(options: UseTableDataOptions<T>): UseTableDataReturn<T> {
  const { fetchFn, pageSize = 10, immediate = true } = options;

  const tableData = ref<T[]>([]);
  const loading = ref(false);

  const pagination = reactive({
    current: 1,
    pageSize,
    total: 0,
    showTotal: true,
    showPageSize: true,
  });

  const fetchData = async () => {
    loading.value = true;
    try {
      const response = await fetchFn();
      const res = response.data;

      tableData.value = res.records || [];
      pagination.total = res.totalRow || 0;
    } catch (error) {
      console.error('Failed to fetch table data:', error);
    } finally {
      loading.value = false;
    }
  };

  const onPageChange = (page: number) => {
    pagination.current = page;
    fetchData();
  };

  const onPageSizeChange = (size: number) => {
    pagination.pageSize = size;
    pagination.current = 1;
    fetchData();
  };

  const refresh = async () => {
    pagination.current = 1;
    await fetchData();
  };

  // 立即加载数据
  if (immediate) {
    fetchData();
  }

  return {
    tableData,
    loading,
    pagination,
    fetchData,
    onPageChange,
    onPageSizeChange,
    refresh,
  };
}
