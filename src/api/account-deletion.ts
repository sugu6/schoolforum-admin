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

export async function getAccountDeletionList(params: AccountDeletionListParams): Promise<PageResponse<AccountDeletionRequest>> {
  const res = await axios.get<PageResponse<AccountDeletionRequest>>(
    '/account-deletion/list/page',
    { params },
  );
  return res.data;
}

export async function requestAccountDeletion(reason?: string): Promise<AccountDeletionRequest> {
  const res = await axios.post<AccountDeletionRequest>('/users/deletion/request', null, {
    params: { reason },
  });
  return res.data;
}

export async function cancelAccountDeletion(): Promise<string> {
  const res = await axios.post<string>('/users/deletion/cancel');
  return res.data;
}

export async function getAccountDeletionStatus(): Promise<AccountDeletionRequest> {
  const res = await axios.get<AccountDeletionRequest>('/users/deletion/status');
  return res.data;
}
