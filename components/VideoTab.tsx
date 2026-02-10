
import React, { useState } from 'react';
import { generateWithServer } from '../services/geminiService';
import { Video, Play, AlertCircle, ExternalLink, Loader2 } from 'lucide-react';

const VideoTab: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [progressMessage, setProgressMessage] = useState('');

  const handleGenerate = async () => {
    // Check for API Key first for Veo
    if (!(await (window as any).aistudio.hasSelectedApiKey())) {
      await (window as any).aistudio.openSelectKey();
      // Proceeding after triggering openSelectKey as per instructions
    }

    setIsGenerating(true);
    setVideoUrl(null);
    setProgressMessage('Memulai mesin kreatif Veo...');

    try {
      const ai = getAI();
      let operation = await generateWithServer({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '9:16'
        }
      });

      setProgressMessage('Gemini sedang menyusun bingkai visual... (Proses ini memakan waktu 1-2 menit)');

      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const fetchUrl = `${downloadLink}&key=${process.env.API_KEY}`;
        setVideoUrl(fetchUrl);
      }
    } catch (err: any) {
      console.error(err);
      if (err.message?.includes("Requested entity was not found")) {
        alert("Terjadi masalah dengan API Key. Silakan pilih kembali.");
        await (window as any).aistudio.openSelectKey();
      } else {
        alert("Gagal membuat video. Pastikan Anda menggunakan API Key yang valid dari project berbayar.");
      }
    } finally {
      setIsGenerating(false);
      setProgressMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-600/20 rounded-xl text-indigo-400">
            <Video size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Veo Video Generator</h2>
            <p className="text-gray-400 text-sm">Hasilkan video pendek berkualitas tinggi dari teks.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-blue-900/20 border border-blue-800/50 p-4 rounded-xl flex gap-3 text-xs text-blue-300">
            <AlertCircle size={16} className="shrink-0" />
            <p>Fitur ini memerlukan <b>Paid API Key</b>. Jika Anda belum menyetelnya, klik tombol buat untuk membuka dialog pemilihan kunci. <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline inline-flex items-center gap-1">Pelajari Billing <ExternalLink size={10} /></a></p>
          </div>

          <textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[120px]"
            placeholder="Deskripsikan video yang Anda inginkan secara detail... (Contoh: Kucing mengenakan kacamata hitam sedang bersantai di pantai saat matahari terbenam, gaya sinematik)"
          />

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" size={20} />
                <span>Memproses...</span>
              </div>
            ) : (
              <>
                <Play size={20} /> Hasilkan Video (Veo)
              </>
            )}
          </button>
        </div>
      </div>

      {isGenerating && (
        <div className="text-center space-y-4 animate-pulse">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-indigo-400 font-medium">{progressMessage}</p>
        </div>
      )}

      {videoUrl && (
        <div className="bg-gray-800 p-4 rounded-2xl border border-gray-700 animate-in fade-in slide-in-from-bottom-4">
          <video src={videoUrl} controls className="w-full rounded-xl aspect-[9/16] max-h-[600px] mx-auto bg-black" />
          <div className="mt-4 text-center">
            <a 
              href={videoUrl} 
              target="_blank" 
              className="text-xs text-indigo-400 hover:underline"
            >
              Link Video Langsung (Klik kanan untuk simpan)
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTab;
