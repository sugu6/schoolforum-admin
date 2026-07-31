import axios from 'axios';

export interface SearchSyncResult {
  message: string;
}

export async function rebuildIndex(): Promise<SearchSyncResult> {
  const res = await axios.post<SearchSyncResult>('/search/sync');
  return res.data;
}

export async function clearIndex(): Promise<SearchSyncResult> {
  const res = await axios.delete<SearchSyncResult>('/search/sync');
  return res.data;
}
