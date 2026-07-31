import axios from 'axios';

export type CategoryStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING_DELETION';

export interface Category {
  id: number;
  name: string;
  parentId: number;
  level: number;
  status: CategoryStatus;
  postCount: number;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
}

export interface CategoryCreateRequest {
  name: string;
  parentId?: number;
  level?: number;
}

export interface CategoryUpdateRequest {
  name?: string;
  status?: CategoryStatus;
}

export async function getCategoryList(): Promise<Category[]> {
  const res = await axios.get<Category[]>('/categories/list/page');
  return res.data;
}

export async function getCategoryTree(): Promise<Category[]> {
  const res = await axios.get<Category[]>('/categories/list');
  return res.data;
}

export async function getCategoryDetail(id: number): Promise<Category> {
  const res = await axios.get<Category>(`/categories/get/${id}`);
  return res.data;
}

export async function createCategory(
  data: CategoryCreateRequest,
): Promise<Category> {
  const res = await axios.post<Category>('/categories/add', null, {
    params: data,
  });
  return res.data;
}

export async function updateCategory(
  id: number,
  data: CategoryUpdateRequest,
): Promise<Category> {
  const res = await axios.put<Category>(`/categories/update/${id}`, null, {
    params: data,
  });
  return res.data;
}

export function deleteCategory(id: number) {
  return axios.delete(`/categories/delete/${id}`);
}
