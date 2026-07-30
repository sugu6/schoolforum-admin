import axios from 'axios';
import type { PageResponse } from '@/types/api';

export interface CommentPost {
  id: number;
  authorId: number;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  categoryId: number;
  categoryName: string;
  parentCategoryName: string;
  tagNames: string[];
  coverImage: string;
  likeCount: number;
  commentCount: number;
  favoriteCount: number;
  viewCount: number;
  isPinned: string;
  isEssential: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: number;
  authorId: number;
  content: string;
  postId: number;
  likeCount: number;
  isDeleted: number;
  parent?: Comment;
  post?: CommentPost;
  createdAt: string;
  updatedAt: string;
}

export interface CommentListParams {
  pageNumber: number;
  pageSize: number;
}

export function getCommentList(params: CommentListParams) {
  return axios.get<PageResponse<Comment>>('/comments/list/page', { params });
}

export function getCommentDetail(id: number) {
  return axios.get<Comment>(`/comments/get/${id}`);
}

export function updateComment(id: number, content: string) {
  return axios.put<Comment>(`/comments/update/${id}`, null, {
    params: { content },
  });
}

export function deleteComment(id: number) {
  return axios.delete(`/comments/delete/${id}`);
}
