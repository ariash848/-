import React, { useState } from 'react';
import { Search, BookOpen, Bookmark, Volume2, ArrowRight, Sparkles, Check, Share2, FileText } from 'lucide-react';
import { Ghazal, HAFEZ_GHAZALS } from '../data/hafezData';

interface GhazalsViewProps {
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  notes: Record<number, string>;
  saveNote: (id: number, note: string) => void;
  onPlayAudio: (ghazal: Ghazal) => void;
}

export const GhazalsView: React.FC<GhazalsViewProps> = ({ bookmarks, toggleBookmark, notes, saveNote, onPlayAudio }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeGhazal, setActiveGhazal] = useState<Ghazal | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [copied, setCopied] = useState(false);

  const categories = ['all', ...Array.from(new Set(HAFEZ_GHAZALS.map(g => g.category)))];

  const filteredGhazals = HAFEZ_GHAZALS.filter(g => {
    const matchesSearch = g.title.includes(searchQuery) || g.verses.some(v => v.misra1.includes(searchQuery) || v.misra2.includes(searchQuery));
    const matchesCategory = selectedCategory === 'all' || g.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenGhazal = (g: Ghazal) => {
    setActiveGhazal(g);
    setNoteInput(notes[g.id] || '');
  };

  const handleSaveNote = () => {
    if (!activeGhazal) return;
    saveNote(activeGhazal.id, noteInput);
    alert('یادداشت شما با موفقیت ذخیره شد.');
  };

  const copyGhazal = (g: Ghazal) => {
    const text = `${g.title}\n\n` + g.verses.map(v => `${v.misra1}\n${v.misra2}`).join('\n\n') + `\n\n(دیوان حافظ شیرازی)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {activeGhazal ? (
        <div className="bg-[#12141d] border border-amber-500/30 rounded-2xl p-6 md:p-10 shadow-2xl">
          <button
            onClick={() => setActiveGhazal(null)}
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 mb-6 text-sm font-medium cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>بازگشت به فهرست غزل‌ها</span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-amber-500/10 mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md">غزل شماره {activeGhazal.number}</span>
                <span className="text-xs text-slate-400">·</span>
                <span className="text-xs text-slate-400">{activeGhazal.category}</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-amber-100 font-['Amiri',serif]">
                {activeGhazal.title}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onPlayAudio(activeGhazal)}
                className="px-3.5 py-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4" />
                <span>شنیدن صوت غزل</span>
              </button>
              <button
                onClick={() => toggleBookmark(activeGhazal.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  bookmarks.includes(activeGhazal.id)
                    ? 'bg-amber-500 text-amber-950 border-amber-400'
                    : 'bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyGhazal(activeGhazal)}
                className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Verses */}
          <div className="space-y-6 my-8 max-w-2xl mx-auto text-center">
            {activeGhazal.verses.map((v) => (
              <div key={v.bayt} className="grid grid-cols-1 md:grid-cols-2 gap-2 text-right md:text-center text-amber-100/90 font-['Amiri',serif] text-lg md:text-xl py-2 border-b border-amber-500/5 last:border-0">
                <div className="tracking-wide">{v.misra1}</div>
                <div className="tracking-wide">{v.misra2}</div>
              </div>
            ))}
          </div>

          {/* Meaning */}
          <div className="mt-10 p-6 bg-[#0c0d12] border border-amber-500/15 rounded-xl">
            <h4 className="text-amber-300 font-bold mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>معنی و مفهوم غزل</span>
            </h4>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">{activeGhazal.meaning}</p>
          </div>

          {/* Personal Notes */}
          <div className="mt-6 p-6 bg-[#0c0d12] border border-amber-500/15 rounded-xl">
            <h4 className="text-amber-300 font-bold mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>یادداشت‌های شخصی شما روی این غزل</span>
            </h4>
            <textarea
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder="برداشت‌ها، بیت‌های مورد علاقه یا یادداشت‌های شخصی..."
              className="w-full bg-[#161822] border border-amber-500/20 rounded-xl p-3 text-slate-200 text-sm focus:outline-none focus:border-amber-400 h-28 resize-none mb-3"
            />
            <button
              onClick={handleSaveNote}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-lg transition-all cursor-pointer"
            >
              ذخیره یادداشت
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-amber-100 tracking-tight mb-3 font-['Amiri',serif]">
              گنجینه غزل‌های خواجه حافظ
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              جستجو در میان غزل‌های جاودانه دیوان حافظ، مطالعه معانی و افزودن یادداشت‌های شخصی.
            </p>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در کلمات، ابیات یا عنوان غزل..."
                className="w-full bg-[#12141d] border border-amber-500/20 rounded-xl pr-10 pl-4 py-2.5 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-all"
              />
            </div>

            {/* Categories */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-amber-500 text-amber-950 font-bold'
                      : 'bg-[#12141d] text-slate-300 border border-amber-500/10 hover:border-amber-500/30'
                  }`}
                >
                  {cat === 'all' ? 'همه موضوعات' : cat}
                </button>
              ))}
            </div>
          </div>

          {/* Ghazals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGhazals.map((g) => (
              <div
                key={g.id}
                onClick={() => handleOpenGhazal(g)}
                className="bg-[#12141d] border border-amber-500/15 hover:border-amber-500/40 rounded-2xl p-6 transition-all hover:scale-[1.01] cursor-pointer flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded">
                      غزل شماره {g.number}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onPlayAudio(g);
                        }}
                        title="شنیدن صوت غزل"
                        className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(g.id);
                        }}
                        className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                          bookmarks.includes(g.id)
                            ? 'bg-amber-500 text-amber-950 border-amber-400'
                            : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                        }`}
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-amber-100 font-['Amiri',serif] mb-3 group-hover:text-amber-300 transition-colors">
                    {g.title}
                  </h3>

                  <p className="text-slate-300 text-sm font-['Amiri',serif] line-clamp-2 leading-relaxed mb-4">
                    {g.verses[0].misra1} / {g.verses[0].misra2}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-amber-500/10 text-xs text-slate-400">
                  <span>{g.category}</span>
                  <span className="text-amber-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>مطالعه کامل</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredGhazals.length === 0 && (
            <div className="text-center py-20 text-slate-500">
              هیچ غزل یا بیتی با این مشخصات یافت نشد.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
