
import React, { useState, useRef, useEffect } from 'react';
import { generateWithServer } from '../services/geminiService';
import { MessageSquare, Send, User, Bot, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';

const MentorTab: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initChat = () => {
      const ai = getAI();
      const newChat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: 'Anda adalah "Mentor Bisnis Sainvisma", konsultan bisnis elit yang ahli dalam strategi pemasaran digital, operasional UMKM, dan pertumbuhan startup. Berikan jawaban yang praktis, suportif, dan profesional dalam Bahasa Indonesia.',
        },
      });
      setChat(newChat);
      setMessages([{ role: 'model', text: 'Halo! Saya Mentor Bisnis Anda. Apa yang ingin Anda diskusikan hari ini? Strategi pemasaran, manajemen stok, atau ide bisnis baru?' }]);
    };
    initChat();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chat || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const result = await generateWithServer({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text || 'Maaf, saya tidak bisa merespon saat ini.' }]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'model', text: 'Terjadi kesalahan koneksi. Silakan coba lagi.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-280px)] min-h-[500px] flex flex-col bg-gray-800 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
      <div className="p-4 bg-emerald-900/30 border-b border-emerald-900/50 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shrink-0">
          <Bot className="text-white" size={24} />
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-emerald-400 truncate text-sm md:text-base">Mentor Bisnis Sainvisma</h2>
          <p className="text-[9px] text-emerald-600 uppercase font-black">Online & Aktif</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 custom-scrollbar bg-gray-900/20">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] md:max-w-[85%] p-3 md:p-4 rounded-2xl text-xs md:text-sm leading-relaxed shadow-sm ${
              m.role === 'user' 
              ? 'bg-emerald-600 text-white rounded-tr-none' 
              : 'bg-gray-900 border border-gray-700 text-gray-300 rounded-tl-none'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 border border-gray-700 p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-emerald-500" />
              <span className="text-[10px] text-gray-500 italic">Berpikir...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 md:p-4 bg-gray-900/50 border-t border-gray-700">
        <div className="flex gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ketik pertanyaan bisnis..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-200 placeholder:text-gray-600"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white transition-all disabled:opacity-50 shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorTab;
