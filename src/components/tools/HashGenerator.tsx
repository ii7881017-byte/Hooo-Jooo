import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Check, Shield, Key, FileCheck, Sparkles, RotateCcw } from 'lucide-react';

export const HashGenerator: React.FC = () => {
  const { t, language } = useApp();
  const [inputText, setInputText] = useState<string>('Smart Digital Utility Hub 2026');
  const [secretKey, setSecretKey] = useState<string>('');
  const [hashes, setHashes] = useState<{ [key: string]: string }>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [fileHash, setFileHash] = useState<{ name: string; size: string; sha256: string } | null>(null);

  // MD5 simple pure JS implementation
  const md5 = (string: string): string => {
    function md5cycle(x: number[], k: number[]) {
      let a = x[0], b = x[1], c = x[2], d = x[3];
      a = ff(a, b, c, d, k[0], 7, -680876936);
      d = ff(d, a, b, c, k[1], 12, -389564586);
      c = ff(c, d, a, b, k[2], 17, 606105819);
      b = ff(b, c, d, a, k[3], 22, -1044525330);
      a = ff(a, b, c, d, k[4], 7, -176418897);
      d = ff(d, a, b, c, k[5], 12, 1200080426);
      c = ff(c, d, a, b, k[6], 17, -1473231341);
      b = ff(b, c, d, a, k[7], 22, -45705983);
      a = ff(a, b, c, d, k[8], 7, 1770035416);
      d = ff(d, a, b, c, k[9], 12, -1958414417);
      c = ff(c, d, a, b, k[10], 17, -42063);
      b = ff(b, c, d, a, k[11], 22, -1990404162);
      a = ff(a, b, c, d, k[12], 7, 1804603682);
      d = ff(d, a, b, c, k[13], 12, -40341101);
      c = ff(c, d, a, b, k[14], 17, -1502002290);
      b = ff(b, c, d, a, k[15], 22, 1236535329);

      a = gg(a, b, c, d, k[1], 5, -165796510);
      d = gg(d, a, b, c, k[6], 9, -1069501632);
      c = gg(c, d, a, b, k[11], 14, 643717713);
      b = gg(b, c, d, a, k[0], 20, -373897302);
      a = gg(a, b, c, d, k[5], 5, -701558691);
      d = gg(d, a, b, c, k[10], 9, 38016083);
      c = gg(c, d, a, b, k[15], 14, -660478335);
      b = gg(b, c, d, a, k[4], 20, -405537848);
      a = gg(a, b, c, d, k[9], 5, 568446438);
      d = gg(d, a, b, c, k[14], 9, -1019803690);
      c = gg(c, d, a, b, k[3], 14, -187363961);
      b = gg(b, c, d, a, k[8], 20, 1163531501);
      a = gg(a, b, c, d, k[13], 5, -1444681467);
      d = gg(d, a, b, c, k[2], 9, -51403784);
      c = gg(c, d, a, b, k[7], 14, 1735328473);
      b = gg(b, c, d, a, k[12], 20, -1926607734);

      a = hh(a, b, c, d, k[5], 4, -378558);
      d = hh(d, a, b, c, k[8], 11, -2022574463);
      c = hh(c, d, a, b, k[11], 16, 1839030562);
      b = hh(b, c, d, a, k[14], 23, -35309556);
      a = hh(a, b, c, d, k[1], 4, -1530992060);
      d = hh(d, a, b, c, k[4], 11, 1272893353);
      c = hh(c, d, a, b, k[7], 16, -155497632);
      b = hh(b, c, d, a, k[10], 23, -1094730640);
      a = hh(a, b, c, d, k[13], 4, 681279174);
      d = hh(d, a, b, c, k[0], 11, -358537222);
      c = hh(c, d, a, b, k[3], 16, -722521979);
      b = hh(b, c, d, a, k[6], 23, 76029189);
      a = hh(a, b, c, d, k[9], 4, -640364487);
      d = hh(d, a, b, c, k[12], 11, -421815835);
      c = hh(c, d, a, b, k[15], 16, 530742520);
      b = hh(b, c, d, a, k[2], 23, -995338651);

      a = ii(a, b, c, d, k[0], 6, -198630844);
      d = ii(d, a, b, c, k[7], 10, 1126891415);
      c = ii(c, d, a, b, k[14], 15, -1416354905);
      b = ii(b, c, d, a, k[5], 21, -57434055);
      a = ii(a, b, c, d, k[12], 6, 1700485571);
      d = ii(d, a, b, c, k[3], 10, -1894986606);
      c = ii(c, d, a, b, k[10], 15, -1051523);
      b = ii(b, c, d, a, k[1], 21, -2054922799);
      a = ii(a, b, c, d, k[8], 6, 1873313359);
      d = ii(d, a, b, c, k[15], 10, -30611744);
      c = ii(c, d, a, b, k[6], 15, -1560198380);
      b = ii(b, c, d, a, k[13], 21, 1309151649);
      a = ii(a, b, c, d, k[4], 6, -145523070);
      d = ii(d, a, b, c, k[11], 10, -1120210379);
      c = ii(c, d, a, b, k[2], 15, 718787259);
      b = ii(b, c, d, a, k[9], 21, -343485551);

      x[0] = add32(a, x[0]);
      x[1] = add32(b, x[1]);
      x[2] = add32(c, x[2]);
      x[3] = add32(d, x[3]);
    }
    function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
      a = add32(add32(a, q), add32(x, t));
      return add32((a << s) | (a >>> (32 - s)), b);
    }
    function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn((b & c) | (~b & d), a, b, x, s, t);
    }
    function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn((b & d) | (c & ~d), a, b, x, s, t);
    }
    function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn(b ^ c ^ d, a, b, x, s, t);
    }
    function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) {
      return cmn(c ^ (b | ~d), a, b, x, s, t);
    }
    function add32(a: number, b: number) {
      return (a + b) & 0xffffffff;
    }
    function md51(s: string) {
      const n = s.length;
      const state = [1732584193, -271733879, -1732584194, 271733878];
      let i: number;
      for (i = 64; i <= s.length; i += 64) {
        md5cycle(state, md5blk(s.substring(i - 64, i)));
      }
      s = s.substring(i - 64);
      const tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      for (i = 0; i < s.length; i++) tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
      tail[i >> 2] |= 0x80 << ((i % 4) << 3);
      if (i > 55) {
        md5cycle(state, tail);
        for (i = 0; i < 16; i++) tail[i] = 0;
      }
      tail[14] = n * 8;
      md5cycle(state, tail);
      return state;
    }
    function md5blk(s: string) {
      const md5blks: number[] = [];
      for (let i = 0; i < 64; i += 4) {
        md5blks[i >> 2] =
          s.charCodeAt(i) +
          (s.charCodeAt(i + 1) << 8) +
          (s.charCodeAt(i + 2) << 16) +
          (s.charCodeAt(i + 3) << 24);
      }
      return md5blks;
    }
    const hex_chr = '0123456789abcdef'.split('');
    function rhex(n: number) {
      let s = '', j = 0;
      for (; j < 4; j++) s += hex_chr[(n >> (j * 8 + 4)) & 0x0f] + hex_chr[(n >> (j * 8)) & 0x0f];
      return s;
    }
    function hex(x: number[]) {
      let res = '';
      for (let i = 0; i < x.length; i++) res += rhex(x[i]);
      return res;
    }
    return hex(md51(string));
  };

  // Compute Hashes using Web Crypto API
  useEffect(() => {
    const compute = async () => {
      if (!inputText) {
        setHashes({});
        return;
      }

      const encoder = new TextEncoder();
      const data = encoder.encode(inputText);

      const res: { [key: string]: string } = {};

      // MD5
      res['MD5'] = md5(inputText);

      // WebCrypto algorithms
      const algos = [
        { name: 'SHA-256', key: 'SHA-256' },
        { name: 'SHA-512', key: 'SHA-512' },
        { name: 'SHA-1', key: 'SHA-1' },
      ];

      for (const algo of algos) {
        try {
          if (secretKey) {
            // HMAC
            const keyData = encoder.encode(secretKey);
            const cryptoKey = await crypto.subtle.importKey(
              'raw',
              keyData,
              { name: 'HMAC', hash: { name: algo.name } },
              false,
              ['sign']
            );
            const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
            res[`HMAC-${algo.key}`] = Array.from(new Uint8Array(signature))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');
          } else {
            // Standard Hash
            const hashBuffer = await crypto.subtle.digest(algo.name, data);
            res[algo.key] = Array.from(new Uint8Array(hashBuffer))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('');
          }
        } catch (e) {
          console.error(e);
        }
      }

      setHashes(res);
    };

    compute();
  }, [inputText, secretKey]);

  // File Checksum handler
  const handleFileChecksum = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const sha256Hex = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    setFileHash({
      name: file.name,
      size: (file.size / (1024 * 1024) > 1) ? `${(file.size / (1024 * 1024)).toFixed(2)} MB` : `${(file.size / 1024).toFixed(1)} KB`,
      sha256: sha256Hex,
    });
  };

  const copySingleHash = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6" id="hash-generator-tool">
      {/* Input Text & Secret Key Block */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{t('input')}</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setInputText('Digital Utility Suite 2026')}
                className="inline-flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Sparkles className="w-3 h-3" />
                {t('sample')}
              </button>
              <button
                type="button"
                onClick={() => { setInputText(''); setSecretKey(''); }}
                className="text-[11px] text-slate-500 hover:text-red-500"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>
          <textarea
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Type or paste input text to hash..."
            className="w-full h-28 p-3 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Secret Key Input (HMAC) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t('secretKeyOptional')}</span>
          </label>
          <input
            type="text"
            value={secretKey}
            onChange={e => setSecretKey(e.target.value)}
            placeholder={language === 'ar' ? 'أدخل المفتاح السري لتفعيل HMAC (اختياري)...' : 'Enter secret key to calculate HMAC (optional)...'}
            className="w-full p-2.5 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Computed Hashes List */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>{t('result')}</span>
        </h4>

        <div className="grid grid-cols-1 gap-3">
          {Object.entries(hashes).map(([algo, hashVal]) => (
            <div
              key={algo}
              className="bg-white dark:bg-slate-900 p-3.5 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold font-mono px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded border border-indigo-200 dark:border-indigo-800">
                  {algo}
                </span>
                <button
                  type="button"
                  onClick={() => copySingleHash(algo, String(hashVal))}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium cursor-pointer"
                >
                  {copiedKey === algo ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{t('copied')}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{t('copy')}</span>
                    </>
                  )}
                </button>
              </div>
              <p className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all select-all bg-slate-50 dark:bg-slate-950 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800/80">
                {hashVal}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* File Checksum Analyzer */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <FileCheck className="w-4 h-4 text-indigo-500" />
          <span>{language === 'ar' ? 'فحص بصمة الملفات (File SHA-256 Checksum)' : 'Local File SHA-256 Checksum'}</span>
        </h4>

        <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-500 rounded-xl cursor-pointer bg-white dark:bg-slate-900 transition-colors">
          <FileCheck className="w-8 h-8 text-slate-400 mb-2" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {fileHash ? `${fileHash.name} (${fileHash.size})` : (language === 'ar' ? 'اختر أي ملف لحساب بصمة التشفير الخاصة به محلياً' : 'Select any file to calculate SHA-256 checksum locally')}
          </span>
          <input type="file" onChange={handleFileChecksum} className="hidden" />
        </label>

        {fileHash && (
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="font-mono text-xs break-all">
              <span className="font-bold text-indigo-600 dark:text-indigo-400">SHA-256: </span>
              <span className="text-slate-700 dark:text-slate-300">{fileHash.sha256}</span>
            </div>
            <button
              type="button"
              onClick={() => copySingleHash('file', fileHash.sha256)}
              className="p-1.5 text-slate-500 hover:text-indigo-600 cursor-pointer shrink-0"
              title={t('copy')}
            >
              {copiedKey === 'file' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
