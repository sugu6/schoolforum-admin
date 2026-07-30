import { marked, Renderer } from 'marked';
import DOMPurify from 'dompurify';
import { MARKDOWN_CACHE_SIZE } from './constants';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';

// ==================== Markdown 缓存 ====================
const markdownCache = new Map<string, string>();

function getCacheKey(markdown: string): string {
  // 使用内容的哈希作为缓存键（简化版）
  return `${markdown.length}-${markdown.slice(0, 100)}`;
}

function clearMarkdownCache() {
  if (markdownCache.size > MARKDOWN_CACHE_SIZE) {
    // 清除最早的一半缓存
    const keys = Array.from(markdownCache.keys());
    const halfSize = Math.floor(keys.length / 2);
    keys.slice(0, halfSize).forEach(key => markdownCache.delete(key));
  }
}

// ==================== URL 解析 ====================
function resolveImageUrl(src: string): string {
  if (
    !src ||
    src.startsWith('http://') ||
    src.startsWith('https://') ||
    src.startsWith('data:')
  ) {
    return src;
  }
  if (!src.startsWith('/')) {
    src = `/${src}`;
  }
  return baseUrl + src;
}

const renderer = new Renderer();

renderer.link = ({ href, title, text }): string => {
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  // 确保 href 是安全的
  const safeHref = href && (href.startsWith('http://') || href.startsWith('https://') || href.startsWith('/'))
    ? escapeHtml(href)
    : '#';
  return `<a href="${safeHref}"${titleAttr} target="_blank" rel="noopener noreferrer nofollow">${escapeHtml(text)}</a>`;
};

renderer.image = ({ href, title, text }): string => {
  const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
  const src = resolveImageUrl(href);
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(text)}"${titleAttr} style="max-width:100%;height:auto;" loading="lazy" />`;
};

marked.setOptions({
  renderer,
  gfm: true,
  breaks: true,
});

// HTML 转义函数
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// 严格的 DOMPurify 配置
const sanitizeConfig = {
  // 允许的基本标签
  ALLOWED_TAGS: [
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'p', 'br', 'hr',
    'ul', 'ol', 'li',
    'blockquote',
    'code', 'pre',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'a', 'img',
    'strong', 'em', 'del', 'span',
    'div',
  ],
  // 允许的属性
  ALLOWED_ATTR: [
    'href', 'title', 'alt', 'src',
    'class', 'style',
    'target', 'rel',
    'loading',
    'colspan', 'rowspan',
  ],
  // 允许的 URI 协议
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  // 强制添加 rel="noopener noreferrer" 到所有外部链接
  ADD_ATTR: ['target', 'rel'],
  // 禁止使用 HTML 注释
  ALLOWED_COMMENTS: false,
  // 防止基于 DOM 的 XSS
  KEEP_CONTENT: true,
};

export default function renderMarkdown(markdown: string): string {
  if (!markdown) return '';

  // 检查缓存
  const cacheKey = getCacheKey(markdown);
  const cached = markdownCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const rawHtml = marked.parse(markdown) as string;
  const sanitized = DOMPurify.sanitize(rawHtml, sanitizeConfig);

  // 保存到缓存
  markdownCache.set(cacheKey, sanitized);
  clearMarkdownCache();

  return sanitized;
}

// 清空缓存（当内容更新时调用）
export function clearCache() {
  markdownCache.clear();
}
