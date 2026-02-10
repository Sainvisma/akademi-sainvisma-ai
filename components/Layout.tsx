
import React from 'react';
import { TabName } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const tabs: { id: TabName; label: string; color: string }[] = [
    { id: 'broll', label: '✨ Foto Produk', color: 'text-teal-400' },
    { id: 'poses', label: '💃 Pose Fashion', color: 'text-cyan-400' },
    { id: 'script', label: '🎬 Kreator Skrip', color: 'text-rose-400' },
    { id: 'voiceover', label: '🎤 Voice Over', color: 'text-blue-400' },
    { id: 'video', label: '🎥 Video Generator', color: 'text-indigo-400' },
    { id: 'branding', label: '🧠 Branding', color: 'text-purple-400' },
    { id: 'logo', label: '🎨 Logo Maker', color: 'text-yellow-400' },
    { id: 'mentor', label: '🎓 Mentor Bisnis', color: 'text-emerald-400' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <header className="py-6 md:py-8 px-4 text-center">
        <h1 className="text-3xl md:text-6xl font-bold bg-gradient-to-r from-teal-500 to-lime-500 bg-clip-text text-transparent">
          Akademi Sainvisma
        </h1>
        <p className="mt-2 text-sm md:text-base text-gray-400">Kreasi Visual Praktis dengan AI</p>
      </header>

      <nav className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 overflow-x-auto scrollbar-hide">
        <div className="max-w-7xl mx-auto flex whitespace-nowrap px-2 md:justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-4 md:px-6 py-4 text-xs md:text-sm font-bold transition-all border-b-2 flex-shrink-0 ${
                activeTab === tab.id
                  ? `${tab.color} border-current bg-white/5`
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto w-full p-4 md:p-8 flex-1">
        {children}
      </main>
      
      <footer className="py-6 text-center text-[10px] text-gray-600 border-t border-gray-800">
        &copy; 2024 Akademi Sainvisma AI • Dibuat untuk Kreator Indonesia
      </footer>
    </div>
  );
};

export default Layout;
