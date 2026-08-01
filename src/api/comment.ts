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
  user?: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommentListParams {
  pageNumber: number;
  pageSize: number;
}

export async function getCommentList(
  params: CommentListParams,
): Promise<PageResponse<Comment>> {
  const res = await axios.get<PageResponse<Comment>>('/comments/list/page', {
    params,
  });
  return res.data;
}

export async function getCommentDetail(id: number): Promise<Comment> {
  const res = await axios.get<Comment>(`/comments/get/${id}`);
  return res.data;
}

export async function updateComment(
  id: number,
  content: string,
): Promise<Comment> {
  const res = await axios.put<Comment>(`/comments/update/${id}`, null, {
    params: { content },
  });
  return res.data;
}

export function deleteComment(id: number) {
  return axios.delete(`/comments/delete/${id}`);
}
