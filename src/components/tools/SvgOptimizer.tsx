import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Check, Download, Sparkles, Code, Image as ImageIcon, RotateCcw } from 'lucide-react';

export const SvgOptimizer: React.FC = () => {
  const { t, language } = useApp();

  const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 100" fill="none">
  <!-- Generator: Digital Studio Tools 2026 -->
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#a855f7;stop-opacity:1" />
    </linearGradient>
  </defs>
  <circle cx="50" cy="50" r="45" fill="url(#grad1)" stroke="#ffffff" stroke-width="2" />
  <path d="M35 50 L45 60 L68 35" stroke="#ffffff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
</svg>`;

  const [inputSvg, setInputSvg] = useState<string>(sampleSvg);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [bgPattern, setBgPattern] = useState<'checker' | 'white' | 'dark'>('checker');

  // SVG Optimization Logic
  const { optimizedSvg, originalBytes, optimizedBytes, savingsPercent } = useMemo(() => {
    if (!inputSvg.trim()) {
      return { optimizedSvg: '', originalBytes: 0, optimizedBytes: 0, savingsPercent: 0 };
    }

    const origBytes = new Blob([inputSvg]).size;

    let opt = inputSvg
      // Remove XML prologue
      .replace(/<\?xml[\s\S]*?\?>/gi, '')
      // Remove doctype
      .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
      // Remove HTML/XML comments
      .replace(/<!--[\s\S]*?-->/g, '')
      // Remove redundant metadata
      .replace(/<metadata[\s\S]*?<\/metadata>/gi, '')
      // Remove data-* and sketch attributes
      .replace(/\s*data-[a-zA-Z0-9_-]+="[^"]*"/gi, '')
      .replace(/\s*sketch:[a-zA-Z0-9_-]+="[^"]*"/gi, '')
      // Clean multiple spaces and newlines
      .replace(/\s{2,}/g, ' ')
      .replace(/>\s+</g, '><')
      .trim();

    const optBytes = new Blob([opt]).size;
    const savings = origBytes > 0 ? Math.round(((origBytes - optBytes) / origBytes) * 100) : 0;

    return {
      optimizedSvg: opt,
      originalBytes: origBytes,
      optimizedBytes: optBytes,
      savingsPercent: Math.max(0, savings),
    };
  }, [inputSvg]);

  // Conversions for copying
  const dataUri = useMemo(() => {
    if (!optimizedSvg) return '';
    return `data:image/svg+xml;utf8,${encodeURIComponent(optimizedSvg)}`;
  }, [optimizedSvg]);

  const reactJsx = useMemo(() => {
    if (!optimizedSvg) return '';
    const jsx = optimizedSvg
      .replace(/stroke-width/g, 'strokeWidth')
      .replace(/stroke-linecap/g, 'strokeLinecap')
      .replace(/stroke-linejoin/g, 'strokeLinejoin')
      .replace(/fill-rule/g, 'fillRule')
      .replace(/clip-rule/g, 'clipRule')
      .replace(/class=/g, 'className=');

    return `export const SvgIcon = (props: React.SVGProps<SVGSVGElement>) => (\n  ${jsx}\n);`;
  }, [optimizedSvg]);

  const handleCopy = (key: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadSvg = () => {
    if (!optimizedSvg) return;
    const blob = new Blob([optimizedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `optimized_${Date.now()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInputSvg(reader.result as string);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6" id="svg-optimizer-tool">
      {/* Top Action & Metrics Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div>
            <span className="text-slate-500">{t('originalSize')}: </span>
            <span className="text-slate-800 dark:text-slate-200 font-bold">{originalBytes} B</span>
          </div>
          <span className="text-indigo-400">➔</span>
          <div>
            <span className="text-slate-500">{t('compressedSize')}: </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{optimizedBytes} B</span>
          </div>
          {savingsPercent > 0 && (
            <span className="px-2.5 py-0.5 bg-emerald-500 text-white text-xs font-extrabold rounded-lg">
              -{savingsPercent}%
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg cursor-pointer transition-colors shadow-2xs">
            {language === 'ar' ? 'رفع ملف SVG' : 'Upload SVG'}
            <input type="file" accept=".svg,image/svg+xml" onChange={handleFileUpload} className="hidden" />
          </label>
          <button
            type="button"
            onClick={() => setInputSvg(sampleSvg)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            {t('sample')}
          </button>
          <button
            type="button"
            onClick={handleDownloadSvg}
            disabled={!optimizedSvg}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            {t('download')}
          </button>
        </div>
      </div>

      {/* Main Workspace Split: Code vs Live Render */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Code Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'كود SVG الأصلي أو المحسن' : 'Raw SVG Code'}</span>
            <button
              type="button"
              onClick={() => setInputSvg('')}
              className="text-slate-400 hover:text-red-500 inline-flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              {t('clear')}
            </button>
          </div>
          <textarea
            value={inputSvg}
            onChange={e => setInputSvg(e.target.value)}
            placeholder="<svg ...>...</svg>"
            className="w-full h-80 p-3.5 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
          />
        </div>

        {/* Live Visual Render & Background Picker (5 cols) */}
        <div className="lg:col-span-5 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'المعاينة البصرية المباشرة' : 'Live Visual Preview'}</span>
            {/* Background Style Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-md">
              <button
                type="button"
                onClick={() => setBgPattern('checker')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${bgPattern === 'checker' ? 'bg-white dark:bg-slate-700 shadow-2xs' : 'text-slate-500'}`}
              >
                Pattern
              </button>
              <button
                type="button"
                onClick={() => setBgPattern('white')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${bgPattern === 'white' ? 'bg-white text-black shadow-2xs' : 'text-slate-500'}`}
              >
                Light
              </button>
              <button
                type="button"
                onClick={() => setBgPattern('dark')}
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${bgPattern === 'dark' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-500'}`}
              >
                Dark
              </button>
            </div>
          </div>

          <div
            className={`w-full h-80 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-6 overflow-hidden ${
              bgPattern === 'checker'
                ? 'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#334155_1px,transparent_1px)]'
                : bgPattern === 'white'
                ? 'bg-white'
                : 'bg-slate-950'
            }`}
          >
            {optimizedSvg ? (
              <div
                className="max-h-full max-w-full flex items-center justify-center [&>svg]:max-h-64 [&>svg]:max-w-full"
                dangerouslySetInnerHTML={{ __html: optimizedSvg }}
              />
            ) : (
              <div className="text-slate-400 text-xs flex flex-col items-center gap-2">
                <ImageIcon className="w-8 h-8 opacity-40" />
                <span>{language === 'ar' ? 'لا يوجد كود SVG لعرضه' : 'No SVG code to preview'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Copy Quick Exports Strip */}
      {optimizedSvg && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => handleCopy('svg', optimizedSvg)}
            className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-start flex items-center justify-between transition-colors cursor-pointer shadow-2xs"
          >
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{language === 'ar' ? 'نسخ كود SVG المحسن' : 'Copy Clean SVG'}</span>
              <span className="text-[10px] text-slate-400">Minified XML format</span>
            </div>
            {copiedKey === 'svg' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleCopy('data-uri', dataUri)}
            className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-start flex items-center justify-between transition-colors cursor-pointer shadow-2xs"
          >
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{language === 'ar' ? 'نسخ Data URI' : 'Copy Data URI'}</span>
              <span className="text-[10px] text-slate-400">data:image/svg+xml...</span>
            </div>
            {copiedKey === 'data-uri' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleCopy('react-jsx', reactJsx)}
            className="p-3 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-start flex items-center justify-between transition-colors cursor-pointer shadow-2xs"
          >
            <div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">{language === 'ar' ? 'نسخ كـ React JSX' : 'Copy React Component'}</span>
              <span className="text-[10px] text-slate-400">JSX camelCase format</span>
            </div>
            {copiedKey === 'react-jsx' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
          </button>
        </div>
      )}
    </div>
  );
};
