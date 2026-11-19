/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { FalView } from './components/FalView';
import { GhazalsView } from './components/GhazalsView';
import { SageChatView } from './components/SageChatView';
import { BookmarksView } from './components/BookmarksView';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { Ghazal } from './data/hafezData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('fal');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [, setSelectedGhazalForDetail] = useState<Ghazal | null>(null);
  const [activeAudioGhazal, setActiveAudioGhazal] = useState<Ghazal | null>(null);

  // Load bookmarks & notes from localStorage on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem('hafez_bookmarks');
      if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

      const savedNotes = localStorage.getItem('hafez_notes');
      if (savedNotes) setNotes(JSON.parse(savedNotes));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleBookmark = (id: number) => {
    const updated = bookmarks.includes(id)
      ? bookmarks.filter(b => b !== id)
      : [...bookmarks, id];
    setBookmarks(updated);
    try {
      localStorage.setItem('hafez_bookmarks', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const saveNote = (id: number, note: string) => {
    const updated = { ...notes, [id]: note };
    setNotes(updated);
    try {
      localStorage.setItem('hafez_notes', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectGhazal = (g: Ghazal) => {
    setSelectedGhazalForDetail(g);
    setCurrentTab('ghazals');
  };

  return (
    <div className="min-h-screen bg-[#0c0d12] text-slate-100 font-['Vazirmatn',sans-serif] selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenFal={() => setCurrentTab('fal')}
      />

      <main className="py-8 pb-32">
        {currentTab === 'fal' && (
          <FalView
            onSelectGhazal={handleSelectGhazal}
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            onPlayAudio={(g) => setActiveAudioGhazal(g)}
          />
        )}
        {currentTab === 'ghazals' && (
          <GhazalsView
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            notes={notes}
            saveNote={saveNote}
            onPlayAudio={(g) => setActiveAudioGhazal(g)}
          />
        )}
        {currentTab === 'sage' && <SageChatView />}
        {currentTab === 'bookmarks' && (
          <BookmarksView
            bookmarks={bookmarks}
            toggleBookmark={toggleBookmark}
            notes={notes}
            onSelectGhazal={handleSelectGhazal}
            onPlayAudio={(g) => setActiveAudioGhazal(g)}
          />
        )}
      </main>

      {/* Persistent Audio Player Bar */}
      <AudioPlayerBar
        currentGhazal={activeAudioGhazal}
        onClose={() => setActiveAudioGhazal(null)}
      />

      {/* Footer */}
      <footer className="border-t border-amber-500/15 py-8 mt-16 text-center text-xs text-slate-500">
        <p>دیوان حافظ شیرازی — گنجینه شعر، عرفان و حکمت ایرانی</p>
        <p className="mt-1 text-amber-500/60">«هر آن کس که در این حلقه نیست زنده به عشق بر او نمرده به فتوای من نماز کنید»</p>
      </footer>
    </div>
  );
}
