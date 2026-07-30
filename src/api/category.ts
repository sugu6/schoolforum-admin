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

export function getCategoryList() {
  return axios.get<Category[]>('/categories/list/page');
}

export function getCategoryTree() {
  return axios.get<Category[]>('/categories/list');
}

export function getCategoryDetail(id: number) {
  return axios.get<Category>(`/categories/get/${id}`);
}

export function createCategory(data: CategoryCreateRequest) {
  return axios.post<Category>('/categories/add', null, { params: data });
}

export function updateCategory(id: number, data: CategoryUpdateRequest) {
  return axios.put<Category>(`/categories/update/${id}`, null, {
    params: data,
  });
}

export function deleteCategory(id: number) {
  return axios.delete(`/categories/delete/${id}`);
}
