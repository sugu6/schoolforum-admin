import axios from 'axios';

export type TagStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_DELETION';

export interface Tag {
  id: number;
  name: string;
  categoryId: number;
  categoryName?: string;
  postCount: number;
  status: TagStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TagCreateRequest {
  name: string;
  categoryId?: number;
}

export interface TagUpdateRequest {
  name?: string;
  categoryId?: number;
  status?: TagStatus;
}

export function getTagList() {
  return axios.get<Tag[]>('/tags/list');
}

export function getTagDetail(id: number) {
  return axios.get<Tag>(`/tags/get/${id}`);
}

export function createTag(data: TagCreateRequest) {
  return axios.post<Tag>('/tags/add', data);
}

export function updateTag(id: number, data: TagUpdateRequest) {
  return axios.put<Tag>(`/tags/update/${id}`, null, { params: data });
}

export function deleteTag(id: number) {
  return axios.delete(`/tags/delete/${id}`);
}

export function getTagsByCategory(categoryId: number) {
  return axios.get<Tag[]>(`/tags/list/category/${categoryId}`);
}

export function getEnabledTagList() {
  return axios.get<Tag[]>('/tags/list/enabled');
}
