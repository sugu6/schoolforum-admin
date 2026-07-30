import axios from 'axios';
import type { PageResponse } from '@/types/api';

export type AnnouncementType = 'INFO' | 'WARNING' | 'ERROR';
export type AnnouncementStatus = 'DRAFT' | 'PUBLISHED' | 'OFFLINE';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  isTop: number;
  publisherId: number;
  publisher?: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AnnouncementCreateRequest {
  title: string;
  content: string;
  type: AnnouncementType;
}

export interface AnnouncementUpdateRequest {
  title?: string;
  content?: string;
  type?: AnnouncementType;
}

export interface AnnouncementListParams {
  pageNumber: number;
  pageSize: number;
}

export function getAnnouncementList(params: AnnouncementListParams) {
  return axios.get<PageResponse<Announcement>>('/announcements/admin/list', {
    params,
  });
}

export function createAnnouncement(data: AnnouncementCreateRequest) {
  return axios.post<Announcement>('/announcements', data);
}

export function updateAnnouncement(
  id: number,
  data: AnnouncementUpdateRequest,
) {
  return axios.put<Announcement>(`/announcements/${id}`, data);
}

export function deleteAnnouncement(id: number) {
  return axios.delete(`/announcements/${id}`);
}

export function getAnnouncementDetail(id: number) {
  return axios.get<Announcement>(`/announcements/${id}`);
}

export function publishAnnouncement(id: number) {
  return axios.put<Announcement>(`/announcements/${id}/publish`);
}

export function offlineAnnouncement(id: number) {
  return axios.put<Announcement>(`/announcements/${id}/offline`);
}

export function toggleAnnouncementTop(id: number) {
  return axios.put(`/announcements/${id}/top`);
}
