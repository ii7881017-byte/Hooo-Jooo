import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SearchModal } from './components/SearchModal';
import { DashboardHome } from './components/DashboardHome';
import { ToolRenderer } from './components/ToolRenderer';
import { ArrowLeft, ArrowRight, Home, Shield, Sparkles, Heart } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeToolId, setActiveToolId, language, t } = useApp();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global keyboard shortcut for search (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#0c0d14] text-slate-100 font-sans transition-colors flex flex-col relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-white">
      {/* Ambient Frosted Glow Spheres in background */}
      <div className="fixed top-[-120px] end-[-120px] w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-120px] start-[-120px] w-[550px] h-[550px] bg-purple-600/20 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed top-[35%] start-[30%] w-[500px] h-[400px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Top Application Header */}
      <Header
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        isSidebarOpen={isSidebarOpen}
      />

      {/* Main Content Layout with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />

        {/* Primary Main Content View */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Breadcrumb Navigation when viewing a specific tool */}
          {activeToolId && (
            <nav className="flex items-center gap-2 text-xs font-semibold text-white/50 bg-white/5 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 w-fit">
              <button
                type="button"
                onClick={() => setActiveToolId(null)}
                className="inline-flex items-center gap-1.5 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'الرئيسية' : 'Home'}</span>
              </button>
              <span className="text-white/20">/</span>
              <span className="text-white/90">{t('allTools', 'Tools')}</span>
            </nav>
          )}

          {/* Active View: Home Explore Grid vs Specific Tool */}
          {activeToolId ? (
            <ToolRenderer />
          ) : (
            <DashboardHome onOpenSearch={() => setIsSearchOpen(true)} />
          )}
        </main>
      </div>

      {/* Frosted Glass Footer */}
      <footer className="mt-auto border-t border-white/10 bg-black/40 backdrop-blur-xl py-5 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-sm shadow-emerald-500/50"></span>
            <span>{t('privacyGuarantee')}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-white/80">{t('appName')}</span>
            <span>•</span>
            <div className="flex items-center gap-2">
              <span>{language === 'ar' ? 'جميع الخدمات تعمل محلياً وفورياً' : 'All systems online'}</span>
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
            </div>
          </div>
        </div>
      </footer>

      {/* Spotlight Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
