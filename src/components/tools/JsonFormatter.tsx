import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Copy,
  Check,
  Download,
  CheckCircle2,
  AlertTriangle,
  FolderTree,
  Code2,
  Sparkles,
  RotateCcw,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

export const JsonFormatter: React.FC = () => {
  const { t, language } = useApp();
  const [inputJson, setInputJson] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [parsedObject, setParsedObject] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'raw' | 'tree'>('raw');
  const [copied, setCopied] = useState(false);

  const sampleJson = `{
  "platform": "Smart Digital Utility Hub",
  "version": 2.5,
  "isProductionReady": true,
  "languagesSupported": ["ar", "en", "fr", "es", "de", "tr"],
  "stats": {
    "totalTools": 15,
    "activeUsers": 48200,
    "satisfactionRate": 99.8
  },
  "features": [
    {
      "id": "qr-generator",
      "category": "media",
      "rating": 5.0
    },
    {
      "id": "json-validator",
      "category": "developer",
      "rating": 4.9
    }
  ]
}`;

  useEffect(() => {
    if (!inputJson.trim()) {
      setError(null);
      setParsedObject(null);
      return;
    }

    try {
      const parsed = JSON.parse(inputJson);
      setParsedObject(parsed);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Invalid JSON syntax');
      setParsedObject(null);
    }
  }, [inputJson]);

  const handleBeautify = (spaces: number = 2) => {
    try {
      if (!inputJson.trim()) return;
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed, null, spaces));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleMinify = () => {
    try {
      if (!inputJson.trim()) return;
      const parsed = JSON.parse(inputJson);
      setInputJson(JSON.stringify(parsed));
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleCopy = () => {
    if (!inputJson) return;
    navigator.clipboard.writeText(inputJson);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!inputJson) return;
    const blob = new Blob([inputJson], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Interactive Tree View Component
  const JsonTreeNode: React.FC<{ data: any; label?: string; isRoot?: boolean }> = ({
    data,
    label,
    isRoot,
  }) => {
    const [collapsed, setCollapsed] = useState(false);
    const isObject = typeof data === 'object' && data !== null;
    const isArray = Array.isArray(data);

    if (!isObject) {
      const isString = typeof data === 'string';
      const isNumber = typeof data === 'number';
      const isBoolean = typeof data === 'boolean';
      const isNull = data === null;

      return (
        <div className="flex items-center gap-1.5 py-0.5 ps-4 font-mono text-xs">
          {label && <span className="text-indigo-400 font-semibold">"{label}":</span>}
          {isString && <span className="text-emerald-400">"{data}"</span>}
          {isNumber && <span className="text-amber-400 font-bold">{data}</span>}
          {isBoolean && <span className="text-purple-400 font-bold">{String(data)}</span>}
          {isNull && <span className="text-slate-500 italic">null</span>}
        </div>
      );
    }

    const keys = Object.keys(data);

    return (
      <div className={`font-mono text-xs ${isRoot ? '' : 'ps-4 border-s border-slate-800/80 my-0.5'}`}>
        <div
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-1.5 py-0.5 text-slate-300 hover:text-white cursor-pointer select-none group"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400" />}
          {label && <span className="text-indigo-400 font-semibold">"{label}":</span>}
          <span className="text-slate-400 font-medium">
            {isArray ? `Array[${data.length}]` : `Object{${keys.length}}`}
          </span>
        </div>

        {!collapsed && (
          <div className="space-y-0.5">
            {keys.map(k => (
              <JsonTreeNode key={k} label={isArray ? undefined : k} data={data[k]} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4" id="json-formatter-tool">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleBeautify(2)}
            disabled={!inputJson || !!error}
            className="px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-lg transition-colors cursor-pointer"
          >
            {t('beautify')}
          </button>
          <button
            type="button"
            onClick={() => handleBeautify(4)}
            disabled={!inputJson || !!error}
            className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {t('beautify4')}
          </button>
          <button
            type="button"
            onClick={handleMinify}
            disabled={!inputJson || !!error}
            className="px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            {t('minify')}
          </button>
          <button
            type="button"
            onClick={() => setInputJson(sampleJson)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            {t('sample')}
          </button>
          <button
            type="button"
            onClick={() => setInputJson('')}
            disabled={!inputJson}
            className="p-1.5 text-slate-500 hover:text-red-500 disabled:opacity-30 cursor-pointer"
            title={t('clear')}
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* View Mode & Copy/Download */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setViewMode('raw')}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'raw' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              {t('rawView')}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('tree')}
              disabled={!parsedObject}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                viewMode === 'tree' ? 'bg-indigo-600 text-white' : 'text-slate-600 dark:text-slate-400 disabled:opacity-40'
              }`}
            >
              <FolderTree className="w-3.5 h-3.5" />
              {t('treeView')}
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!inputJson}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg disabled:opacity-40 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t('copied') : t('copy')}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            disabled={!inputJson || !!error}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg disabled:opacity-40 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {t('download')}
          </button>
        </div>
      </div>

      {/* Validation Status Banner */}
      {inputJson.trim() && (
        <div>
          {error ? (
            <div className="flex items-center gap-2 p-3 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl">
              <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="font-mono">{t('invalidJson')}{error}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>{t('validJson')}</span>
            </div>
          )}
        </div>
      )}

      {/* Main Body: Raw or Tree */}
      <div className="relative">
        {viewMode === 'raw' ? (
          <textarea
            value={inputJson}
            onChange={e => setInputJson(e.target.value)}
            placeholder={language === 'ar' ? 'الصق كود JSON هنا لتنسيقه وتدقيقه...' : 'Paste raw JSON code here to beautify, minify, and validate...'}
            className="w-full h-[450px] p-4 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-y"
          />
        ) : (
          <div className="w-full h-[450px] p-4 overflow-y-auto bg-slate-950 border border-slate-800 rounded-xl text-slate-100">
            {parsedObject ? (
              <JsonTreeNode data={parsedObject} isRoot />
            ) : (
              <p className="text-xs text-slate-500">{language === 'ar' ? 'لا يوجد كائن صالح للعرض' : 'No valid object to inspect'}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
