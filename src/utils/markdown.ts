import { marked } from 'marked';
import DOMPurify from 'dompurify';

// 配置 marked：关闭 mangle，开启 breaks 换行
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * 将 Markdown 文本渲染为 HTML 字符串。
 * 对空输入返回空字符串，避免渲染出空 <p>。
 * 输出经 DOMPurify 净化，防止 XSS（脚本、事件属性、危险协议等）。
 */
export default function renderMarkdown(content: string): string {
  if (!content) return '';
  try {
    const rawHtml = marked.parse(content, { async: false }) as string;
    return DOMPurify.sanitize(rawHtml, {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['style', 'form', 'input', 'textarea', 'button'],
      FORBID_ATTR: ['srcset'],
    });
  } catch {
    return '';
  }
}
