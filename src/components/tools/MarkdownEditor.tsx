import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Copy,
  Check,
  Download,
  Bold,
  Italic,
  List,
  Heading,
  Code,
  Link as LinkIcon,
  Quote,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

export const MarkdownEditor: React.FC = () => {
  const { t, language } = useApp();
  const [copiedHtml, setCopiedHtml] = useState(false);

  const initialMarkdown =
    language === 'ar'
      ? `# 🚀 مرحباً بك في محرر Markdown الاحترافي

هذا المحرر السريع يتيح لك صياغة وتنسيق المستندات والمقالات بسهولة مع **معاينة حية فورية**.

## ✨ الميزات الرئيسية:
- كتابة نصوص غنية مدعومة باللغة العربية
- إمكانية تصدير الملف كـ \`.md\` أو كود \`HTML\` نظيف
- جداول وقوائم وعناصر برمجية

### 📊 جدول مقارنة الأدوات:
| الأداة | السرعة | الأمان |
| :--- | :---: | :---: |
| محول Base64 | ⚡ فوري | 🔒 محلي 100% |
| فاحص JSON | ⚡ فوري | 🔒 محلي 100% |
| صانع QR | ⚡ فوري | 🔒 محلي 100% |

> "البرمجة والأدوات الرقمية البسيطة تجعل العمل اليومي أكثر إنتاجية وسلاسة."

\`\`\`javascript
// مثال على كود برمجي
function generateWelcome(name) {
  return \`أهلاً بك يا \${name} في منصة الأدوات!\`;
}
\`\`\`
`
      : `# 🚀 Welcome to Markdown Live Studio

Craft documentation, notes, and blog posts with **real-time live preview** and zero latency.

## ✨ Core Highlights:
- Live rendering with table and code block styling
- Export to \`.md\` or clean compiled \`HTML\`
- Quick formatting toolbars and cheat sheets

### 📊 Performance Table:
| Tool Module | Speed | Privacy |
| :--- | :---: | :---: |
| JSON Formatter | ⚡ Instant | 🔒 100% Local |
| QR Code Studio | ⚡ Instant | 🔒 100% Local |
| Hash Generator | ⚡ Instant | 🔒 100% Local |

> "Simplicity is prerequisite for reliability." — Edsger W. Dijkstra

\`\`\`typescript
interface UserProfile {
  id: string;
  name: string;
  role: 'developer' | 'designer';
}
\`\`\`
`;

  const [markdown, setMarkdown] = useState<string>(initialMarkdown);

  // Simple, robust client-side markdown to HTML renderer
  const renderMarkdownToHtml = (md: string): string => {
    let html = md
      // Escape basic HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks with syntax box
    html = html.replace(
      /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g,
      (_match, _lang, code) =>
        `<pre class="bg-slate-900 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto my-4 border border-slate-800"><code>${code.trim()}</code></pre>`
    );

    // Inline code
    html = html.replace(
      /`([^`]+)`/g,
      '<code class="px-1.5 py-0.5 text-xs font-mono bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800/60">$1</code>'
    );

    // Blockquotes
    html = html.replace(
      /^>\s+(.+)$/gm,
      '<blockquote class="border-s-4 border-indigo-500 ps-4 py-1.5 my-3 text-slate-700 dark:text-slate-300 italic bg-indigo-50/30 dark:bg-indigo-950/20 rounded-e-lg">$1</blockquote>'
    );

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-slate-900 dark:text-white mt-5 mb-3 pb-1 border-b border-slate-200 dark:border-slate-800">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 mb-4">$1</h1>');

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

    // Links
    html = html.replace(
      /\[(.*?)\]\((.*?)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-indigo-600 dark:text-indigo-400 underline hover:text-indigo-800">$1</a>'
    );

    // Unordered Lists
    html = html.replace(/^\s*-\s+(.*)$/gm, '<li class="ms-5 list-disc my-1 text-slate-700 dark:text-slate-300">$1</li>');

    // Tables (Simple markdown table parser)
    html = html.replace(
      /(?:^\|[^\n]+\|\r?\n(?:\|[ \t:-]+)+\|\r?\n(?:\|[^\n]+\|\r?\n?)+)/gm,
      match => {
        const lines = match.trim().split('\n');
        if (lines.length < 2) return match;
        const headers = lines[0]
          .split('|')
          .slice(1, -1)
          .map(h => `<th class="px-3 py-2 bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-start">${h.trim()}</th>`)
          .join('');

        const rows = lines.slice(2).map(row => {
          const cells = row
            .split('|')
            .slice(1, -1)
            .map(c => `<td class="px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">${c.trim()}</td>`)
            .join('');
          return `<tr>${cells}</tr>`;
        }).join('');

        return `<div class="overflow-x-auto my-4"><table class="w-full border-collapse border border-slate-200 dark:border-slate-700 rounded-lg"><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></div>`;
      }
    );

    // Paragraphs
    html = html.replace(/\n\n+/g, '</p><p class="my-3 text-slate-700 dark:text-slate-300 leading-relaxed">');

    return `<div class="markdown-body"><p class="my-3 text-slate-700 dark:text-slate-300 leading-relaxed">${html}</p></div>`;
  };

  const insertSnippet = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = markdown.substring(start, end) || 'text';
    const replacement = `${before}${selected}${after}`;

    const newMd = markdown.substring(0, start) + replacement + markdown.substring(end);
    setMarkdown(newMd);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 50);
  };

  const handleCopyHtml = () => {
    const rawHtml = renderMarkdownToHtml(markdown);
    navigator.clipboard.writeText(rawHtml);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const rendered = renderMarkdownToHtml(markdown);
    const fullHtml = `<!DOCTYPE html>
<html lang="${language}" dir="${language === 'ar' ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <title>Exported Markdown Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; color: #1e293b; }
    h1, h2, h3 { color: #0f172a; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; }
    th { background: #f1f5f9; }
    code { background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    blockquote { border-left: 4px solid #6366f1; margin: 0; padding-left: 16px; color: #475569; font-style: italic; }
  </style>
</head>
<body>
${rendered}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document_${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4" id="markdown-editor-tool">
      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Formatting Shortcuts */}
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertSnippet('## ')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="Heading"
          >
            <Heading className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('**', '**')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('*', '*')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('- ')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="List"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('> ')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('```typescript\n', '\n```')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertSnippet('[', '](https://example.com)')}
            className="p-1.5 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors"
            title="Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Action Downloads & Copy */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyHtml}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedHtml ? t('copied') : t('copyHtml')}
          </button>
          <button
            type="button"
            onClick={handleDownloadMd}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {t('downloadMd')}
          </button>
          <button
            type="button"
            onClick={handleDownloadHtml}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {t('downloadHtml')}
          </button>
        </div>
      </div>

      {/* Editor & Live Preview Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>{t('markdownInput')}</span>
            <button
              type="button"
              onClick={() => setMarkdown('')}
              className="text-slate-400 hover:text-red-500 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {t('clear')}
            </button>
          </div>
          <textarea
            id="markdown-textarea"
            value={markdown}
            onChange={e => setMarkdown(e.target.value)}
            className="w-full h-[450px] p-4 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Live Preview Box */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400">
            <span>{t('livePreview')}</span>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">● Live Output</span>
          </div>
          <div
            className="w-full h-[450px] p-5 overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs"
            dangerouslySetInnerHTML={{ __html: renderMarkdownToHtml(markdown) }}
          />
        </div>
      </div>
    </div>
  );
};
