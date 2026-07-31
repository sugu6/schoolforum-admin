import { marked } from 'marked';

// 配置 marked：关闭 mangle，开启 breaks 换行
marked.setOptions({
  breaks: true,
  gfm: true,
});

/**
 * 将 Markdown 文本渲染为 HTML 字符串。
 * 对空输入返回空字符串，避免渲染出空 <p>。
 */
export default function renderMarkdown(content: string): string {
  if (!content) return '';
  try {
    return marked.parse(content, { async: false }) as string;
  } catch {
    return content;
  }
}
