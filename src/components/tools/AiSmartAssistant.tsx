import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Sparkles,
  Send,
  Copy,
  Check,
  Code,
  FileEdit,
  CheckCircle2,
  FileText,
  Search,
  RotateCcw,
  Loader2,
  AlertCircle,
} from 'lucide-react';

type AiTask = 'rephrase' | 'code' | 'grammar' | 'regex' | 'summarize';

interface TaskOption {
  id: AiTask;
  nameAr: string;
  nameEn: string;
  descAr: string;
  descEn: string;
  icon: any;
  placeholderAr: string;
  placeholderEn: string;
  samplePromptAr: string;
  samplePromptEn: string;
}

const AI_TASKS: TaskOption[] = [
  {
    id: 'rephrase',
    nameAr: 'إعادة صياغة وتحسين',
    nameEn: 'Rephrase & Polish',
    descAr: 'تحسين أسلوب النص وجعله أكثر احترافية وجاذبية',
    descEn: 'Polish tone and style for professional clarity',
    icon: FileEdit,
    placeholderAr: 'اكتب النص الذي ترغب في إعادة صياغته هنا...',
    placeholderEn: 'Paste the text you want to rewrite or polish...',
    samplePromptAr: 'نود إبلاغكم أن المشروع تم الانتهاء منه وسنقوم بتسليمه في الوقت المحدد بدون أي تأخير.',
    samplePromptEn: 'We want to tell you that the project is finished and we will deliver on time without delay.',
  },
  {
    id: 'code',
    nameAr: 'شرح وتحسين الكود',
    nameEn: 'Code Explainer & Optimizer',
    descAr: 'تحليل الأكواد البرمجية وتقديم اقتراحات لتسريعها وحمايتها',
    descEn: 'Analyze code snippets, explain logic and suggest optimizations',
    icon: Code,
    placeholderAr: 'الصق الكود البرمجي هنا للشرح والتحسين...',
    placeholderEn: 'Paste any code snippet here for explanation and optimization...',
    samplePromptAr: `function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}`,
    samplePromptEn: `function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}`,
  },
  {
    id: 'grammar',
    nameAr: 'التدقيق اللغوي والإملائي',
    nameEn: 'Grammar & Spell Check',
    descAr: 'تصحيح الأخطاء النحوية والإملائية بدقة بالغة',
    descEn: 'Fix spelling, punctuation, and grammatical mistakes',
    icon: CheckCircle2,
    placeholderAr: 'الصق النص لتدقيقه إملائياً ونحوياً...',
    placeholderEn: 'Paste text to check for grammar and spelling errors...',
    samplePromptAr: 'شكرا جزيلا علا حسن تعاونكم معنا في انقاذ هاذا المشروع الحساس.',
    samplePromptEn: 'Their is many people who does not understand the importance of this.',
  },
  {
    id: 'regex',
    nameAr: 'توليد التعبيرات النمطية (Regex)',
    nameEn: 'Regex Expression Builder',
    descAr: 'تحويل الوصف النصي إلى كود تعبير نمطي فوري',
    descEn: 'Convert natural language description into regular expressions',
    icon: Search,
    placeholderAr: 'صف النمط الذي تبحث عنه (مثال: استخراج أرقام الهواتف السعودية)...',
    placeholderEn: 'Describe the pattern you want to match (e.g., extract valid IPv6 addresses)...',
    samplePromptAr: 'أريد تعبير نمطي للتحقق من كلمات المرور القوية التي تحتوي على 8 خانات وحرف كبير ورقم ورمز.',
    samplePromptEn: 'Match date strings in format YYYY-MM-DD or DD/MM/YYYY with valid month and day ranges.',
  },
  {
    id: 'summarize',
    nameAr: 'تلخيص النصوص والمقالات',
    nameEn: 'Executive Summarizer',
    descAr: 'استخراج النقاط الجوهرية والملخص التنفيذي للمقالات الطويلة',
    descEn: 'Condense articles and documents into key bullet points',
    icon: FileText,
    placeholderAr: 'الصق النص أو المقال الطويل هنا للتلخيص...',
    placeholderEn: 'Paste the article or long document to summarize...',
    samplePromptAr: 'الذكاء الاصطناعي التوليدي يشهد تطوراً متسارعاً في السنوات الأخيرة حيث ساهم في زيادة إنتاجية المطورين بنسبة تتجاوز 40%، كما فتح آفاقاً جديدة في مجالات الطب والتعليم والترجمة الآلية الفورية مع الحفاظ على خصوصية البيانات.',
    samplePromptEn: 'Generative AI has evolved rapidly in recent years, boosting developer productivity by over 40%, while opening new frontiers in healthcare, automated customer service, and real-time translation.',
  },
];

export const AiSmartAssistant: React.FC = () => {
  const { t, language } = useApp();
  const [task, setTask] = useState<AiTask>('rephrase');
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [outputResult, setOutputResult] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const currentTask = AI_TASKS.find(t => t.id === task) || AI_TASKS[0];

  const handleGenerate = async () => {
    if (!inputPrompt.trim()) return;

    setLoading(true);
    setError(null);
    setOutputResult('');

    try {
      const response = await fetch('/api/ai-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          task,
          prompt: inputPrompt,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process AI request');
      }

      setOutputResult(data.result);
    } catch (err: any) {
      setError(err.message || 'An error occurred during AI processing');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!outputResult) return;
    navigator.clipboard.writeText(outputResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLoadSample = () => {
    setInputPrompt(language === 'ar' ? currentTask.samplePromptAr : currentTask.samplePromptEn);
  };

  return (
    <div className="space-y-6" id="ai-assistant-tool">
      {/* Top Task Selector Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {AI_TASKS.map(item => {
          const Icon = item.icon;
          const isActive = task === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setTask(item.id);
                setOutputResult('');
                setError(null);
              }}
              className={`p-3 rounded-2xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md ring-2 ring-indigo-500/30'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-indigo-500'}`} />
                <span className="text-xs font-bold truncate">{language === 'ar' ? item.nameAr : item.nameEn}</span>
              </div>
              <p className={`text-[10px] line-clamp-2 ${isActive ? 'text-indigo-100' : 'text-slate-400'}`}>
                {language === 'ar' ? item.descAr : item.descEn}
              </p>
            </button>
          );
        })}
      </div>

      {/* Main Workspace Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Box */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-indigo-500" />
              <span>{language === 'ar' ? 'المدخلات والمطلوب' : 'Prompt & Input'}</span>
            </h4>
            <button
              type="button"
              onClick={handleLoadSample}
              className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {t('sample')}
            </button>
          </div>

          <textarea
            value={inputPrompt}
            onChange={e => setInputPrompt(e.target.value)}
            placeholder={language === 'ar' ? currentTask.placeholderAr : currentTask.placeholderEn}
            className="w-full h-56 p-3.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => { setInputPrompt(''); setOutputResult(''); setError(null); }}
              disabled={!inputPrompt}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-red-500 disabled:opacity-30 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t('clear')}
            </button>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !inputPrompt.trim()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? (language === 'ar' ? 'جاري المعالجة بالذكاء الاصطناعي...' : 'Processing AI...') : (language === 'ar' ? 'معالجة بالذكاء الاصطناعي' : 'Run with AI')}
            </button>
          </div>
        </div>

        {/* Output Box */}
        <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                <span>{language === 'ar' ? 'إجابة وتحليل الذكاء الاصطناعي' : 'AI Output & Analysis'}</span>
              </h4>
              {outputResult && (
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? t('copied') : t('copy')}
                </button>
              )}
            </div>

            {error && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="h-64 overflow-y-auto p-4 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm whitespace-pre-wrap leading-relaxed text-slate-800 dark:text-slate-200">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                  <span className="text-xs">{language === 'ar' ? 'يتم توليد وتحليل النص عبر نموذج Gemini...' : 'Generating output with Gemini AI...'}</span>
                </div>
              ) : outputResult ? (
                outputResult
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-xs text-center">
                  {language === 'ar' ? 'ستظهر النتيجة المولدة هنا بعد الضغط على معالجة...' : 'AI generated result will appear here...'}
                </div>
              )}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center justify-between">
            <span>Powered by Google Gemini</span>
            <span>Server-side Secure Proxy</span>
          </div>
        </div>
      </div>
    </div>
  );
};
