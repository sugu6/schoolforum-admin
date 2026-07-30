import axios from 'axios';
import type { PageResponse } from '@/types/api';

export interface Post {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatar?: string;
  title: string;
  content: string;
  categoryId: number;
  categoryName?: string;
  parentCategoryName?: string;
  tagNames?: string[];
  coverImage?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  favoriteCount?: number;
  isPinned: string;
  isEssential: string;
  createdAt: string;
  updatedAt: string;
}

export interface PostListParams {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  categoryId?: number;
  isPinned?: boolean;
  isEssential?: boolean;
}

export function getPostList(params: PostListParams) {
  return axios.get<PageResponse<Post>>('/posts/list/page', { params });
}

export function getPostDetail(id: number) {
  return axios.get<Post>(`/posts/get/${id}`);
}

export function deletePost(id: number) {
  return axios.delete(`/posts/delete/${id}`);
}

export function setPostPinned(id: number, pinned: boolean) {
  return axios.put(`/posts/pinned/${id}`, null, { params: { pinned } });
}

export function setPostEssential(id: number, essential: boolean) {
  return axios.put(`/posts/essential/${id}`, null, { params: { essential } });
}
