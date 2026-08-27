import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Check, AlertCircle, Copy } from 'lucide-react';

interface MatchItem {
  match: string;
  index: number;
  groups?: Record<string, string> | string[];
}

export const RegexTester: React.FC = () => {
  const { t, language } = useApp();
  const [pattern, setPattern] = useState<string>('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [flags, setFlags] = useState({
    g: true,
    i: true,
    m: false,
    s: false,
  });
  const [testString, setTestString] = useState<string>(
    `Hello! Reach us at support@example.com or sales.team@domain.co.uk.
For technical inquiries: dev_admin@service.io. Invalid: contact@domain without tld.`
  );
  const [copied, setCopied] = useState(false);

  const presets = [
    {
      label: t('emailPreset'),
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      sample: 'Contact team@example.com or user.name123@sub.domain.org for info.',
    },
    {
      label: t('urlPreset'),
      pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)',
      sample: 'Visit https://google.com or https://github.com/trending and http://ai.studio/build',
    },
    {
      label: t('phonePreset'),
      pattern: '(\\+?\\d{1,3}[- ]?)?\\(?\\d{3}\\)?[- ]?\\d{3}[- ]?\\d{4}',
      sample: 'Call +1 (555) 234-5678 or +966 50 123 4567 or 055-123-4567',
    },
    {
      label: t('ipv4Preset'),
      pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b',
      sample: 'Localhost is 127.0.0.1, router is 192.168.1.1, public DNS 8.8.8.8 and 1.1.1.1',
    },
    {
      label: t('arabicOnlyPreset'),
      pattern: '[\\u0600-\\u06FF\\s]+',
      sample: 'هذا النص يحتوي على كلمات عربية Arabic and English مختلطة معاً.',
    },
    {
      label: language === 'ar' ? 'أكواد الألوان HEX' : 'Hex Colors (#fff)',
      pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
      sample: 'Colors: #ffffff, #6366f1, #333, and #000000 are modern hues.',
    },
  ];

  const flagString = useMemo(() => {
    let f = '';
    if (flags.g) f += 'g';
    if (flags.i) f += 'i';
    if (flags.m) f += 'm';
    if (flags.s) f += 's';
    return f;
  }, [flags]);

  const { matches, error, highlightedHtml } = useMemo(() => {
    if (!pattern || !testString) {
      return { matches: [], error: null, highlightedHtml: testString };
    }

    try {
      const regex = new RegExp(pattern, flagString);
      const matchesList: MatchItem[] = [];

      if (flags.g) {
        let match: RegExpExecArray | null;
        let lastIndex = 0;
        let safeLoopGuard = 0;

        while ((match = regex.exec(testString)) !== null && safeLoopGuard < 1000) {
          safeLoopGuard++;
          matchesList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          matchesList.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      // Generate clean highlighted HTML
      const raw = testString
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      const safeRegex = new RegExp(pattern, flagString);
      const html = raw.replace(
        safeRegex,
        m => `<mark class="bg-amber-300 dark:bg-amber-500/40 text-slate-900 dark:text-amber-200 px-1 py-0.5 rounded font-semibold">${m}</mark>`
      );

      return { matches: matchesList, error: null, highlightedHtml: html };
    } catch (err: any) {
      return { matches: [], error: err.message, highlightedHtml: testString };
    }
  }, [pattern, flagString, testString]);

  const toggleFlag = (flagKey: 'g' | 'i' | 'm' | 's') => {
    setFlags(prev => ({ ...prev, [flagKey]: !prev[flagKey] }));
  };

  const handleCopyRegex = () => {
    navigator.clipboard.writeText(`/${pattern}/${flagString}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6" id="regex-tester-tool">
      {/* Pattern & Flags Row */}
      <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t('regexPattern')}
          </label>
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {presets.map(p => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setPattern(p.pattern);
                  setTestString(p.sample);
                }}
                className="px-2.5 py-1 text-[11px] font-medium bg-white dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md transition-colors cursor-pointer"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Pattern Input with Flags */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-mono text-indigo-500 font-bold">/</span>
          <input
            type="text"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            placeholder="[a-zA-Z0-9._%+-]+@..."
            className="flex-1 p-2.5 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <span className="text-xl font-mono text-indigo-500 font-bold">/</span>

          {/* Flags Toggles */}
          <div className="flex items-center bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 rounded-lg">
            {(['g', 'i', 'm', 's'] as const).map(f => (
              <button
                key={f}
                type="button"
                onClick={() => toggleFlag(f)}
                className={`w-7 h-7 text-xs font-mono font-bold rounded transition-colors ${
                  flags[f]
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
                title={`Flag ${f}`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleCopyRegex}
            className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t('copied') : t('copy')}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="font-mono">{error}</span>
          </div>
        )}
      </div>

      {/* Test String & Highlight Match Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Test String Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
            <span>{t('testString')}</span>
            <span className="text-slate-400 font-normal">{testString.length} {t('charsCount')}</span>
          </label>
          <textarea
            value={testString}
            onChange={e => setTestString(e.target.value)}
            placeholder="Type or paste test string here..."
            className="w-full h-52 p-3.5 text-sm font-mono bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-y"
          />
        </div>

        {/* Live Highlighted View */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>{language === 'ar' ? 'المطابقة الحية' : 'Highlighted Matches'}</span>
            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded font-bold">
              {matches.length} {t('matchesFound')}
            </span>
          </div>
          <div
            className="w-full h-52 p-3.5 text-sm font-mono bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-y-auto whitespace-pre-wrap break-all text-slate-800 dark:text-slate-200"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </div>
      </div>

      {/* Extracted Match Groups Table */}
      {matches.length > 0 && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="bg-slate-100 dark:bg-slate-900 px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t('matchGroups')} ({matches.length})
            </h4>
          </div>
          <div className="max-h-60 overflow-y-auto divide-y divide-slate-200 dark:divide-slate-800/80 bg-white dark:bg-slate-950 text-xs font-mono">
            {matches.map((m, idx) => (
              <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-900/50">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 select-none">#{idx + 1}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold">{m.match}</span>
                </div>
                <div className="flex items-center gap-4 text-slate-500">
                  <span>index: {m.index}</span>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(m.match)}
                    className="p-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                    title={t('copy')}
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
