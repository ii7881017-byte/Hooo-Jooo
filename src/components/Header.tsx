import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import {
  Search,
  Moon,
  Sun,
  Globe,
  Sparkles,
  Star,
  Layers,
  Menu,
  X,
  SlidersHorizontal,
} from 'lucide-react';

const LANGUAGES: { code: Language; name: string; nativeName: string; flag: string }[] = [
  { code: 'ar', name: 'Arabic', nativeName: 'العربية (RTL)', flag: '🇸🇦' },
  { code: 'en', name: 'English', nativeName: 'English (LTR)', flag: '🇺🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', flag: '🇹🇷' },
];

interface HeaderProps {
  onOpenSearch: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onToggleSidebar,
  isSidebarOpen,
}) => {
  const { theme, toggleTheme, language, setLanguage, t, favorites, setActiveToolId, activeToolId } = useApp();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/5 backdrop-blur-xl border-b border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left Side: Brand Logo & Mobile Menu Toggle */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 -ms-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl lg:hidden cursor-pointer transition-colors"
            aria-label="Toggle Navigation"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => setActiveToolId(null)}
            className="flex items-center gap-2.5 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform border border-white/20">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div className="hidden sm:block leading-tight">
              <span className="text-base font-bold text-white tracking-tight block group-hover:text-indigo-300 transition-colors">
                {t('appName')}
              </span>
              <span className="text-[10px] font-semibold text-indigo-400 block tracking-wider uppercase">
                {t('appSubtitle')}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Trigger (Spotlight Button - Frosted Pill) */}
        <div className="flex-1 max-w-md hidden md:block">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-4 py-2 text-xs text-white/60 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full transition-all shadow-inner cursor-pointer group backdrop-blur-md"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-white/40 group-hover:text-indigo-400 transition-colors" />
              <span className="group-hover:text-white/90 transition-colors">{t('searchPlaceholder')}</span>
            </div>
            <kbd className="hidden lg:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono font-bold bg-white/10 text-white/70 rounded-md border border-white/10">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side: Language Dropdown, Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Mobile Search Icon button */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl md:hidden cursor-pointer border border-white/10 transition-colors"
            title={t('searchPlaceholder')}
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={langMenuRef}>
            <button
              type="button"
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-all text-xs font-medium text-white shadow-sm cursor-pointer backdrop-blur-md"
            >
              <span className="text-sm leading-none">{currentLangObj.flag}</span>
              <span className="hidden sm:inline text-white/90">{currentLangObj.nativeName}</span>
            </button>

            {langMenuOpen && (
              <div className="absolute end-0 mt-2 w-56 bg-[#0e0f18]/95 backdrop-blur-2xl border border-white/15 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-bold text-white/40 uppercase tracking-wider border-b border-white/10">
                  {t('languages')}
                </div>
                <div className="p-1 space-y-0.5">
                  {LANGUAGES.map(item => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLanguage(item.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-xl transition-all cursor-pointer ${
                        language === item.code
                          ? 'bg-indigo-600/30 text-indigo-300 font-bold border border-indigo-500/30'
                          : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{item.flag}</span>
                        <span>{item.nativeName}</span>
                      </div>
                      {language === item.code && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-sm shadow-indigo-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 border border-white/10 rounded-xl transition-colors cursor-pointer backdrop-blur-md"
            title={theme === 'dark' ? t('lightMode') : t('darkMode')}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          </button>
        </div>
      </div>
    </header>
  );
};
