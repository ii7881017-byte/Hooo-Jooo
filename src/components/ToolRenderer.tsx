import React from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../data/tools';
import { ToolIcon } from './ToolIcon';
import { Star, Share2, Sparkles, Home, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Tool Components
import { TextAnalyzer } from './tools/TextAnalyzer';
import { TextDiff } from './tools/TextDiff';
import { Base64UrlConverter } from './tools/Base64UrlConverter';
import { MarkdownEditor } from './tools/MarkdownEditor';
import { JsonFormatter } from './tools/JsonFormatter';
import { RegexTester } from './tools/RegexTester';
import { HashGenerator } from './tools/HashGenerator';
import { PasswordGenerator } from './tools/PasswordGenerator';
import { QrGenerator } from './tools/QrGenerator';
import { ImageCompressor } from './tools/ImageCompressor';
import { ColorStudio } from './tools/ColorStudio';
import { UnitConverter } from './tools/UnitConverter';
import { TimezoneConverter } from './tools/TimezoneConverter';
import { CurrencyConverter } from './tools/CurrencyConverter';
import { LoanCalculator } from './tools/LoanCalculator';
import { AiSmartAssistant } from './tools/AiSmartAssistant';
import { UuidGenerator } from './tools/UuidGenerator';
import { SvgOptimizer } from './tools/SvgOptimizer';

export const ToolRenderer: React.FC = () => {
  const { activeToolId, setActiveToolId, favorites, toggleFavorite, t, language } = useApp();

  const currentTool = TOOLS.find(t => t.id === activeToolId);
  const isFav = currentTool ? favorites.includes(currentTool.id) : false;

  const renderComponent = () => {
    switch (activeToolId) {
      case 'text-analyzer':
        return <TextAnalyzer />;
      case 'text-diff':
        return <TextDiff />;
      case 'base64-url':
        return <Base64UrlConverter />;
      case 'markdown-editor':
        return <MarkdownEditor />;
      case 'json-formatter':
        return <JsonFormatter />;
      case 'regex-tester':
        return <RegexTester />;
      case 'hash-generator':
        return <HashGenerator />;
      case 'password-gen':
      case 'password-generator':
        return <PasswordGenerator />;
      case 'qr-generator':
        return <QrGenerator />;
      case 'image-compressor':
      case 'image-optimizer':
        return <ImageCompressor />;
      case 'color-studio':
        return <ColorStudio />;
      case 'unit-converter':
        return <UnitConverter />;
      case 'timezone-converter':
        return <TimezoneConverter />;
      case 'currency-converter':
        return <CurrencyConverter />;
      case 'loan-calc':
      case 'finance-calc':
        return <LoanCalculator />;
      case 'ai-smart':
        return <AiSmartAssistant />;
      case 'uuid-gen':
        return <UuidGenerator />;
      case 'svg-optimizer':
        return <SvgOptimizer />;
      default:
        return <TextAnalyzer />;
    }
  };

  if (!currentTool) return null;

  const toolName = t(currentTool.nameKey, currentTool.id);
  const toolDesc = t(currentTool.descKey, '');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: toolName,
        text: toolDesc,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert(language === 'ar' ? 'تم نسخ رابط الأداة بنجاح!' : 'Tool link copied to clipboard!');
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeToolId}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="space-y-6"
      >
        {/* Tool Header Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden text-white">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 end-0 -mt-8 -me-8 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 bg-indigo-500/20 text-indigo-300 rounded-2xl flex items-center justify-center shrink-0 shadow-lg border border-indigo-500/30">
                <ToolIcon name={currentTool.iconName} className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                    {toolName}
                  </h1>
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 bg-white/10 text-white/80 rounded-full border border-white/10">
                    {t(`cat_${currentTool.category}`, currentTool.category)}
                  </span>
                  {currentTool.isAiPowered && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      Gemini AI
                    </span>
                  )}
                </div>
                <p className="text-xs md:text-sm text-white/60 max-w-2xl leading-relaxed">
                  {toolDesc}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                type="button"
                onClick={() => toggleFavorite(currentTool.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer backdrop-blur-md ${
                  isFav
                    ? 'bg-amber-400/20 border-amber-400/40 text-amber-400 shadow-sm'
                    : 'bg-white/5 border-white/10 text-white/40 hover:text-amber-400 hover:bg-white/10'
                }`}
                title={isFav ? 'Remove Favorite' : 'Add to Favorites'}
              >
                <Star className={`w-5 h-5 ${isFav ? 'fill-amber-400' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-xl transition-all cursor-pointer backdrop-blur-md"
                title="Share Tool"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tool Implementation Container */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl text-white">
          {renderComponent()}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
