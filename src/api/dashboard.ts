import axios from 'axios';
import type { TableData } from '@arco-design/web-vue/es/table/interface';
import type { PageResponse } from '@/types/api';
import type { Announcement } from './announcement';
import type { Post } from './post';
import type { Comment } from './comment';

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}

export interface DashboardStats {
  users: number;
  posts: number;
  comments: number;
  announcements: number;
  categories: number;
  tags: number;
}

export async function queryDashboardStats(): Promise<DashboardStats> {
  const [
    usersRes,
    postsRes,
    commentsRes,
    announcementsRes,
    categoriesRes,
    tagsRes,
  ] = await Promise.all([
    axios.get<PageResponse<unknown>>('/users/list/page', {
      params: { pageNumber: 1, pageSize: 1 },
    }),
    axios.get<PageResponse<unknown>>('/posts/list/page', {
      params: { pageNumber: 1, pageSize: 1 },
    }),
    axios.get<PageResponse<unknown>>('/comments/list/page', {
      params: { pageNumber: 1, pageSize: 1 },
    }),
    axios.get<PageResponse<unknown>>('/announcements/admin/list', {
      params: { pageNumber: 1, pageSize: 1 },
    }),
    axios.get<unknown[]>('/categories/list/page'),
    axios.get<unknown[]>('/tags/list'),
  ]);

  const stats: DashboardStats = {
    users: (usersRes.data as any)?.totalRow ?? 0,
    posts: (postsRes.data as any)?.totalRow ?? 0,
    comments: (commentsRes.data as any)?.totalRow ?? 0,
    announcements: (announcementsRes.data as any)?.totalRow ?? 0,
    categories: Array.isArray(categoriesRes.data)
      ? (categoriesRes.data as unknown[]).length
      : 0,
    tags: Array.isArray(tagsRes.data) ? (tagsRes.data as unknown[]).length : 0,
  };
  return stats;
}

export async function queryRecentAnnouncements(params: {
  pageNumber: number;
  pageSize: number;
}): Promise<PageResponse<Announcement>> {
  const res = await axios.get<PageResponse<Announcement>>(
    '/announcements/admin/list',
    {
      params,
    },
  );
  return res.data;
}

export async function queryRecentPosts(params: {
  pageNumber: number;
  pageSize: number;
}): Promise<PageResponse<Post>> {
  const res = await axios.get<PageResponse<Post>>('/posts/list/page', {
    params,
  });
  return res.data;
}

export async function queryRecentComments(params: {
  pageNumber: number;
  pageSize: number;
}): Promise<PageResponse<Comment>> {
  const res = await axios.get<PageResponse<Comment>>('/comments/list/page', {
    params,
  });
  return res.data;
}
