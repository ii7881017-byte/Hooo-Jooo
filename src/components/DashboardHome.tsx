import React from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../data/tools';
import { ToolCategory } from '../types';
import { ToolIcon } from './ToolIcon';
import {
  Sparkles,
  Star,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe2,
  Lock,
  Search,
} from 'lucide-react';
import { motion } from 'motion/react';

const CATEGORY_TABS: { id: ToolCategory; labelKey: string }[] = [
  { id: 'all', labelKey: 'cat_all' },
  { id: 'text', labelKey: 'cat_text' },
  { id: 'developer', labelKey: 'cat_developer' },
  { id: 'security', labelKey: 'cat_security' },
  { id: 'media', labelKey: 'cat_media' },
  { id: 'converter', labelKey: 'cat_converter' },
  { id: 'finance', labelKey: 'cat_finance' },
  { id: 'time', labelKey: 'cat_time' },
  { id: 'ai', labelKey: 'cat_ai' },
];

interface DashboardHomeProps {
  onOpenSearch: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  text: 'bg-blue-500/20 text-blue-400 border-blue-500/25',
  developer: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/25',
  security: 'bg-amber-500/20 text-amber-400 border-amber-500/25',
  media: 'bg-pink-500/20 text-pink-400 border-pink-500/25',
  converter: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/25',
  finance: 'bg-green-500/20 text-green-400 border-green-500/25',
  time: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/25',
  ai: 'bg-purple-500/20 text-purple-400 border-purple-500/25',
  all: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/25',
};

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onOpenSearch }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    setActiveToolId,
    searchQuery,
    favorites,
    toggleFavorite,
    t,
    language,
  } = useApp();

  // Filter tools
  const filteredTools = TOOLS.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const name = t(tool.nameKey).toLowerCase();
    const desc = t(tool.descKey).toLowerCase();
    const tagMatch = tool.tags.some(tag => tag.toLowerCase().includes(q));
    return name.includes(q) || desc.includes(q) || tagMatch;
  });

  return (
    <div className="space-y-8" id="dashboard-home-view">
      {/* Hero Welcome Banner - Frosted Glass Container */}
      <div className="relative rounded-3xl overflow-hidden bg-white/5 backdrop-blur-xl text-white p-8 md:p-12 shadow-2xl border border-white/10">
        {/* Ambient Glow Spheres */}
        <div className="absolute top-0 end-0 -mt-10 -me-10 w-72 h-72 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 start-0 -mb-10 -ms-10 w-72 h-72 bg-purple-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold text-indigo-300 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t('appSubtitle')}</span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {t('appName')}
            </h1>
            <p className="text-sm md:text-base text-white/70 max-w-2xl leading-relaxed">
              {t('privacyNote')}
            </p>
          </div>

          {/* Quick Search Bar in Hero (Frosted Glass Search Bar) */}
          <div className="pt-2">
            <div
              onClick={onOpenSearch}
              className="flex items-center gap-3 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 hover:border-white/20 px-5 py-3.5 rounded-full cursor-pointer transition-all shadow-inner group"
            >
              <Search className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              <span className="text-sm text-white/60 group-hover:text-white transition-colors">
                {t('searchPlaceholder')}
              </span>
              <kbd className="ms-auto hidden sm:inline-block px-2.5 py-1 text-xs font-mono font-bold bg-white/10 text-white/80 rounded-md border border-white/10">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: Lock,
            title: language === 'ar' ? 'خصوصية محلية 100%' : '100% Client Privacy',
            desc: language === 'ar' ? 'معالجة البيانات داخل جهازك بدون حفظ' : 'Zero data logging or storage',
            color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20',
          },
          {
            icon: Zap,
            title: language === 'ar' ? 'أداء فائق السرعة' : 'Instant Execution',
            desc: language === 'ar' ? 'استجابة فورية بدون أي تأخير' : 'WebAssembly & WebCrypto speed',
            color: 'bg-amber-500/20 text-amber-400 border-amber-500/20',
          },
          {
            icon: Globe2,
            title: language === 'ar' ? 'دعم 6 لغات عالمية' : '6 Global Languages',
            desc: language === 'ar' ? 'واجهة عربية أصيلة مع RTL كامل' : 'Arabic, English, French & more',
            color: 'bg-blue-500/20 text-blue-400 border-blue-500/20',
          },
          {
            icon: Sparkles,
            title: language === 'ar' ? 'مدعوم بالذكاء الاصطناعي' : 'Gemini AI Powered',
            desc: language === 'ar' ? 'مساعد ذكي للتلخيص والبرمجة' : 'Integrated Google Gemini models',
            color: 'bg-purple-500/20 text-purple-400 border-purple-500/20',
          },
        ].map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-xl hover:bg-white/10 hover:border-white/20 transition-all flex items-start gap-3"
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border ${feat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-white">{feat.title}</h4>
                <p className="text-[11px] text-white/50 leading-snug">{feat.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Pills Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORY_TABS.map(tab => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25 border border-indigo-500/50'
                    : 'bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 backdrop-blur-md'
                }`}
              >
                {t(tab.labelKey, tab.id)}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-white/50 bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>{filteredTools.length} {language === 'ar' ? 'أداة جاهزة' : 'tools online'}</span>
        </div>
      </div>

      {/* Tools Grid - Frosted Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool, idx) => {
          const name = t(tool.nameKey, tool.id);
          const desc = t(tool.descKey, '');
          const isFav = favorites.includes(tool.id);
          const colorClass = CATEGORY_COLORS[tool.category] || CATEGORY_COLORS.all;

          return (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: idx * 0.025 }}
              className="group bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div
                    onClick={() => setActiveToolId(tool.id)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center cursor-pointer group-hover:scale-110 transition-transform border ${colorClass}`}
                  >
                    <ToolIcon name={tool.iconName} className="w-6 h-6" />
                  </div>

                  <div className="flex items-center gap-1.5">
                    {tool.isAiPowered && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30 backdrop-blur-xs">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        AI
                      </span>
                    )}
                    {tool.isNew && (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full border border-emerald-500/30 backdrop-blur-xs">
                        NEW
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(tool.id);
                      }}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isFav
                          ? 'text-amber-400 bg-amber-400/10'
                          : 'text-white/30 hover:text-amber-300'
                      }`}
                      title="Favorite"
                    >
                      <Star className={`w-4 h-4 ${isFav ? 'fill-amber-400' : ''}`} />
                    </button>
                  </div>
                </div>

                <div onClick={() => setActiveToolId(tool.id)} className="cursor-pointer space-y-1.5">
                  <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                    {name}
                  </h3>
                  <p className="text-xs text-white/50 line-clamp-2 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>

              {/* Tags & Action Link */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-white/10 text-white/70 rounded-lg border border-white/5">
                  {t(`cat_${tool.category}`, tool.category)}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveToolId(tool.id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-all cursor-pointer"
                >
                  <span>{t('openTool')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
