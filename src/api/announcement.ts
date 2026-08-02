import axios from "axios";
import type { PageResponse } from "@/types/api";

export type AnnouncementType = "INFO" | "WARNING" | "ERROR";
export type AnnouncementStatus = "DRAFT" | "PUBLISHED" | "OFFLINE";

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

export async function getAnnouncementList(
  params: AnnouncementListParams,
): Promise<PageResponse<Announcement>> {
  const res = await axios.get<PageResponse<Announcement>>(
    "/announcements/admin/list",
    {
      params,
    },
  );
  return res.data;
}

export async function createAnnouncement(
  data: AnnouncementCreateRequest,
): Promise<Announcement> {
  const res = await axios.post<Announcement>("/announcements", data);
  return res.data;
}

export async function updateAnnouncement(
  id: number,
  data: AnnouncementUpdateRequest,
): Promise<Announcement> {
  const res = await axios.put<Announcement>(`/announcements/${id}`, data);
  return res.data;
}

export function deleteAnnouncement(id: number) {
  return axios.delete(`/announcements/${id}`);
}

export async function getAnnouncementDetail(id: number): Promise<Announcement> {
  const res = await axios.get<Announcement>(`/announcements/${id}`);
  return res.data;
}

export async function publishAnnouncement(id: number): Promise<Announcement> {
  const res = await axios.put<Announcement>(`/announcements/${id}/publish`);
  return res.data;
}

export async function offlineAnnouncement(id: number): Promise<Announcement> {
  const res = await axios.put<Announcement>(`/announcements/${id}/offline`);
  return res.data;
}

export function toggleAnnouncementTop(id: number) {
  return axios.put(`/announcements/${id}/top`);
}
