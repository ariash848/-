import React, { useState } from 'react';
import { Send, Sparkles, MessageSquare, Loader2, Bot, User } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export const SageChatView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'سلام ای دلداده راه صفا و راستی. من حافظ شیرازی هستم؛ از حال دل بگو و هر آنچه در خاطر داری از راز و نیاز با من در میان گذار.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    const newMessages: ChatMessage[] = [...messages, { role: 'user', text: userMsg }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await fetch('/api/hafez/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          history: newMessages.slice(0, -1)
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessages([...newMessages, { role: 'model', text: data.reply }]);
      } else {
        throw new Error(data.error);
      }
    } catch (err) {
      console.error(err);
      setMessages([...newMessages, { role: 'model', text: 'ای دلبر گرامی، هم‌اکنون نسیم صبا کمی آرام است، لختی دیگر بازگرد تا سخن آغاز کنیم.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col h-[80vh]">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>هم‌نشینی با خواجه شیراز</span>
        </div>
        <h2 className="text-3xl font-extrabold text-amber-100 font-['Amiri',serif]">
          گفتگو با حافظ
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          درباره احوال دل، شعر، عرفان و حکمت زندگی پرسش‌های خود را مطرح کنید.
        </p>
      </div>

      {/* Chat Box */}
      <div className="flex-1 bg-[#12141d] border border-amber-500/20 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2 pl-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                m.role === 'user' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-gradient-to-br from-amber-500 to-amber-700 text-amber-950 font-bold'
              }`}>
                {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed font-['Amiri',serif] text-lg ${
                m.role === 'user'
                  ? 'bg-amber-500/10 border border-amber-500/20 text-amber-100 rounded-tl-none'
                  : 'bg-[#161822] border border-amber-500/10 text-amber-100 rounded-tr-none'
              }`}>
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-amber-950 font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-[#161822] border border-amber-500/10 rounded-2xl rounded-tr-none p-4 text-amber-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs font-['Vazirmatn']">خواجه در اندیشه پاسخ است...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={sendMessage} className="mt-4 pt-4 border-t border-amber-500/10 flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="پرسش یا راز دل خود را با حافظ در میان بگذارید..."
            className="flex-1 bg-[#0c0d12] border border-amber-500/20 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 py-3 bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
