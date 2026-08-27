import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeftRight, Check, Sparkles, Layers, Columns, RotateCcw } from 'lucide-react';

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'modified';
  oldLine?: string;
  newLine?: string;
  oldNum?: number;
  newNum?: number;
}

export const TextDiff: React.FC = () => {
  const { t, language } = useApp();
  const [original, setOriginal] = useState<string>('');
  const [modified, setModified] = useState<string>('');
  const [viewMode, setViewMode] = useState<'side' | 'unified'>('side');

  const sampleDiffs = {
    ar: {
      orig: `منصة الأدوات الرقمية الإصدار 1.0\n- دعم التحويل البسيط\n- أداة توليد كلمات المرور\n- واجهة باللغة الإنجليزية فقط\n- حفظ في الذاكرة المؤقتة`,
      mod: `منصة الأدوات الرقمية الإصدار 2.0 المحدث\n- دعم التحويل المتقدم لجميع الوحدات\n- أداة توليد كلمات المرور وفحص الأمان\n- دعم 6 لغات عالمية مع واجهة عربية RTL كاملة\n- حفظ في التخزين المحلي الآمن\n- أداة الذكاء الاصطناعي السريعة`,
    },
    en: {
      orig: `function calculateTotal(items) {\n  let total = 0;\n  for (let i = 0; i < items.length; i++) {\n    total += items[i].price;\n  }\n  return total;\n}`,
      mod: `function calculateTotal(items, discount = 0) {\n  // Optimized using reduce with discount\n  const rawTotal = items.reduce((sum, item) => sum + item.price, 0);\n  const discountAmount = (rawTotal * discount) / 100;\n  return Math.max(0, rawTotal - discountAmount);\n}`,
    },
  };

  const loadSample = () => {
    const sample = language === 'ar' ? sampleDiffs.ar : sampleDiffs.en;
    setOriginal(sample.orig);
    setModified(sample.mod);
  };

  const swapTexts = () => {
    setOriginal(modified);
    setModified(original);
  };

  const diffResult = useMemo(() => {
    const origLines = original.split('\n');
    const modLines = modified.split('\n');
    const maxLines = Math.max(origLines.length, modLines.length);

    let addedCount = 0;
    let removedCount = 0;
    let unchangedCount = 0;
    const lines: DiffLine[] = [];

    // Simple line by line matching algorithm with lookahead
    for (let i = 0; i < maxLines; i++) {
      const o = origLines[i];
      const m = modLines[i];

      if (o === undefined && m !== undefined) {
        lines.push({ type: 'added', newLine: m, newNum: i + 1 });
        addedCount++;
      } else if (m === undefined && o !== undefined) {
        lines.push({ type: 'removed', oldLine: o, oldNum: i + 1 });
        removedCount++;
      } else if (o === m) {
        lines.push({ type: 'unchanged', oldLine: o, newLine: m, oldNum: i + 1, newNum: i + 1 });
        unchangedCount++;
      } else {
        lines.push({ type: 'modified', oldLine: o, newLine: m, oldNum: i + 1, newNum: i + 1 });
        addedCount++;
        removedCount++;
      }
    }

    const isIdentical = original === modified && original.trim() !== '';

    return { lines, addedCount, removedCount, unchangedCount, isIdentical };
  }, [original, modified]);

  return (
    <div className="space-y-6" id="text-diff-tool">
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadSample}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            {t('sample')}
          </button>
          <button
            type="button"
            onClick={swapTexts}
            disabled={!original && !modified}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-40"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            {language === 'ar' ? 'تبديل النصوص' : 'Swap'}
          </button>
          <button
            type="button"
            onClick={() => { setOriginal(''); setModified(''); }}
            disabled={!original && !modified}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors cursor-pointer disabled:opacity-40"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            {t('clear')}
          </button>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setViewMode('side')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'side'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            {t('diffSideBySide')}
          </button>
          <button
            type="button"
            onClick={() => setViewMode('unified')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md transition-all ${
              viewMode === 'unified'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            {t('diffUnified')}
          </button>
        </div>
      </div>

      {/* Input Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>{t('originalText')}</span>
            <span className="text-2xl font-mono text-slate-400 text-xs font-normal">{original.length} {t('charsCount')}</span>
          </label>
          <textarea
            value={original}
            onChange={e => setOriginal(e.target.value)}
            placeholder={language === 'ar' ? 'ألصق النص الأصلي هنا...' : 'Paste original text here...'}
            className="w-full h-44 p-3 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-y"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 flex items-center justify-between">
            <span>{t('modifiedText')}</span>
            <span className="text-2xl font-mono text-slate-400 text-xs font-normal">{modified.length} {t('charsCount')}</span>
          </label>
          <textarea
            value={modified}
            onChange={e => setModified(e.target.value)}
            placeholder={language === 'ar' ? 'ألصق النص الجديد / المعدل هنا...' : 'Paste modified text here...'}
            className="w-full h-44 p-3 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-y"
          />
        </div>
      </div>

      {/* Stats Summary */}
      {(original || modified) && (
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium">
          {diffResult.isIdentical ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <Check className="w-4 h-4" />
              {t('noDiffs')}
            </div>
          ) : (
            <>
              <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 rounded-md">
                + {diffResult.addedCount} {language === 'ar' ? 'إضافة / تعديل' : 'Added / Changed'}
              </span>
              <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 rounded-md">
                - {diffResult.removedCount} {language === 'ar' ? 'حذف' : 'Removed'}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md">
                = {diffResult.unchangedCount} {language === 'ar' ? 'مطابق' : 'Unchanged'}
              </span>
            </>
          )}
        </div>
      )}

      {/* Diff Output Viewer */}
      {(original || modified) && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-slate-900 text-slate-100 font-mono text-xs shadow-md">
          <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
            <span className="font-semibold text-slate-300">{t('result')}</span>
            <span>{diffResult.lines.length} {language === 'ar' ? 'سطر تم تحليله' : 'lines analyzed'}</span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-96 overflow-y-auto">
            {viewMode === 'side' ? (
              <div className="grid grid-cols-2 divide-x divide-slate-800 divide-x-reverse">
                {/* Left (Original) */}
                <div className="p-2 space-y-0.5">
                  {diffResult.lines.map((line, idx) => (
                    <div
                      key={`orig-${idx}`}
                      className={`flex items-start px-2 py-0.5 rounded ${
                        line.type === 'removed'
                          ? 'bg-rose-950/60 text-rose-300 border-l-2 border-rose-500'
                          : line.type === 'modified'
                          ? 'bg-amber-950/40 text-amber-300 border-l-2 border-amber-500'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="w-8 select-none text-slate-600 text-[10px]">{line.oldNum || ''}</span>
                      <span className="flex-1 whitespace-pre-wrap break-all">{line.oldLine ?? ' '}</span>
                    </div>
                  ))}
                </div>

                {/* Right (Modified) */}
                <div className="p-2 space-y-0.5">
                  {diffResult.lines.map((line, idx) => (
                    <div
                      key={`mod-${idx}`}
                      className={`flex items-start px-2 py-0.5 rounded ${
                        line.type === 'added'
                          ? 'bg-emerald-950/60 text-emerald-300 border-l-2 border-emerald-500'
                          : line.type === 'modified'
                          ? 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500'
                          : 'text-slate-300'
                      }`}
                    >
                      <span className="w-8 select-none text-slate-600 text-[10px]">{line.newNum || ''}</span>
                      <span className="flex-1 whitespace-pre-wrap break-all">{line.newLine ?? ' '}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Unified View */
              <div className="p-2 space-y-0.5">
                {diffResult.lines.map((line, idx) => (
                  <div key={`uni-${idx}`} className="space-y-0.5">
                    {line.type === 'removed' && (
                      <div className="flex items-start px-2 py-0.5 bg-rose-950/60 text-rose-300 rounded">
                        <span className="w-6 text-rose-500 select-none">-</span>
                        <span className="w-8 select-none text-slate-600 text-[10px]">{line.oldNum}</span>
                        <span className="flex-1 whitespace-pre-wrap break-all">{line.oldLine}</span>
                      </div>
                    )}
                    {line.type === 'added' && (
                      <div className="flex items-start px-2 py-0.5 bg-emerald-950/60 text-emerald-300 rounded">
                        <span className="w-6 text-emerald-500 select-none">+</span>
                        <span className="w-8 select-none text-slate-600 text-[10px]">{line.newNum}</span>
                        <span className="flex-1 whitespace-pre-wrap break-all">{line.newLine}</span>
                      </div>
                    )}
                    {line.type === 'modified' && (
                      <>
                        <div className="flex items-start px-2 py-0.5 bg-rose-950/60 text-rose-300 rounded">
                          <span className="w-6 text-rose-500 select-none">-</span>
                          <span className="w-8 select-none text-slate-600 text-[10px]">{line.oldNum}</span>
                          <span className="flex-1 whitespace-pre-wrap break-all">{line.oldLine}</span>
                        </div>
                        <div className="flex items-start px-2 py-0.5 bg-emerald-950/60 text-emerald-300 rounded">
                          <span className="w-6 text-emerald-500 select-none">+</span>
                          <span className="w-8 select-none text-slate-600 text-[10px]">{line.newNum}</span>
                          <span className="flex-1 whitespace-pre-wrap break-all">{line.newLine}</span>
                        </div>
                      </>
                    )}
                    {line.type === 'unchanged' && (
                      <div className="flex items-start px-2 py-0.5 text-slate-400">
                        <span className="w-6 text-slate-600 select-none"> </span>
                        <span className="w-8 select-none text-slate-600 text-[10px]">{line.newNum}</span>
                        <span className="flex-1 whitespace-pre-wrap break-all">{line.newLine}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
