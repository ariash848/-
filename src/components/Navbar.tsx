import React from 'react';
import { BookOpen, Sparkles, MessageSquare, Bookmark, Compass } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenFal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenFal }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0c0d12]/90 backdrop-blur-md border-b border-amber-500/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div 
          onClick={() => setCurrentTab('fal')}
          className="flex items-center gap-3 cursor-pointer shrink-0 group"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 text-amber-950" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-amber-100 whitespace-nowrap">
              دیوان حافظ
            </h1>
            <p className="text-[10px] text-amber-400/80 tracking-widest uppercase">
              گنجینه شعر و عرفان
            </p>
          </div>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button 
            onClick={() => setCurrentTab('fal')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'fal' ? 'text-amber-400 bg-amber-500/10 font-semibold' : 'hover:text-amber-300'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>فال حافظ</span>
          </button>
          
          <button 
            onClick={() => setCurrentTab('ghazals')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'ghazals' ? 'text-amber-400 bg-amber-500/10 font-semibold' : 'hover:text-amber-300'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>گنجینه غزل‌ها</span>
          </button>

          <button 
            onClick={() => setCurrentTab('sage')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'sage' ? 'text-amber-400 bg-amber-500/10 font-semibold' : 'hover:text-amber-300'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>هم‌نشین حافظ</span>
          </button>

          <button 
            onClick={() => setCurrentTab('bookmarks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              currentTab === 'bookmarks' ? 'text-amber-400 bg-amber-500/10 font-semibold' : 'hover:text-amber-300'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>نشان‌شده‌ها</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={onOpenFal}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-amber-950 bg-gradient-to-r from-amber-400 to-amber-500 rounded-xl hover:from-amber-300 hover:to-amber-400 transition-all shadow-lg shadow-amber-500/20 whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>نیت و فال جدید</span>
          </button>
        </div>

      </div>

      {/* Mobile Navigation Bar Below */}
      <div className="flex lg:hidden items-center justify-around mt-4 pt-3 border-t border-amber-500/10 text-xs">
        <button 
          onClick={() => setCurrentTab('fal')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${currentTab === 'fal' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <Compass className="w-4 h-4" />
          <span>فال</span>
        </button>
        <button 
          onClick={() => setCurrentTab('ghazals')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${currentTab === 'ghazals' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <BookOpen className="w-4 h-4" />
          <span>غزل‌ها</span>
        </button>
        <button 
          onClick={() => setCurrentTab('sage')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${currentTab === 'sage' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>هم‌نشین</span>
        </button>
        <button 
          onClick={() => setCurrentTab('bookmarks')}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg ${currentTab === 'bookmarks' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <Bookmark className="w-4 h-4" />
          <span>نشان‌ها</span>
        </button>
      </div>
    </header>
  );
};
