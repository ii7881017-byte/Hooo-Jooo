import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { TOOLS } from '../data/tools';
import { ToolIcon } from './ToolIcon';
import { Search, X, Star, Sparkles, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const { searchQuery, setSearchQuery, setActiveToolId, t, favorites } = useApp();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Auto focus input on modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Filter tools based on query
  const filtered = TOOLS.filter(tool => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();

    const name = t(tool.nameKey, tool.id).toLowerCase();
    const desc = t(tool.descKey, '').toLowerCase();
    const tagMatch = tool.tags.some(tag => tag.toLowerCase().includes(q));
    const catMatch = tool.category.toLowerCase().includes(q);

    return name.includes(q) || desc.includes(q) || tagMatch || catMatch;
  });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % (filtered.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filtered.length) % (filtered.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filtered[selectedIndex]) {
          setActiveToolId(filtered[selectedIndex].id);
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filtered, selectedIndex, setActiveToolId, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#0e0f18]/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 text-white"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-5 py-4 border-b border-white/10 gap-3.5">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={t('searchPlaceholder')}
            className="flex-1 bg-transparent text-base text-white placeholder-white/40 outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="p-1 text-white/40 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold bg-white/10 text-white/70 hover:text-white rounded-lg transition-colors cursor-pointer border border-white/10"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2.5 space-y-1">
          {filtered.length > 0 ? (
            filtered.map((tool, idx) => {
              const isSelected = idx === selectedIndex;
              const name = t(tool.nameKey, tool.id);
              const desc = t(tool.descKey, '');
              const isFav = favorites.includes(tool.id);

              return (
                <div
                  key={tool.id}
                  onClick={() => {
                    setActiveToolId(tool.id);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-lg shadow-indigo-600/10'
                      : 'text-white/80 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3.5 truncate">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400/40'
                          : 'bg-white/10 text-indigo-400 border-white/10'
                      }`}
                    >
                      <ToolIcon name={tool.iconName} className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate text-white">{name}</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                            isSelected
                              ? 'bg-indigo-500/30 text-indigo-200 border-indigo-400/30'
                              : 'bg-white/10 text-white/60 border-white/5'
                          }`}
                        >
                          {t(`cat_${tool.category}`, tool.category)}
                        </span>
                        {tool.isAiPowered && (
                          <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        )}
                        {isFav && (
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs truncate max-w-md text-white/50">
                        {desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-indigo-400 opacity-100 translate-x-1 rtl:-translate-x-1' : 'opacity-0'
                    }`}
                  />
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-white/40 space-y-2">
              <Search className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm font-medium">{t('noResults', 'No tools found')}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-black/40 border-t border-white/10 text-[11px] text-white/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded border border-white/15 text-white/80">↑↓</kbd> Navigate
            </span>
            <span>
              <kbd className="font-mono bg-white/10 px-1.5 py-0.5 rounded border border-white/15 text-white/80">↵</kbd> Open
            </span>
          </div>
          <span>{filtered.length} {t('totalTools', 'tools')}</span>
        </div>
      </div>
    </div>
  );
};
