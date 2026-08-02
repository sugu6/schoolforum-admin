import axios from "axios";

// 后端 sync/clear 接口返回的是纯字符串（ResponseAdvice 包装后 data 为 String）
export type SearchSyncResult = string;

export async function rebuildIndex(): Promise<SearchSyncResult> {
  const res = await axios.post<SearchSyncResult>("/search/sync");
  return res.data;
}

export async function clearIndex(): Promise<SearchSyncResult> {
  const res = await axios.delete<SearchSyncResult>("/search/sync");
  return res.data;
}
