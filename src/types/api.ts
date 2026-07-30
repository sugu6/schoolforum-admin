export interface PageResponse<T> {
  records: T[];
  pageNumber: number;
  pageSize: number;
  totalPage: number;
  totalRow: number;
}
