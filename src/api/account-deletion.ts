import axios from 'axios';

import type { PageResponse } from '@/types/api';

export interface AccountDeletionRequest {
  id: number;
  userId: number;
  username: string;
  reason: string;
  status: 'PENDING' | 'CANCELLED' | 'COMPLETED';
  requestedAt: string;
  scheduledAt: string;
  completedAt: string;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  code: number;
  msg?: string;
  message?: string;
  data: T;
  timestamp?: number;
}

export interface AccountDeletionListParams {
  pageNumber: number;
  pageSize: number;
  status?: 'PENDING' | 'CANCELLED' | 'COMPLETED';
}

export function getAccountDeletionList(params: AccountDeletionListParams) {
  return axios.get<PageResponse<AccountDeletionRequest>>(
    '/account-deletion/list/page',
    { params },
  );
}

export function requestAccountDeletion(reason?: string) {
  return axios.post<AccountDeletionRequest>('/users/deletion/request', null, {
    params: { reason },
  });
}

export function cancelAccountDeletion() {
  return axios.post<string>('/users/deletion/cancel');
}

export function getAccountDeletionStatus() {
  return axios.get<AccountDeletionRequest>('/users/deletion/status');
}
