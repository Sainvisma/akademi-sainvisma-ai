
import React, { useState } from 'react';
import { generateWithServer } from '../services/geminiService';
import { ScriptData } from '../types';
import { FileText, Send, Copy, Clapperboard } from 'lucide-react';

const ScriptTab: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('TikTok');
  const [tone, setTone] = useState('Viral/Energik');
  const [isGenerating, setIsGenerating] = useState(false);
  const [script, setScript] = useState<ScriptData | null>(null);

  const handleGenerate = async () => {
    if (!topic) return;
    setIsGenerating(true);
    try {
      const data = await generateWithServer(topic, platform, tone);
      setScript(data);
    } catch (err) {
      alert("Gagal membuat skrip.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (!script) return;
    const text = script.scenes.map((s, i) => `Scene ${i+1}\nVisual: ${s.visual}\nAudio: ${s.audio}`).join('\n\n');
    navigator.clipboard.writeText(text);
    alert("Skrip disalin ke clipboard!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="space-y-6">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <h2 className="text-xl font-bold text-rose-400 flex items-center gap-2 mb-4">
            <FileText size={20} /> Ide Video
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Topik Video</label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Misal: Review sepatu lari lokal untuk pemula..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-rose-500 focus:outline-none h-24"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Platform</label>
                <select 
                  value={platform} 
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-gray-300"
                >
                  <option>TikTok</option>
                  <option>Instagram Reels</option>
                  <option>YouTube Shorts</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-bold uppercase mb-1 block">Nada Bicara</label>
                <select 
                  value={tone} 
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg p-2 text-sm text-gray-300"
                >
                  <option>Viral/Energik</option>
                  <option>Informatif/Edukasi</option>
                  <option>Emosional/Storytelling</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !topic}
          className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Send size={20} />}
          Buat Skrip Sekarang
        </button>
      </div>

      <div className="lg:col-span-2">
        {script ? (
          <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="font-bold text-rose-300 flex items-center gap-2"><Clapperboard size={18} /> {script.title}</h3>
              <button onClick={copyToClipboard} className="p-2 hover:bg-gray-700 rounded-lg transition-colors text-gray-400">
                <Copy size={18} />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[600px] overflow-y-auto custom-scrollbar">
              {script.scenes.map((scene, i) => (
                <div key={i} className="grid grid-cols-1 md:grid-cols-12 gap-4 border-b border-gray-700 pb-6 last:border-0 last:pb-0">
                  <div className="md:col-span-1 text-xs font-bold text-gray-600">#{i+1}</div>
                  <div className="md:col-span-6">
                    <span className="text-[10px] uppercase text-rose-500 font-bold mb-1 block">Visual / Aksi</span>
                    <p className="text-sm text-gray-200">{scene.visual}</p>
                  </div>
                  <div className="md:col-span-5 bg-gray-900/50 p-3 rounded-xl border border-gray-700/50">
                    <span className="text-[10px] uppercase text-cyan-500 font-bold mb-1 block">Audio / Narasi</span>
                    <p className="text-sm text-gray-300 italic">"{scene.audio}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-2xl p-12 text-center">
            <FileText size={48} className="mb-4 opacity-20" />
            <p>Masukkan ide video Anda untuk mendapatkan skrip terperinci</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScriptTab;
