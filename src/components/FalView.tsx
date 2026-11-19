import React, { useState } from 'react';
import { Sparkles, Bookmark, Volume2, Loader2, BookOpen, Compass, Share2, Check } from 'lucide-react';
import { Ghazal, HAFEZ_GHAZALS } from '../data/hafezData';

interface FalViewProps {
  onSelectGhazal: (ghazal: Ghazal) => void;
  bookmarks: number[];
  toggleBookmark: (id: number) => void;
  onPlayAudio: (ghazal: Ghazal) => void;
}

export const FalView: React.FC<FalViewProps> = ({ onSelectGhazal, bookmarks, toggleBookmark, onPlayAudio }) => {
  const [intention, setIntention] = useState('');
  const [currentFal, setCurrentFal] = useState<Ghazal | null>(null);
  const [interpretation, setInterpretation] = useState<{ meaning: string; advice: string; prediction: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const takeFal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setInterpretation(null);

    // Pick random ghazal
    const randomIndex = Math.floor(Math.random() * HAFEZ_GHAZALS.length);
    const selected = HAFEZ_GHAZALS[randomIndex];
    setCurrentFal(selected);

    try {
      const res = await fetch('/api/fal/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          intention: intention || 'خیر، سعادت و آرامش در کارها',
          ghazalTitle: selected.title,
          ghazalVerses: selected.verses.map(v => `${v.misra1} / ${v.misra2}`)
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setInterpretation(data);
      } else {
        throw new Error(data.error || 'خطا در دریافت تفسیر');
      }
    } catch (err) {
      console.error(err);
      setInterpretation({
        meaning: selected.meaning,
        advice: 'حافظ می‌فرماید با توکل بر خدا و صبر، گره از کار فرو بسته گشوده خواهد شد.',
        prediction: 'پایان شب سیه سفید است؛ نیت شما به سرانجام نیک خواهد رسید.'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!currentFal) return;
    const text = `${currentFal.title}\n\n` + currentFal.verses.map(v => `${v.misra1}\n${v.misra2}`).join('\n\n') + `\n\n(دیوان حافظ شیرازی)`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>فال‌نامه و استخاره به دیوان خواجه شیراز</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-extrabold text-amber-100 tracking-tight mb-4 font-['Amiri',serif]">
          نیت کنید و دل به لسان‌الغیب بسپارید
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto">
          نیت قلبی خود را در دل مرور کنید یا در کادر زیر بنویسید، سپس دکمه فال حافظ را بفشارید تا گویای اسرار نهان باشد.
        </p>
      </div>

      {/* Intention Form */}
      <div className="bg-gradient-to-b from-[#161822] to-[#11131b] border border-amber-500/20 rounded-2xl p-6 md:p-8 shadow-2xl shadow-amber-500/5 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <form onSubmit={takeFal} className="space-y-4">
          <label className="block text-sm font-semibold text-amber-200">
            نیت شما (اختیاری):
          </label>
          <div className="relative">
            <input 
              type="text"
              value={intention}
              onChange={(e) => setIntention(e.target.value)}
              placeholder="مثال: سعادت در سفر، موفقیت در کار، گشایش کار..."
              className="w-full bg-[#0c0d12] border border-amber-500/30 rounded-xl px-4 py-3.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-sm md:text-base transition-all"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <p className="text-xs text-slate-400">
              «ای حافظ شیرازی، تو شاه دانایی، بر من نظر کن و بگشا راز نهانی»
            </p>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-amber-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin text-amber-950" />
                  <span>در حال استخراج فال...</span>
                </>
              ) : (
                <>
                  <Compass className="w-5 h-5" />
                  <span>گرفتن فال حافظ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Fal Result Display */}
      {currentFal && (
        <div className="bg-gradient-to-b from-[#181a26] to-[#12141d] border border-amber-500/30 rounded-2xl p-6 md:p-10 shadow-2xl relative animate-fadeIn">
          {/* Header Actions */}
          <div className="flex items-center justify-between pb-6 border-b border-amber-500/10 mb-8">
            <div>
              <span className="text-xs text-amber-400 font-medium">غزل شماره {currentFal.number}</span>
              <h3 className="text-xl md:text-2xl font-bold text-amber-100 font-['Amiri',serif] mt-1">
                {currentFal.title}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPlayAudio(currentFal)}
                title="شنیدن صوت غزل"
                className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Volume2 className="w-5 h-5" />
                <span className="text-xs font-semibold hidden sm:inline">شنیدن صوت</span>
              </button>
              <button
                onClick={() => toggleBookmark(currentFal.id)}
                title="نشان کردن"
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  bookmarks.includes(currentFal.id)
                    ? 'bg-amber-500 text-amber-950 border-amber-400'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                }`}
              >
                <Bookmark className="w-5 h-5" />
              </button>
              <button
                onClick={copyToClipboard}
                title="کپی کردن متن"
                className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20 transition-all cursor-pointer"
              >
                {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Verses (Bayts) */}
          <div className="space-y-6 my-8 max-w-2xl mx-auto text-center">
            {currentFal.verses.map((v) => (
              <div key={v.bayt} className="grid grid-cols-1 md:grid-cols-2 gap-2 text-right md:text-center text-amber-100/90 font-['Amiri',serif] text-lg md:text-xl py-2 border-b border-amber-500/5 last:border-0">
                <div className="tracking-wide">{v.misra1}</div>
                <div className="tracking-wide">{v.misra2}</div>
              </div>
            ))}
          </div>

          {/* AI Interpretation */}
          <div className="mt-10 pt-8 border-t border-amber-500/20 space-y-6">
            <div className="flex items-center gap-2 text-amber-300 font-semibold text-lg">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h4>تفسیر عرفانی و فال‌نامه</h4>
            </div>

            {loading && !interpretation ? (
              <div className="flex items-center justify-center py-12 gap-3 text-amber-400">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>در حال دریافت شرح حال و راز حافظ...</span>
              </div>
            ) : interpretation ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-[#0c0d12]/70 border border-amber-500/10 rounded-xl p-5">
                  <h5 className="text-sm font-bold text-amber-400 mb-2">معنی و مفهوم غزل</h5>
                  <p className="text-slate-300 text-sm leading-relaxed">{interpretation.meaning}</p>
                </div>
                <div className="bg-[#0c0d12]/70 border border-amber-500/10 rounded-xl p-5">
                  <h5 className="text-sm font-bold text-amber-400 mb-2">پند و اندیشه حافظ</h5>
                  <p className="text-slate-300 text-sm leading-relaxed">{interpretation.advice}</p>
                </div>
                <div className="bg-[#0c0d12]/70 border border-amber-500/10 rounded-xl p-5">
                  <h5 className="text-sm font-bold text-amber-400 mb-2">نتیجه فال (پیش‌بینی)</h5>
                  <p className="text-slate-300 text-sm leading-relaxed">{interpretation.prediction}</p>
                </div>
              </div>
            ) : null}
          </div>

          {/* View Full Ghazal Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => onSelectGhazal(currentFal)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-sm font-medium transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>مشاهده جزئیات کامل و یادداشت‌ها</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
