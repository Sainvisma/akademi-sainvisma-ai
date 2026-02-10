
import React, { useState } from 'react';
import { generateWithServer } from '../services/geminiService';
import { Sparkles, Image as ImageIcon, Wand2, Lightbulb } from 'lucide-react';

const PosesTab: React.FC = () => {
  const [customPose, setCustomPose] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const inspirations = [
    'Duduk santai di tangga urban',
    'Melompat bahagia dengan gaya high-fashion',
    'Menyender di kap mobil klasik',
    'Pose fierce dengan latar belakang neon',
    'Berjalan elegan di trotoar Paris'
  ];

  const handleGenerate = async () => {
    if (!customPose.trim()) {
      alert("Silakan masukkan deskripsi pose terlebih dahulu.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const prompt = `A professional fashion model performing exactly this pose: "${customPose}". High-end fashion photography, studio quality, sharp focus, 8k resolution, cinematic lighting, trendy outfit, minimalist but aesthetic background.`;
      const url = await generateWithServer(prompt);
      setResultImage(url);
    } catch (err) {
      alert("Gagal memvisualisasikan pose. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-2xl font-bold text-cyan-400">Custom Pose Architect</h2>
          </div>
          <p className="text-gray-400 text-sm mb-6">
            Deskripsikan pose fashion yang Anda inginkan secara detail. AI akan memvisualisasikannya sebagai referensi pemotretan Anda.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Deskripsi Pose Anda</label>
              <textarea
                value={customPose}
                onChange={(e) => setCustomPose(e.target.value)}
                placeholder="Contoh: Model wanita sedang duduk di kursi rotan dengan gaya santai tapi elegan, satu tangan memegang dagu..."
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition-all h-32 resize-none"
              />
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-600 uppercase flex items-center gap-1">
                <Lightbulb size={12} /> Butuh Inspirasi? Klik saran di bawah:
              </p>
              <div className="flex flex-wrap gap-2">
                {inspirations.map((text, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCustomPose(text)}
                    className="px-3 py-1 bg-gray-900 border border-gray-700 rounded-full text-[11px] text-gray-400 hover:border-cyan-500 hover:text-cyan-400 transition-all"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !customPose.trim()}
          className="w-full py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isGenerating ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
          ) : (
            <Wand2 size={20} />
          )}
          Visualisasikan Pose Kustom
        </button>
      </div>

      <div className="flex flex-col items-center justify-center bg-gray-900 rounded-2xl border border-gray-800 p-6 min-h-[500px] relative overflow-hidden">
        {resultImage ? (
          <div className="w-full h-full flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
            <div className="relative group">
              <img 
                src={resultImage} 
                className="max-w-full rounded-xl shadow-2xl border border-gray-700" 
                alt="Pose visualization" 
              />
              <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
            </div>
            <div className="bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl border border-gray-700 max-w-md">
              <p className="text-cyan-300 text-center text-sm italic font-medium">
                <Sparkles size={14} className="inline mr-2" />
                "{customPose}"
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto border border-gray-700 text-gray-700 animate-pulse">
              <ImageIcon size={40} />
            </div>
            <div className="space-y-2">
              <p className="text-gray-400 font-bold">Siap Beraksi?</p>
              <p className="text-gray-600 text-sm max-w-xs mx-auto">Tuliskan instruksi pose di sebelah kiri dan biarkan AI memberikan referensi visualnya.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PosesTab;
