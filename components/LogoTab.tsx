
import React, { useState } from 'react';
import { generateWithServer } from '../services/geminiService';
import { Palette, Download, Wand2 } from 'lucide-react';

const LogoTab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('Minimalist');
  const [isGenerating, setIsGenerating] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    try {
      const fullPrompt = `A professional logo for a brand named "${prompt}". Style: ${style}. High quality graphic design, clean lines, vector style, white background, masterpiece.`;
      const url = await generateWithServer(fullPrompt);
      setLogoUrl(url);
    } catch (err) {
      alert("Gagal membuat logo.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl h-fit">
        <h2 className="text-2xl font-bold text-yellow-500 mb-6 flex items-center gap-2">
          <Palette size={24} /> Logo Maker AI
        </h2>
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">Nama Brand / Konsep</label>
            <input 
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
              placeholder="Misal: Kedai Kopi Modern..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-400 mb-2 block">Gaya Visual</label>
            <div className="grid grid-cols-2 gap-2">
              {['Minimalist', 'Vintage', 'Luxury', 'Futuristic', 'Playful', 'Abstract'].map(s => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`p-3 rounded-xl text-xs font-bold transition-all border ${
                    style === s ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-gray-900 border-gray-800 text-gray-500'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full py-4 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Wand2 size={20} />}
            Hasilkan Konsep Logo
          </button>
        </div>
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 flex flex-col items-center justify-center p-8 min-h-[400px]">
        {logoUrl ? (
          <div className="space-y-6 text-center">
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <img src={logoUrl} className="w-64 h-64 object-contain" alt="Logo preview" />
            </div>
            <a 
              href={logoUrl} 
              download="logo-concept.png"
              className="inline-flex items-center gap-2 px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-bold transition-all"
            >
              <Download size={16} /> Unduh (.png)
            </a>
          </div>
        ) : (
          <div className="text-gray-700 text-center">
            <Palette size={64} className="mx-auto mb-4 opacity-10" />
            <p className="max-w-xs">Konsep logo Anda akan muncul di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogoTab;
