/**
 * 全局常量定义
 * 集中管理项目中使用的魔法数字和字符串常量
 */

// ==================== 分页配置 ====================
export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_NUMBER = 1;

// ==================== API 配置 ====================
export const API_TIMEOUT = 30000; // 30 秒
export const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000; // 5 分钟（token 过期前刷新）

// ==================== 缓存配置 ====================
export const CACHE_MAX_AGE = 300; // 5 分钟（秒）
export const MARKDOWN_CACHE_SIZE = 100; // Markdown 缓存最大条目数

// ==================== 用户相关 ====================
export const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default';
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

// ==================== 帖子相关 ====================
export const POST_STATUS = {
  PINNED: 'PINNED',
  ESSENTIAL: 'ESSENTIAL',
  NORMAL: 'NORMAL',
} as const;

// ==================== 公告相关 ====================
export const ANNOUNCEMENT_TYPES = {
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
} as const;

export const ANNOUNCEMENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  OFFLINE: 'OFFLINE',
} as const;

// ==================== 分类相关 ====================
export const CATEGORY_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING_DELETION: 'PENDING_DELETION',
} as const;

// ==================== 标签相关 ====================
export const TAG_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  PENDING_DELETION: 'PENDING_DELETION',
} as const;

// ==================== 账号注销相关 ====================
export const ACCOUNT_DELETION_STATUS = {
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;

// ==================== 错误码 ====================
export const HTTP_STATUS = {
  OK: 200,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
} as const;

// ==================== UI 配置 ====================
export const MAX_TEXT_LENGTH = 100; // 文本截断最大长度
export const TOOLTIP_DELAY = 300; // Tooltip 显示延迟（毫秒）
export const NOTIFICATION_DURATION = 5000; // 通知显示时长（毫秒）
export const DEBOUNCE_DELAY = 300; // 防抖延迟（毫秒）
