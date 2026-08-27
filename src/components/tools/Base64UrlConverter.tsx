import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Check, Upload, RotateCcw, ArrowUpDown, FileText, Sparkles } from 'lucide-react';

type Mode = 'encode' | 'decode';
type FormatType = 'base64' | 'url' | 'hex' | 'binary';

export const Base64UrlConverter: React.FC = () => {
  const { t, language } = useApp();
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [mode, setMode] = useState<Mode>('encode');
  const [format, setFormat] = useState<FormatType>('base64');
  const [copied, setCopied] = useState(false);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Unicode safe Base64 encoder/decoder
  const utf8ToBase64 = (str: string) => {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      })
    );
  };

  const base64ToUtf8 = (str: string) => {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), (c: string) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  };

  const textToHex = (str: string) => {
    let hex = '';
    for (let i = 0; i < str.length; i++) {
      hex += str.charCodeAt(i).toString(16).padStart(2, '0') + ' ';
    }
    return hex.trim();
  };

  const hexToText = (hex: string) => {
    const cleanHex = hex.replace(/[^0-9A-Fa-f]/g, '');
    let str = '';
    for (let i = 0; i < cleanHex.length; i += 2) {
      str += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
    }
    return str;
  };

  const textToBinary = (str: string) => {
    return str
      .split('')
      .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
      .join(' ');
  };

  const binaryToText = (bin: string) => {
    const cleanBin = bin.trim().split(/\s+/);
    return cleanBin.map(b => String.fromCharCode(parseInt(b, 2))).join('');
  };

  // Run conversion
  useEffect(() => {
    setError(null);
    if (!input) {
      setOutput('');
      return;
    }

    try {
      if (mode === 'encode') {
        switch (format) {
          case 'base64':
            setOutput(utf8ToBase64(input));
            break;
          case 'url':
            setOutput(encodeURIComponent(input));
            break;
          case 'hex':
            setOutput(textToHex(input));
            break;
          case 'binary':
            setOutput(textToBinary(input));
            break;
        }
      } else {
        // Decode
        switch (format) {
          case 'base64':
            setOutput(base64ToUtf8(input.trim()));
            break;
          case 'url':
            setOutput(decodeURIComponent(input.trim()));
            break;
          case 'hex':
            setOutput(hexToText(input.trim()));
            break;
          case 'binary':
            setOutput(binaryToText(input.trim()));
            break;
        }
      }
    } catch (err: any) {
      setError(language === 'ar' ? 'صيغة الإدخال غير صالحة لفك الترميز' : (err.message || 'Invalid input format for decoding'));
      setOutput('');
    }
  }, [input, mode, format, language]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileInfo({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + ' KB',
    });

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setMode('encode');
      setFormat('base64');
      setInput(`[File: ${file.name}]`);
      setOutput(result);
    };
    reader.readAsDataURL(file);
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setMode(mode === 'encode' ? 'decode' : 'encode');
  };

  return (
    <div className="space-y-6" id="base64-converter-tool">
      {/* Configuration Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        {/* Mode switcher: Encode / Decode */}
        <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMode('encode')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              mode === 'encode'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('encode')}
          </button>
          <button
            type="button"
            onClick={() => setMode('decode')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
              mode === 'decode'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
            }`}
          >
            {t('decode')}
          </button>
        </div>

        {/* Formats Selection */}
        <div className="flex flex-wrap items-center gap-1.5">
          {(['base64', 'url', 'hex', 'binary'] as FormatType[]).map(fmt => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormat(fmt)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg uppercase tracking-wider transition-all cursor-pointer ${
                format === fmt
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setInput(language === 'ar' ? 'مرحبا بكم في منصة الأدوات الرقمية المتكاملة!' : 'Welcome to the Digital Utility Tools Suite!');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            {t('sample')}
          </button>
          <button
            type="button"
            onClick={() => { setInput(''); setOutput(''); setFileInfo(null); }}
            disabled={!input}
            className="p-1.5 text-slate-500 hover:text-red-500 transition-colors disabled:opacity-30 cursor-pointer"
            title={t('clear')}
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Inputs / Output Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{t('input')} ({mode === 'encode' ? (language === 'ar' ? 'نص عادي' : 'Plain Text') : format.toUpperCase()})</span>
            <span className="text-slate-400 font-normal">{input.length} {t('charsCount')}</span>
          </div>

          <textarea
            value={input}
            onChange={e => {
              setFileInfo(null);
              setInput(e.target.value);
            }}
            placeholder={
              mode === 'encode'
                ? (language === 'ar' ? 'اكتب أو الصق النص هنا للترميز...' : 'Type or paste plain text to encode...')
                : (language === 'ar' ? 'الصق نص Base64 أو URL أو Hex هنا لفك الترميز...' : `Paste ${format.toUpperCase()} encoded string here to decode...`)
            }
            className="w-full h-52 p-3.5 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-y"
          />

          {/* File Upload to Base64 */}
          <label className="flex items-center justify-center gap-2 p-3 bg-slate-50 dark:bg-slate-900/40 border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 rounded-xl cursor-pointer transition-colors group">
            <Upload className="w-4 h-4 text-slate-500 group-hover:text-indigo-500" />
            <span className="text-xs text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-medium">
              {fileInfo ? `${fileInfo.name} (${fileInfo.size})` : t('uploadFileToConvert')}
            </span>
            <input type="file" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* Output Block */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{t('output')} ({mode === 'encode' ? format.toUpperCase() : (language === 'ar' ? 'نص عادي مفكوك' : 'Decoded Text')})</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSwap}
                disabled={!output}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline disabled:opacity-40"
              >
                <ArrowUpDown className="w-3 h-3" />
                {language === 'ar' ? 'استخدام كمدخل' : 'Use as Input'}
              </button>
              <span className="text-slate-400 font-normal">{output.length} {t('charsCount')}</span>
            </div>
          </div>

          <div className="relative">
            <textarea
              readOnly
              value={output}
              placeholder={language === 'ar' ? 'ستظهر النتيجة المحولة هنا فوراً...' : 'Converted output will appear here instantly...'}
              className="w-full h-52 p-3.5 text-sm font-mono bg-slate-50 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-800 rounded-xl outline-none text-slate-800 dark:text-slate-200 resize-y"
            />
            {output && (
              <button
                type="button"
                onClick={handleCopy}
                className="absolute top-3 end-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-all cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t('copied') : t('copy')}
              </button>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-xl">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
