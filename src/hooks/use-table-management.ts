import { ref, reactive, watch, type Ref, type Reactive } from 'vue';
import type { AxiosResponse } from 'axios';
import type { PageResponse } from '@/types/api';
import { DEBOUNCE_DELAY } from '@/utils/constants';
import { useDebounceFn } from './use-debounce';

export interface FilterOptions {
  [key: string]: any;
}

export interface UseTableManagementOptions<T> {
  fetchFn: () => Promise<AxiosResponse<PageResponse<T>>>;
  filters?: Ref<FilterOptions>;
  pageSize?: number;
  immediate?: boolean;
  debounceSearch?: boolean;
}

export interface UseTableManagementReturn<T> {
  tableData: Ref<any[]>;
  loading: Ref<boolean>;
  pagination: Reactive<{
    current: number;
    pageSize: number;
    total: number;
    showTotal?: boolean;
    showPageSize?: boolean;
  }>;
  filters: Ref<FilterOptions>;
  fetchData: () => Promise<void>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  refresh: () => Promise<void>;
  resetFilters: () => void;
}

export function useTableManagement<T>(options: UseTableManagementOptions<T>): UseTableManagementReturn<T> {
  const { fetchFn, filters = ref({}), pageSize = 10, immediate = true, debounceSearch = true } = options;

  const tableData = ref<any[]>([]);
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

  const resetFilters = () => {
    Object.keys(filters.value).forEach(key => {
      (filters.value as any)[key] = undefined;
    });
    pagination.current = 1;
    fetchData();
  };

  // 监听筛选条件变化（防抖）
  const debouncedFetch = useDebounceFn(() => {
    pagination.current = 1;
    fetchData();
  }, DEBOUNCE_DELAY);

  if (debounceSearch && filters) {
    watch(
      () => ({ ...filters.value }),
      () => {
        debouncedFetch();
      },
      { deep: true }
    );
  }

  // 立即加载数据
  if (immediate) {
    fetchData();
  }

  return {
    tableData,
    loading,
    pagination,
    filters,
    fetchData,
    onPageChange,
    onPageSizeChange,
    refresh,
    resetFilters,
  };
}
