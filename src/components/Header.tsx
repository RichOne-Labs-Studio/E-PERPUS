import React from 'react';
import { Search, Bell, User } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function Header({ searchQuery, setSearchQuery }: HeaderProps) {
  return (
    <header className="bg-white/70 backdrop-blur-md border-b border-white/50 shadow-sm h-20 flex items-center justify-between px-8 sticky top-0 z-20">
      <div className="flex-1 max-w-2xl">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
          <input
            type="text"
            placeholder="Cari dokumen, laporan, atau kata kunci..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-5 ml-4">
        <button className="p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-700 rounded-full relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-10 w-10 bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-semibold shadow-sm cursor-pointer hover:shadow-md transition-shadow">
          <User className="w-5 h-5" />
        </div>
      </div>
    </header>
  );
}
