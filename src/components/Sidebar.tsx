import React from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../data/tools';
import { ToolCategory } from '../types';
import { ToolIcon } from './ToolIcon';
import {
  LayoutGrid,
  Star,
  Clock,
  Sparkles,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

const CATEGORIES: { id: ToolCategory; labelKey: string; icon: string }[] = [
  { id: 'all', labelKey: 'cat_all', icon: 'SlidersHorizontal' },
  { id: 'text', labelKey: 'cat_text', icon: 'FileText' },
  { id: 'developer', labelKey: 'cat_developer', icon: 'Binary' },
  { id: 'security', labelKey: 'cat_security', icon: 'ShieldCheck' },
  { id: 'media', labelKey: 'cat_media', icon: 'Image' },
  { id: 'converter', labelKey: 'cat_converter', icon: 'Scale' },
  { id: 'finance', labelKey: 'cat_finance', icon: 'DollarSign' },
  { id: 'time', labelKey: 'cat_time', icon: 'Clock' },
  { id: 'ai', labelKey: 'cat_ai', icon: 'Bot' },
];

interface SidebarProps {
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onCloseMobile }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    activeToolId,
    setActiveToolId,
    favorites,
    recents,
    t,
  } = useApp();

  const handleSelectTool = (toolId: string) => {
    setActiveToolId(toolId);
    onCloseMobile();
  };

  const favoriteTools = TOOLS.filter(tool => favorites.includes(tool.id));
  const recentTools = recents
    .map(id => TOOLS.find(t => t.id === id))
    .filter(Boolean) as typeof TOOLS;

  // Filter tools by active category
  const filteredTools =
    selectedCategory === 'all'
      ? TOOLS
      : TOOLS.filter(tool => tool.category === selectedCategory);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 start-0 z-40 h-[calc(100vh-4rem)] w-72 bg-white/5 backdrop-blur-xl border-e border-white/10 transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full rtl:translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="p-4 space-y-6">
          {/* Categories Navigation */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold px-3 mb-2 block">
              {t('categories', 'Categories')}
            </span>
            <div className="space-y-1">
              {CATEGORIES.map(cat => {
                const isActive = selectedCategory === cat.id && !activeToolId;
                const count =
                  cat.id === 'all'
                    ? TOOLS.length
                    : TOOLS.filter(t => t.category === cat.id).length;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setActiveToolId(null);
                      onCloseMobile();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 shadow-sm'
                        : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <ToolIcon name={cat.icon} className="w-4 h-4" />
                      <span>{t(cat.labelKey, cat.id)}</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30'
                          : 'bg-white/10 text-white/50'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Starred / Favorites Tools (if any) */}
          {favoriteTools.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 font-bold px-3 flex items-center gap-1.5 mb-2">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{t('favorites')}</span>
              </span>
              <div className="space-y-1">
                {favoriteTools.map(tool => {
                  const isActive = activeToolId === tool.id;
                  const name = t(tool.nameKey, tool.id);
                  return (
                    <button
                      key={tool.id}
                      type="button"
                      onClick={() => handleSelectTool(tool.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                        isActive
                          ? 'bg-indigo-600/25 text-indigo-200 border border-indigo-500/30 font-semibold'
                          : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <ToolIcon name={tool.iconName} className="w-4 h-4 shrink-0 text-amber-400" />
                        <span className="truncate">{name}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Active Category Tools List */}
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold px-3 mb-2 block">
              {t('allTools')} ({filteredTools.length})
            </span>
            <div className="space-y-1">
              {filteredTools.map(tool => {
                const isActive = activeToolId === tool.id;
                const name = t(tool.nameKey, tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => handleSelectTool(tool.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                      isActive
                        ? 'bg-indigo-600/25 text-indigo-200 border border-indigo-500/30 font-semibold'
                        : 'text-white/70 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <ToolIcon name={tool.iconName} className="w-4 h-4 shrink-0 text-white/40" />
                      <span className="truncate">{name}</span>
                    </div>
                    {tool.isAiPowered && (
                      <Sparkles className="w-3 h-3 text-purple-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cloud Sync / Privacy card */}
          <div className="mt-auto bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <p className="text-xs font-bold text-white">100% Local Engine</p>
            </div>
            <p className="text-[10px] text-white/50 leading-relaxed">
              No server logging. All data computations happen entirely in browser memory.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
