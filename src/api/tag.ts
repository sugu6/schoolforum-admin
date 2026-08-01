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

export async function getTagList(): Promise<Tag[]> {
  const res = await axios.get<Tag[]>('/tags/list');
  return res.data;
}

export async function getTagDetail(id: number): Promise<Tag> {
  const res = await axios.get<Tag>(`/tags/get/${id}`);
  return res.data;
}

export async function createTag(data: TagCreateRequest): Promise<Tag> {
  // 后端 /tags/add 使用 form/query 参数
  const res = await axios.post<Tag>('/tags/add', null, { params: data });
  return res.data;
}

export async function updateTag(
  id: number,
  data: TagUpdateRequest,
): Promise<Tag> {
  const res = await axios.put<Tag>(`/tags/update/${id}`, null, {
    params: data,
  });
  return res.data;
}

export function deleteTag(id: number) {
  return axios.delete(`/tags/delete/${id}`);
}

export async function getTagsByCategory(categoryId: number): Promise<Tag[]> {
  const res = await axios.get<Tag[]>(`/tags/list/category/${categoryId}`);
  return res.data;
}

export async function getEnabledTagList(): Promise<Tag[]> {
  const res = await axios.get<Tag[]>('/tags/list/enabled');
  return res.data;
}
