
import React, { useState } from 'react';
import { ImageData } from '../types';
import { generateWithServer } from '../services/geminiService';
import { Plus, Trash2, Camera, Wand2, Download, Layers, User } from 'lucide-react';

const BrollTab: React.FC = () => {
  const [productImages, setProductImages] = useState<ImageData[]>([]);
  const [modelImage, setModelImage] = useState<ImageData | null>(null);
  const [description, setDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [orientation, setOrientation] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ id: number; url: string; title: string }[]>([]);

  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    // Fix: Explicitly type file as File in handleProductUpload to resolve unknown type errors.
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = (event.target?.result as string).split(',')[1];
        setProductImages(prev => [...prev, { id: Math.random().toString(), base64, mimeType: file.type }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = (event.target?.result as string).split(',')[1];
      setModelImage({ id: 'model', base64, mimeType: file.type });
    };
    reader.readAsDataURL(file);
  };

  const handleAutoDesc = async () => {
    if (productImages.length === 0) return;
    setIsAnalyzing(true);
    try {
      const desc = await generateWithServer(
        productImages.map(img => img.base64),
        productImages.map(img => img.mimeType)
      );
      setDescription(desc);
    } catch (err) {
      alert("Gagal menganalisa produk.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerate = async () => {
    if (!description || productImages.length === 0) return;
    setIsGenerating(true);
    setResults([]);
    
    const simulatedPrompts = [
      { title: "Dynamic Action", prompt: "Product in dynamic motion with splash effects, high speed photography" },
      { title: "Minimalist Studio", prompt: "Clean minimalist studio lighting on marble or high-end surface" },
      { title: "Outdoor Lifestyle", prompt: "Product being used in a lush outdoor setting with natural sunlight" },
      { title: "Macro Detail", prompt: "Extreme close up focusing on texture, material, and craftsmanship" },
      { title: "Luxury Mood", prompt: "Dark mood lighting with velvet, gold accents and sophisticated shadows" },
      { title: "Pop Art", prompt: "Vibrant colors and bold shadows, artistic pop art studio style" },
      { title: "Professional Flat Lay", prompt: "Overhead top-down view, organized aesthetic arrangement on neutral background" },
      { title: "Urban Street", prompt: "Cool urban street setting, concrete textures, morning city light" },
      { title: "Soft Bokeh", prompt: "Dreamy soft blurred background with beautiful light circles (bokeh)" },
      { title: "E-commerce Clean", prompt: "Pure commercial shot, high-key lighting, ready for marketplace use" }
    ];

    try {
      const genPromises = simulatedPrompts.map(async (p, idx) => {
        const fullPrompt = `${p.prompt}. Orientation: ${orientation}. Product: ${description}. ${theme}. Photorealistic, 8k, professional catalog style. ${modelImage ? "Include the model from reference in the scene naturally." : ""}`;
        const url = await generateImage(fullPrompt, [...productImages, ...(modelImage ? [modelImage] : [])]);
        return { id: idx, url: url || '', title: p.title };
      });

      const finalResults = await Promise.all(genPromises);
      setResults(finalResults.filter(r => r.url));
    } catch (err) {
      alert("Gagal menghasilkan foto. Silakan coba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div className="space-y-6">
        <section className="bg-gray-800 p-5 md:p-6 rounded-2xl border border-gray-700 shadow-xl">
          <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2 text-teal-400 uppercase tracking-tight">
            <Plus size={18} /> Input Kreatif
          </h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Foto Produk (Wajib)</p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mb-2">
                {productImages.map(img => (
                  <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-700">
                    <img src={`data:${img.mimeType};base64,${img.base64}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setProductImages(prev => prev.filter(p => p.id !== img.id))}
                      className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-500/5 transition-all text-gray-500 hover:text-teal-400">
                  <Plus size={20} />
                  <span className="text-[8px] mt-1 font-bold">Tambah</span>
                  <input type="file" className="hidden" multiple onChange={handleProductUpload} />
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Foto Model (Opsional)</p>
              <div className="flex gap-3">
                {modelImage ? (
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-teal-500 shadow-lg shadow-teal-500/20">
                    <img src={`data:${modelImage.mimeType};base64,${modelImage.base64}`} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setModelImage(null)}
                      className="absolute top-1 right-1 p-1 bg-red-500/80 rounded-full text-white"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ) : (
                  <label className="w-16 h-16 flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-500/5 transition-all text-gray-500 hover:text-teal-400">
                    <User size={20} />
                    <span className="text-[8px] mt-1 font-bold uppercase">Foto</span>
                    <input type="file" className="hidden" onChange={handleModelUpload} />
                  </label>
                )}
                <div className="flex-1 text-[10px] text-gray-500 flex items-center italic leading-tight">
                  Model Anda akan muncul di dalam scene secara otomatis.
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase">Deskripsi Produk</p>
                <button 
                  onClick={handleAutoDesc}
                  disabled={isAnalyzing || productImages.length === 0}
                  className="text-[9px] font-bold flex items-center gap-1 text-teal-400 hover:text-teal-300 disabled:opacity-50 uppercase tracking-wider bg-teal-400/10 px-2 py-1 rounded-md"
                >
                  <Wand2 size={10} /> {isAnalyzing ? '...' : 'Otomatis'}
                </button>
              </div>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none h-24 resize-none"
                placeholder="Misal: Botol parfum kaca mewah..."
              />
            </div>
          </div>
        </section>

        <section className="bg-gray-800 p-5 md:p-6 rounded-2xl border border-gray-700 shadow-xl">
          <h2 className="text-lg font-bold mb-4 text-teal-400 uppercase tracking-tight">Pengaturan</h2>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Tema</p>
              <input 
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-xl p-3 text-xs focus:ring-2 focus:ring-teal-500 focus:outline-none"
                placeholder="Misal: Cyberpunk, Tropis..."
              />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Orientasi</p>
              <div className="flex gap-2">
                {(['horizontal', 'vertical'] as const).map(o => (
                  <button
                    key={o}
                    onClick={() => setOrientation(o)}
                    className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                      orientation === o ? 'bg-teal-900/30 border-teal-500 text-teal-400' : 'bg-gray-900 border-gray-700 text-gray-500'
                    }`}
                  >
                    <div className={`border-2 rounded-sm ${o === 'horizontal' ? 'w-4 h-2.5' : 'w-2.5 h-4'} border-current`} />
                    <span className="text-[10px] font-bold capitalize">{o}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <button 
          onClick={handleGenerate}
          disabled={isGenerating || !description || productImages.length === 0}
          className="w-full py-4 bg-teal-600 hover:bg-teal-500 text-white font-black rounded-2xl shadow-lg shadow-teal-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 text-sm uppercase tracking-widest"
        >
          {isGenerating ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" /> : <Camera size={18} />}
          Generate 10 Foto
        </button>
      </div>

      <div className="lg:col-span-2 space-y-4">
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.map(res => (
              <div key={res.id} className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden group relative shadow-lg">
                <div className={`relative ${orientation === 'vertical' ? 'aspect-[3/4]' : 'aspect-video'} bg-gray-900`}>
                  <img src={res.url} className="w-full h-full object-cover" alt={res.title} loading="lazy" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                    <p className="text-white font-bold text-xs tracking-widest uppercase">{res.title}</p>
                    <a 
                      href={res.url} 
                      download={`${res.title}.png`}
                      className="p-3 bg-teal-600 rounded-full hover:bg-teal-500 transition-transform hover:scale-110"
                    >
                      <Download size={20} className="text-white" />
                    </a>
                  </div>
                </div>
                <div className="p-3 bg-gray-800/80 backdrop-blur-sm border-t border-gray-700 flex justify-between items-center">
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">#{res.id + 1}</span>
                  <h3 className="text-[10px] font-bold text-teal-400 uppercase">{res.title}</h3>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-600 border-2 border-dashed border-gray-800 rounded-2xl p-6 text-center bg-gray-800/20">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent" />
                  <Layers className="absolute inset-0 m-auto text-teal-500 animate-pulse" size={20} />
                </div>
                <div className="space-y-1">
                  <p className="text-teal-400 font-bold">Membangun Katalog...</p>
                  <p className="text-gray-600 text-[10px] italic">Gemini sedang bekerja menciptakan 10 gaya estetik.</p>
                </div>
              </div>
            ) : (
              <div className="opacity-30">
                <Camera size={48} className="mx-auto mb-4" />
                <p className="text-xs font-medium uppercase tracking-widest">Siap untuk hasil luar biasa?</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrollTab;
