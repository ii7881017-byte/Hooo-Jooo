import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Check, RefreshCw, Download, FileText, Sparkles, Layers } from 'lucide-react';

type IdType = 'uuid-v4' | 'uuid-v1' | 'nanoid' | 'short-id';

export const UuidGenerator: React.FC = () => {
  const { t, language } = useApp();
  const [idType, setIdType] = useState<IdType>('uuid-v4');
  const [quantity, setQuantity] = useState<number>(5);
  const [includeHyphens, setIncludeHyphens] = useState<boolean>(true);
  const [isUppercase, setIsUppercase] = useState<boolean>(false);
  const [prefix, setPrefix] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [generatedIds, setGeneratedIds] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Simple pure JS UUID & ID Generators
  const generateSingleId = (): string => {
    let result = '';

    if (idType === 'uuid-v4') {
      result = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    } else if (idType === 'uuid-v1') {
      // Mock timestamp based pseudo UUID v1
      const now = Date.now().toString(16).padStart(12, '0');
      result = `${now.slice(0, 8)}-${now.slice(8, 12)}-1xxx-8xxx-xxxxxxxxxxxx`.replace(/x/g, () =>
        ((Math.random() * 16) | 0).toString(16)
      );
    } else if (idType === 'nanoid') {
      const urlAlphabet = 'useandom-26T1983_40STFnvecRytZHighlight_0157';
      let id = '';
      for (let i = 0; i < 21; i++) {
        id += urlAlphabet[(Math.random() * urlAlphabet.length) | 0];
      }
      result = id;
    } else if (idType === 'short-id') {
      const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let id = '';
      for (let i = 0; i < 8; i++) {
        id += chars[(Math.random() * chars.length) | 0];
      }
      result = id;
    }

    if (!includeHyphens && (idType === 'uuid-v4' || idType === 'uuid-v1')) {
      result = result.replace(/-/g, '');
    }

    if (isUppercase) {
      result = result.toUpperCase();
    } else {
      result = result.toLowerCase();
    }

    if (prefix) result = `${prefix}${result}`;
    if (suffix) result = `${result}${suffix}`;

    return result;
  };

  const generateBatch = () => {
    const list: string[] = [];
    const count = Math.min(500, Math.max(1, quantity));
    for (let i = 0; i < count; i++) {
      list.push(generateSingleId());
    }
    setGeneratedIds(list);
  };

  useEffect(() => {
    generateBatch();
  }, [idType, quantity, includeHyphens, isUppercase, prefix, suffix]);

  const handleCopyAll = () => {
    navigator.clipboard.writeText(generatedIds.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleCopySingle = (id: string, index: number) => {
    navigator.clipboard.writeText(id);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([generatedIds.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(generatedIds, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `uuids_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6" id="uuid-generator-tool">
      {/* Top Configuration & Options Bar */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        {/* ID Type Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: 'uuid-v4', label: 'UUID v4 (Random RFC4122)' },
            { id: 'uuid-v1', label: 'UUID v1 (Timestamp-based)' },
            { id: 'nanoid', label: 'NanoID (21 chars URL-safe)' },
            { id: 'short-id', label: 'Short ID (8 chars)' },
          ].map(item => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIdType(item.id as IdType)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                idType === item.id
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Filters and Controls Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          {/* Quantity */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{language === 'ar' ? 'الكمية المطلوبة' : 'Quantity'}</span>
              <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{quantity}</span>
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={e => setQuantity(Number(e.target.value))}
              className="w-full p-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
            />
          </div>

          {/* Prefix */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{language === 'ar' ? 'البادئة (Prefix)' : 'Prefix (e.g. usr_)'}</label>
            <input
              type="text"
              value={prefix}
              onChange={e => setPrefix(e.target.value)}
              placeholder="usr_"
              className="w-full p-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
            />
          </div>

          {/* Suffix */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{language === 'ar' ? 'اللاحقة (Suffix)' : 'Suffix'}</label>
            <input
              type="text"
              value={suffix}
              onChange={e => setSuffix(e.target.value)}
              placeholder="_v1"
              className="w-full p-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg outline-none"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2 flex flex-col justify-end">
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeHyphens}
                onChange={e => setIncludeHyphens(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
              />
              <span>{language === 'ar' ? 'تضمين الفواصل (-)' : 'Include Hyphens'}</span>
            </label>
            <label className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={isUppercase}
                onChange={e => setIsUppercase(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 accent-indigo-600"
              />
              <span>{language === 'ar' ? 'أحرف كبيرة (Uppercase)' : 'Uppercase'}</span>
            </label>
          </div>
        </div>
      </div>

      {/* Generated Results Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {language === 'ar' ? 'المعرفات المولدة' : 'Generated Identifiers'} ({generatedIds.length})
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={generateBatch}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {language === 'ar' ? 'إعادة التوليد' : 'Regenerate'}
            </button>
            <button
              type="button"
              onClick={handleCopyAll}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors cursor-pointer"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedAll ? t('copied') : (language === 'ar' ? 'نسخ الكل' : 'Copy All')}
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              .TXT
            </button>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              .JSON
            </button>
          </div>
        </div>

        {/* List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-xs">
          {generatedIds.map((id, idx) => (
            <div
              key={idx}
              className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 group"
            >
              <div className="flex items-center gap-3">
                <span className="text-slate-400 select-none text-[11px]">#{idx + 1}</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold select-all break-all">{id}</span>
              </div>
              <button
                type="button"
                onClick={() => handleCopySingle(id, idx)}
                className="p-1.5 text-slate-400 hover:text-indigo-600 cursor-pointer transition-colors"
                title={t('copy')}
              >
                {copiedIndex === idx ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
