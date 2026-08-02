import type { PageResponse } from "@/types/api";

interface UseTableDataOptions<T> {
  fetchFn: (params: {
    pageNumber: number;
    pageSize: number;
  }) => Promise<PageResponse<T>>;
  pageSize?: number;
  immediate?: boolean;
}

/**
 * 可复用的表格数据 composable
 * 自动管理 tableData、loading、pagination 和分页事件
 * fetchFn 返回的 PageResponse 会被自动解包(拦截器已解包 { code, msg, data })
 */
export function useTableData<T>(options: UseTableDataOptions<T>) {
  const { fetchFn, pageSize: defaultPageSize = 10, immediate = true } = options;

  const tableData = ref<T[]>([]) as Ref<T[]>;
  const loading = ref(false);

  const pagination = reactive({
    current: 1,
    pageSize: defaultPageSize,
    total: 0,
  });

  const fetchData = async () => {
    loading.value = true;
    try {
      const res = await fetchFn({
        pageNumber: pagination.current,
        pageSize: pagination.pageSize,
      });
      // 拦截器已解包,res 直接就是 PageResponse<T>
      const data = res as unknown as PageResponse<T>;
      tableData.value = data?.records || [];
      pagination.total = data?.totalRow || 0;
    } catch (error) {
      console.error("Failed to fetch table data:", error);
      tableData.value = [];
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

  const refresh = () => {
    pagination.current = 1;
    fetchData();
  };

  if (immediate) {
    onMounted(() => {
      fetchData();
    });
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
