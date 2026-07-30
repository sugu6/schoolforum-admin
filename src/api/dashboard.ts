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

export function queryDashboardStats() {
  return Promise.all([
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
  ]).then(
    ([
      usersRes,
      postsRes,
      commentsRes,
      announcementsRes,
      categoriesRes,
      tagsRes,
    ]) => {
      const stats: DashboardStats = {
        users: (usersRes as any).data?.totalRow ?? 0,
        posts: (postsRes as any).data?.totalRow ?? 0,
        comments: (commentsRes as any).data?.totalRow ?? 0,
        announcements: (announcementsRes as any).data?.totalRow ?? 0,
        categories: Array.isArray((categoriesRes as any).data)
          ? (categoriesRes as any).data.length
          : 0,
        tags: Array.isArray((tagsRes as any).data)
          ? (tagsRes as any).data.length
          : 0,
      };
      return stats;
    },
  );
}

export function queryRecentAnnouncements(params: {
  pageNumber: number;
  pageSize: number;
}) {
  return axios.get<PageResponse<Announcement>>('/announcements/admin/list', {
    params,
  });
}

export function queryRecentPosts(params: {
  pageNumber: number;
  pageSize: number;
}) {
  return axios.get<PageResponse<Post>>('/posts/list/page', {
    params,
  });
}

export function queryRecentComments(params: {
  pageNumber: number;
  pageSize: number;
}) {
  return axios.get<PageResponse<Comment>>('/comments/list/page', {
    params,
  });
}
