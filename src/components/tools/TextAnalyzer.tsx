import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Copy, Check, RotateCcw, Sparkles, BookOpen, Clock } from 'lucide-react';

export const TextAnalyzer: React.FC = () => {
  const { t, language } = useApp();
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const sampleTexts = {
    ar: 'المنصة الرقمية المتكاملة توفر مجموعة واسعة من الأدوات الخدمية المتقدمة لجميع المستخدمين والمطورين في مكان واحد، بسرعة فائقة وتصميم عصري وخصوصية تامة.\n\nتتضمن الأدوات تشفير البيانات، تحليل النصوص بدقة، وتوليد رموز الاستجابة السريعة QR بكل سهولة.',
    en: 'The Digital Utility Hub delivers a comprehensive suite of high-performance tools for content creators, developers, and designers. Everything runs locally inside your browser with complete privacy and zero latency.',
  };

  const stats = useMemo(() => {
    const raw = text;
    const charsWithSpaces = raw.length;
    const charsNoSpaces = raw.replace(/\s+/g, '').length;
    
    // Words count (supporting Arabic, Latin and other scripts)
    const wordsArray = raw.trim().split(/[\s,.;:!?\n\r\t()"\u060C\u061B\u061F\u0640]+/).filter(Boolean);
    const words = raw.trim() === '' ? 0 : wordsArray.length;

    // Sentences count
    const sentences = raw.trim() === '' ? 0 : raw.split(/[.!?\n\u061F\u06D4]+/).filter(s => s.trim().length > 0).length;

    // Paragraphs count
    const paragraphs = raw.trim() === '' ? 0 : raw.split(/\n+/).filter(p => p.trim().length > 0).length;

    // Reading & Speaking Time (minutes and seconds)
    const readingTimeSeconds = Math.ceil((words / 200) * 60);
    const speakingTimeSeconds = Math.ceil((words / 130) * 60);

    const formatDuration = (totalSec: number) => {
      if (totalSec < 60) return `${totalSec}s`;
      const mins = Math.floor(totalSec / 60);
      const secs = totalSec % 60;
      return `${mins}m ${secs > 0 ? `${secs}s` : ''}`;
    };

    return {
      charsWithSpaces,
      charsNoSpaces,
      words,
      sentences,
      paragraphs,
      readingTime: formatDuration(readingTimeSeconds),
      speakingTime: formatDuration(speakingTimeSeconds),
    };
  }, [text]);

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const transformCase = (type: string) => {
    switch (type) {
      case 'upper':
        setText(text.toUpperCase());
        break;
      case 'lower':
        setText(text.toLowerCase());
        break;
      case 'title':
        setText(
          text.replace(
            /\w\S*/g,
            w => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()
          )
        );
        break;
      case 'camel':
        setText(
          text
            .toLowerCase()
            .replace(/[^a-zA-Z0-9]+(.)/g, (_m, chr) => chr.toUpperCase())
        );
        break;
      case 'snake':
        setText(
          text
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_\u0600-\u06FF]/g, '')
        );
        break;
      case 'kebab':
        setText(
          text
            .trim()
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-zA-Z0-9-\u0600-\u06FF]/g, '')
        );
        break;
      case 'tashkeel':
        // Remove Arabic Diacritics (Fatha, Damma, Kasra, Sukun, Shadda, Tanween, Tatweel)
        setText(
          text
            .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
            .replace(/\u0622|\u0623|\u0625/g, 'ا') // optional normalization
        );
        break;
      case 'clean-spaces':
        setText(text.replace(/[ \t]+/g, ' ').replace(/\n\s+/g, '\n').trim());
        break;
      case 'unique-lines': {
        const lines = text.split('\n');
        const unique = Array.from(new Set(lines));
        setText(unique.join('\n'));
        break;
      }
      case 'sort-asc': {
        const lines = text.split('\n');
        lines.sort((a, b) => a.localeCompare(b));
        setText(lines.join('\n'));
        break;
      }
      case 'reverse':
        setText(text.split('').reverse().join(''));
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6" id="text-analyzer-tool">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center backdrop-blur-md">
          <p className="text-xs text-white/50 font-medium mb-1">{t('wordsCount')}</p>
          <p className="text-2xl font-bold text-indigo-400">{stats.words.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center backdrop-blur-md">
          <p className="text-xs text-white/50 font-medium mb-1">{t('charsCount')}</p>
          <p className="text-2xl font-bold text-white">{stats.charsWithSpaces.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center backdrop-blur-md">
          <p className="text-xs text-white/50 font-medium mb-1">{t('charsNoSpaces')}</p>
          <p className="text-2xl font-bold text-white">{stats.charsNoSpaces.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center backdrop-blur-md">
          <p className="text-xs text-white/50 font-medium mb-1">{t('sentencesCount')}</p>
          <p className="text-2xl font-bold text-white">{stats.sentences.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center backdrop-blur-md">
          <p className="text-xs text-white/50 font-medium mb-1">{t('paragraphsCount')}</p>
          <p className="text-2xl font-bold text-white">{stats.paragraphs.toLocaleString()}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center backdrop-blur-md">
          <div className="flex items-center justify-center gap-1 text-xs text-white/50 font-medium mb-1">
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('readTime')}</span>
          </div>
          <p className="text-xl font-bold text-emerald-400">{stats.readingTime}</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-3.5 text-center backdrop-blur-md">
          <div className="flex items-center justify-center gap-1 text-xs text-white/50 font-medium mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('speakTime')}</span>
          </div>
          <p className="text-xl font-bold text-amber-400">{stats.speakingTime}</p>
        </div>
      </div>

      {/* Main Textarea */}
      <div className="relative space-y-2">
        <textarea
          id="text-analyzer-input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder={language === 'ar' ? 'اكتب أو الصق النص هنا للتحليل والتعديل...' : 'Type or paste text here to analyze and transform...'}
          className="w-full h-56 p-4 text-base bg-white/5 border border-white/10 rounded-2xl shadow-inner focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-white/30 text-white resize-y backdrop-blur-md"
        />

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              id="load-sample-btn"
              type="button"
              onClick={() => setText(language === 'ar' ? sampleTexts.ar : sampleTexts.en)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/80 rounded-xl transition-all cursor-pointer border border-white/10 backdrop-blur-md"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              {t('sample')}
            </button>
            <button
              id="clear-text-btn"
              type="button"
              onClick={() => setText('')}
              disabled={!text}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white/50 hover:text-red-400 disabled:opacity-30 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t('clear')}
            </button>
          </div>

          <button
            id="copy-text-btn"
            type="button"
            onClick={handleCopy}
            disabled={!text}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-white/30 text-white rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer border border-indigo-500/40"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? t('copied') : t('copy')}
          </button>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
        <h4 className="text-[11px] font-bold text-white/40 uppercase tracking-widest mb-3">
          {language === 'ar' ? 'عمليات التحويل والتنظيف السريع' : 'Text Transformations & Quick Tools'}
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'upper', label: t('uppercase') },
            { id: 'lower', label: t('lowercase') },
            { id: 'title', label: t('titleCase') },
            { id: 'camel', label: 'camelCase' },
            { id: 'snake', label: 'snake_case' },
            { id: 'kebab', label: 'kebab-case' },
            { id: 'tashkeel', label: t('removeTashkeel'), highlight: true },
            { id: 'clean-spaces', label: t('removeExtraSpaces') },
            { id: 'unique-lines', label: t('removeDuplicateLines') },
            { id: 'sort-asc', label: t('sortLinesAsc') },
            { id: 'reverse', label: t('reverseText') },
          ].map(btn => (
            <button
              key={btn.id}
              type="button"
              onClick={() => transformCase(btn.id)}
              disabled={!text}
              className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all disabled:opacity-30 cursor-pointer backdrop-blur-md ${
                btn.highlight
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                  : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10 hover:border-white/20'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
