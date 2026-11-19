import React from 'react';
import { Bookmark, BookOpen, Trash2, FileText, Sparkles, Volume2 } from 'lucide-react';
import { Ghazal, HAFEZ_GHAZALS } from '../data/hafezData';

interface BookmarksViewProps {
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  notes: Record<number, string>;
  onSelectGhazal: (ghazal: Ghazal) => void;
  onPlayAudio: (ghazal: Ghazal) => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({ bookmarks, toggleBookmark, notes, onSelectGhazal, onPlayAudio }) => {
  const bookmarkedGhazals = HAFEZ_GHAZALS.filter(g => bookmarks.includes(g.id));

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>غزل‌های برگزیده و یادداشت‌ها</span>
        </div>
        <h2 className="text-3xl font-extrabold text-amber-100 font-['Amiri',serif]">
          نشان‌شده‌ها و یادداشت‌های شما
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          دسترسی سریع به غزل‌هایی که نشان کرده‌اید و یادداشت‌هایی که بر آن‌ها نگاشته‌اید.
        </p>
      </div>

      {bookmarkedGhazals.length === 0 ? (
        <div className="text-center py-20 bg-[#12141d] border border-amber-500/15 rounded-2xl">
          <Bookmark className="w-12 h-12 text-amber-500/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-amber-200 mb-2">هنوز غزلی نشان نکرده‌اید</h3>
          <p className="text-slate-400 text-sm max-w-sm mx-auto">
            با کلیک روی آیکون نشانک در صفحه فال یا فهرست غزل‌ها، اشعار محبوب خود را اینجا ذخیره کنید.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {bookmarkedGhazals.map((g) => (
            <div
              key={g.id}
              onClick={() => onSelectGhazal(g)}
              className="bg-[#12141d] border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all cursor-pointer shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-0.5 rounded">
                    غزل شماره {g.number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPlayAudio(g);
                      }}
                      title="شنیدن صوت"
                      className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-colors cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleBookmark(g.id);
                      }}
                      title="حذف از نشان‌شده‌ها"
                      className="p-1.5 rounded-lg bg-amber-500 text-amber-950 hover:bg-amber-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-amber-100 font-['Amiri',serif] mb-3">
                  {g.title}
                </h3>

                <p className="text-slate-300 text-sm font-['Amiri',serif] line-clamp-2 leading-relaxed mb-4">
                  {g.verses[0].misra1} / {g.verses[0].misra2}
                </p>

                {notes[g.id] && (
                  <div className="mt-4 p-3 bg-[#0c0d12] border border-amber-500/10 rounded-xl text-xs text-slate-300 flex items-start gap-2">
                    <FileText className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <p className="line-clamp-2">{notes[g.id]}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-amber-500/10 text-xs text-slate-400">
                <span>{g.category}</span>
                <span className="text-amber-400 flex items-center gap-1 font-semibold">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>مطالعه غزل</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
