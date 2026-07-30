import axios from 'axios';

export interface SearchSyncResult {
  message: string;
}

export function rebuildIndex() {
  return axios.post<SearchSyncResult>('/search/sync');
}

export function clearIndex() {
  return axios.delete<SearchSyncResult>('/search/sync');
}
