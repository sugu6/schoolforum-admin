import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MANAGEMENT: AppRouteRecordRaw = {
  path: '/management',
  name: 'management',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.management',
    requiresAuth: true,
    icon: 'icon-settings',
    order: 1,
  },
  children: [
    {
      path: 'user',
      name: 'UserManagement',
      component: () => import('@/views/management/user/index.vue'),
      meta: {
        locale: 'menu.management.user',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'announcement',
      name: 'AnnouncementManagement',
      component: () => import('@/views/management/announcement/index.vue'),
      meta: {
        locale: 'menu.management.announcement',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'category',
      name: 'CategoryManagement',
      component: () => import('@/views/management/category/index.vue'),
      meta: {
        locale: 'menu.management.category',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'tag',
      name: 'TagManagement',
      component: () => import('@/views/management/tag/index.vue'),
      meta: {
        locale: 'menu.management.tag',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'post',
      name: 'PostManagement',
      component: () => import('@/views/management/post/index.vue'),
      meta: {
        locale: 'menu.management.post',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'comment',
      name: 'CommentManagement',
      component: () => import('@/views/management/comment/index.vue'),
      meta: {
        locale: 'menu.management.comment',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'account-deletion',
      name: 'AccountDeletionManagement',
      component: () => import('@/views/management/account-deletion/index.vue'),
      meta: {
        locale: 'menu.management.accountDeletion',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'search-index',
      name: 'SearchIndexManagement',
      component: () => import('@/views/management/search-index/index.vue'),
      meta: {
        locale: 'menu.management.searchIndex',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default MANAGEMENT;
