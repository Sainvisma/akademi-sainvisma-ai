
import React, { useState } from 'react';
import { VOICES } from '../constants';
import { generateWithServer } from '../services/geminiService';
// Fix: Added missing Wand2 import.
import { Mic, Play, Download, Trash2, Volume2, Wand2 } from 'lucide-react';

const VoiceOverTab: React.FC = () => {
  const [text, setText] = useState('');
  const [selectedVoiceId, setSelectedVoiceId] = useState(VOICES[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  // Fix: Implemented manual audio playback logic using AudioContext for raw PCM data as per guidelines.
  const playPCM = async (base64: string) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass({ sampleRate: 24000 });
      const data = decodeBase64(base64);
      const buffer = await generateWithServer(data, ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start();
    } catch (err) {
      console.error("Playback failed:", err);
    }
  };

  const handleGenerate = async () => {
    if (!text) return;
    setIsGenerating(true);
    try {
      const base64 = await generateTTS(text, selectedVoiceId);
      setAudioBase64(base64);
      // Automatically play the generated audio stream.
      await playPCM(base64);
    } catch (err) {
      alert("Gagal membuat audio. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePreview = async (voiceId: string) => {
    setPreviewingId(voiceId);
    try {
      const base64 = await generateTTS("Ini adalah contoh suara saya.", voiceId);
      await playPCM(base64);
    } catch (err) {
      console.error("Preview failed:", err);
    } finally {
      setPreviewingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400">
            <Mic size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Voice Over Pro</h2>
            <p className="text-gray-400 text-sm">Ubah teks skrip menjadi suara profesional dalam sekejap.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Naskah Suara</label>
              <button 
                onClick={() => setText('')}
                className="text-gray-500 hover:text-red-400 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl p-4 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              placeholder="Masukkan teks yang ingin diubah menjadi suara..."
              rows={6}
            />
            <div className="text-right text-xs text-gray-500 mt-2">
              {text.length} karakter
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 block mb-4">Pilih Karakter Suara</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {VOICES.map((voice) => (
                <button
                  key={voice.id}
                  onClick={() => setSelectedVoiceId(voice.id)}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    selectedVoiceId === voice.id
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                      : 'bg-gray-900 border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  <div className="text-left">
                    <div className="font-bold text-sm">{voice.name}</div>
                    <div className="text-[10px] opacity-60 uppercase">{voice.gender}</div>
                  </div>
                  <div 
                    onClick={(e) => { e.stopPropagation(); handlePreview(voice.id); }}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    {previewingId === voice.id ? (
                      <div className="animate-pulse"><Volume2 size={16} /></div>
                    ) : (
                      <Play size={16} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerating || !text}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <Wand2 size={20} />
            )}
            Hasilkan Audio
          </button>
        </div>
      </div>

      {audioBase64 && (
        <div className="bg-blue-900/20 border border-blue-800/50 p-6 rounded-2xl flex flex-col items-center gap-4 animate-in fade-in slide-in-from-bottom-4">
          <h3 className="font-bold text-blue-300">Hasil Voice Over Selesai</h3>
          <p className="text-gray-400 text-sm">Audio PCM mentah telah dimuat.</p>
          <div className="flex gap-4">
            <button
              onClick={() => playPCM(audioBase64)}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold transition-all"
            >
              <Play size={18} /> Putar Ulang
            </button>
            <a
              href={`data:audio/pcm;base64,${audioBase64}`}
              download="voiceover.pcm"
              className="flex items-center gap-2 px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-bold transition-all"
            >
              <Download size={18} /> Unduh (.pcm)
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoiceOverTab;
