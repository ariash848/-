import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, Loader2, X, Music, Sparkles } from 'lucide-react';
import { Ghazal } from '../data/hafezData';

interface AudioPlayerBarProps {
  currentGhazal: Ghazal | null;
  onClose: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ currentGhazal, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!currentGhazal) return;
    generateAndPlayAudio(currentGhazal);
  }, [currentGhazal]);

  const generateAndPlayAudio = async (g: Ghazal) => {
    setIsLoading(true);
    setErrorMsg(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    try {
      const poemText = g.verses.map(v => `${v.misra1}. ${v.misra2}.`).join(' ');
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `غزل شماره ${g.number}. ${g.title}. ${poemText}`,
          style: 'A soulful, resonant, and soothing classical Persian recitation with mystical resonance'
        })
      });

      const data = await res.json();
      if (res.ok && data.audio) {
        const url = `data:${data.mimeType || 'audio/wav'};base64,${data.audio}`;
        setAudioUrl(url);
        const audio = new Audio(url);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => {
          setIsPlaying(false);
          setErrorMsg('خطا در پخش صوت');
        };
        await audio.play();
        setIsPlaying(true);
      } else {
        throw new Error(data.error || 'TTS generation failed');
      }
    } catch (err: any) {
      console.error(err);
      // Fallback to Web Speech API
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const poemText = g.verses.map(v => `${v.misra1} ${v.misra2}`).join('. ');
        const utterance = new SpeechSynthesisUtterance(poemText);
        utterance.lang = 'fa-IR';
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        window.speechSynthesis.speak(utterance);
        setIsPlaying(true);
      } else {
        setErrorMsg('امکان تولید صوت در حال حاضر وجود ندارد.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  if (!currentGhazal) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-96 z-50 bg-[#161822]/95 backdrop-blur-md border border-amber-500/30 rounded-2xl p-4 shadow-2xl shadow-amber-500/10 animate-slideUp">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <Music className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-amber-400 font-medium">خوانش صوتی دیوان</span>
            <h4 className="text-sm font-bold text-amber-100 font-['Amiri',serif] truncate max-w-[200px]">
              {currentGhazal.title}
            </h4>
          </div>
        </div>
        <button
          onClick={() => {
            if (audioRef.current) audioRef.current.pause();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            onClose();
          }}
          className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 bg-[#0c0d12] border border-amber-500/10 rounded-xl p-3">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 text-amber-950 flex items-center justify-center transition-all shadow-md shadow-amber-500/20 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 translate-x-0.5" />
            )}
          </button>
          <div>
            <p className="text-xs font-medium text-slate-200">
              {isLoading ? 'در حال تولید صوت هوشمند...' : isPlaying ? 'در حال خوانش غزل...' : 'آماده پخش'}
            </p>
            <p className="text-[10px] text-slate-400">غزل شماره {currentGhazal.number}</p>
          </div>
        </div>

        {/* Visualizer bars animation */}
        <div className="flex items-center gap-1 h-6 px-2">
          {[0.6, 0.9, 0.4, 0.8, 0.5].map((scale, i) => (
            <div
              key={i}
              className={`w-1 bg-amber-400 rounded-full transition-all duration-300 ${
                isPlaying ? 'animate-pulse' : 'opacity-30'
              }`}
              style={{ height: isPlaying ? `${scale * 100}%` : '30%' }}
            />
          ))}
        </div>
      </div>

      {errorMsg && (
        <p className="text-[11px] text-red-400 mt-2 text-center">{errorMsg}</p>
      )}
    </div>
  );
};
