import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, ToolCategory, ToolItem } from '../types';
import { LANGUAGES, translations } from '../i18n/translations';
import { TOOLS } from '../data/tools';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  t: (key: string, fallback?: string) => string;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  activeToolId: string | null;
  setActiveToolId: (id: string | null) => void;
  activeTool: ToolItem | null;
  selectedCategory: ToolCategory;
  setSelectedCategory: (cat: ToolCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  favorites: string[];
  toggleFavorite: (toolId: string) => void;
  isFavorite: (toolId: string) => boolean;
  recents: string[];
  clearRecents: () => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('util_lang');
    return (saved && LANGUAGES[saved as Language]) ? (saved as Language) : 'ar';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const savedTheme = localStorage.getItem('util_theme');
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [activeToolId, setActiveToolIdState] = useState<string | null>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash && TOOLS.some(t => t.id === hash) ? hash : null;
  });

  const [selectedCategory, setSelectedCategory] = useState<ToolCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('util_favs');
      return saved ? JSON.parse(saved) : ['text-analyzer', 'qr-generator', 'json-formatter', 'password-generator'];
    } catch {
      return ['text-analyzer', 'qr-generator'];
    }
  });

  const [recents, setRecents] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('util_recents');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const dir = LANGUAGES[language].dir;

  // Handle Language changes
  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('util_lang', newLang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  // Handle Theme changes
  useEffect(() => {
    localStorage.setItem('util_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Tool Navigation & Hash Sync
  const setActiveToolId = (id: string | null) => {
    setActiveToolIdState(id);
    if (id) {
      window.location.hash = id;
      // Add to recents
      setRecents(prev => {
        const filtered = prev.filter(item => item !== id);
        const updated = [id, ...filtered].slice(0, 8);
        localStorage.setItem('util_recents', JSON.stringify(updated));
        return updated;
      });
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.hash = '';
    }
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && TOOLS.some(t => t.id === hash)) {
        setActiveToolIdState(hash);
      } else {
        setActiveToolIdState(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut for search modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleFavorite = (toolId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId];
      localStorage.setItem('util_favs', JSON.stringify(updated));
      return updated;
    });
  };

  const isFavorite = (toolId: string) => favorites.includes(toolId);

  const clearRecents = () => {
    setRecents([]);
    localStorage.removeItem('util_recents');
  };

  const t = (key: string, fallback?: string): string => {
    const langDict = translations[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English
    if (translations.en && translations.en[key]) {
      return translations.en[key];
    }
    return fallback || key;
  };

  const activeTool = activeToolId ? (TOOLS.find(t => t.id === activeToolId) || null) : null;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        dir,
        t,
        theme,
        toggleTheme,
        activeToolId,
        setActiveToolId,
        activeTool,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        favorites,
        toggleFavorite,
        isFavorite,
        recents,
        clearRecents,
        isSearchModalOpen,
        setIsSearchModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
