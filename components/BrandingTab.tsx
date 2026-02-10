
import React, { useState } from 'react';
import { generateWithServer } from '../services/geminiService';
import { BrandingData } from '../types';
import { Brain, Palette, Lightbulb, Target } from 'lucide-react';

const BrandingTab: React.FC = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<BrandingData | null>(null);

  const handleGenerate = async () => {
    if (!name || !desc) return;
    setIsGenerating(true);
    try {
      const result = await generateWithServer(name, desc);
      setData(result);
    } catch (err) {
      alert("Gagal membuat branding kit.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-purple-400 mb-6 flex items-center gap-2">
          <Brain size={24} /> Brand Identity Architect
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1 block">Nama Bisnis</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Misal: CoffeeSain"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 mb-1 block">Apa yang Anda Jual / Lakukan?</label>
            <textarea 
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none h-24"
              placeholder="Ceritakan tentang visi, produk utama, dan target pasar Anda..."
            />
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !name || !desc}
            className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {isGenerating ? "Membangun Strategi..." : "Hasilkan Branding Kit"}
          </button>
        </div>
      </div>

      {data && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 space-y-4">
            <h3 className="font-bold text-purple-300 flex items-center gap-2"><Lightbulb size={18} /> Slogan & Tagline</h3>
            <div className="space-y-2">
              {data.slogans.map((s, i) => (
                <p key={i} className="p-3 bg-gray-900 rounded-xl text-sm italic">"{s}"</p>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 space-y-4">
            <h3 className="font-bold text-purple-300 flex items-center gap-2"><Palette size={18} /> Palet Warna</h3>
            <div className="grid grid-cols-2 gap-3">
              {data.colors.map((c, i) => (
                <div key={i} className="bg-gray-900 p-2 rounded-xl border border-gray-700">
                  <div className="w-full h-10 rounded-lg mb-2" style={{ backgroundColor: c.hex }} />
                  <p className="text-[10px] font-bold text-gray-500">{c.hex}</p>
                  <p className="text-xs text-gray-300">{c.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 space-y-4">
            <h3 className="font-bold text-purple-300 flex items-center gap-2"><Target size={18} /> Pilar Konten</h3>
            <div className="space-y-3">
              {data.contentPillars.map((p, i) => (
                <div key={i} className="bg-gray-900 p-3 rounded-xl">
                  <p className="text-xs font-bold text-purple-400 mb-1">{p.title}</p>
                  <p className="text-[11px] text-gray-400">{p.idea}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrandingTab;
