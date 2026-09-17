import React from 'react';
import { BookOpen, LayoutDashboard, FileText, BarChart3, Archive, Settings, LogOut, LogIn, Sprout } from 'lucide-react';
import { DocumentCategory } from '../types';

interface SidebarProps {
  activeCategory: DocumentCategory | 'Dashboard';
  setActiveCategory: (category: DocumentCategory | 'Dashboard') => void;
  isAdmin: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onSettingsClick: () => void;
}

export function Sidebar({ activeCategory, setActiveCategory, isAdmin, onLoginClick, onLogoutClick, onSettingsClick }: SidebarProps) {
  const categories: { name: DocumentCategory; icon: React.ReactNode }[] = [
    { name: 'Renstra', icon: <BookOpen className="w-5 h-5" /> },
    { name: 'Renja', icon: <FileText className="w-5 h-5" /> },
    { name: 'LAKIP/SAKIP', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Evaluasi Renja', icon: <FileText className="w-5 h-5" /> },
    { name: 'Laporan Interim', icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-slate-950 to-indigo-950/90 text-white flex flex-col h-screen sticky top-0 border-r border-slate-800/50 shadow-2xl relative z-30">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
      
      <div className="p-8 flex items-center gap-4 border-b border-white/5 relative z-10">
        <div className="bg-gradient-to-br from-emerald-400 to-teal-600 p-2.5 rounded-xl shadow-lg shadow-emerald-500/20">
          <Sprout className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-xl tracking-tight leading-tight">E-Perpus</h1>
          <p className="text-xs text-slate-400 font-medium tracking-wide mt-0.5">DKPPP Cirebon</p>
        </div>
      </div>

      <nav className="flex-1 p-5 space-y-1 overflow-y-auto relative z-10">
        <div className="mb-6">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Utama</p>
          <button
            onClick={() => setActiveCategory('Dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              activeCategory === 'Dashboard' 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/20' 
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
        </div>

        <div className="mb-4">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Kategori Dokumen</p>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium mb-1.5 ${
                activeCategory === cat.name 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25 border border-emerald-400/20' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-white/10 space-y-1.5">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Sistem</p>
          {isAdmin ? (
            <>
              <button onClick={onSettingsClick} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all font-medium">
                <Settings className="w-5 h-5" />
                Pengaturan
              </button>
              <button onClick={onLogoutClick} className="w-full flex items-center gap-3 px-4 py-3 text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all font-medium">
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </>
          ) : (
            <button onClick={onLoginClick} className="w-full flex items-center gap-3 px-4 py-3 text-emerald-400/80 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-xl transition-all font-medium">
              <LogIn className="w-5 h-5" />
              Login Admin
            </button>
          )}
        </div>
      </nav>
    </aside>
  );
}
