import React from 'react';
import { FileText, FolderOpen, Calendar, Clock, Trash2 } from 'lucide-react';
import { Document } from '../types';

interface DashboardOverviewProps {
  documents: Document[];
  onDocumentClick: (doc: Document) => void;
  onViewAllClick: () => void;
  isAdmin: boolean;
  onDeleteDoc: (id: string) => void;
}

export function DashboardOverview({ documents, onDocumentClick, onViewAllClick, isAdmin, onDeleteDoc }: DashboardOverviewProps) {
  // Stats
  const totalDocs = documents.length;
  const recentDocs = documents.slice(0, 4);
  const categoriesCount = new Set(documents.map(d => d.category)).size;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-xl shadow-slate-200/40 flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-emerald-100 to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 text-white rounded-xl flex items-center justify-center shrink-0 mb-4 shadow-md shadow-emerald-500/20">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Total Dokumen</p>
            <p className="text-3xl font-extrabold text-slate-800">{totalDocs}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-xl shadow-slate-200/40 flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-xl flex items-center justify-center shrink-0 mb-4 shadow-md shadow-blue-500/20">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Kategori Aktif</p>
            <p className="text-3xl font-extrabold text-slate-800">{categoriesCount}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-xl shadow-slate-200/40 flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-amber-100 to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-xl flex items-center justify-center shrink-0 mb-4 shadow-md shadow-amber-500/20">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Tahun Anggaran</p>
            <p className="text-3xl font-extrabold text-slate-800">2024</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-white shadow-xl shadow-slate-200/40 flex flex-col relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br from-purple-100 to-transparent rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 text-white rounded-xl flex items-center justify-center shrink-0 mb-4 shadow-md shadow-purple-500/20">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium mb-1">Aktivitas Terakhir</p>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">Hari ini</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white shadow-xl shadow-slate-200/40 overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-100/50 flex justify-between items-center bg-white/50">
          <h2 className="text-lg font-bold text-slate-800">Dokumen Terbaru</h2>
          <button onClick={onViewAllClick} className="text-sm text-emerald-600 hover:text-emerald-700 font-semibold px-4 py-2 hover:bg-emerald-50 rounded-lg transition-colors">Lihat Semua</button>
        </div>
        <div className="divide-y divide-slate-100/60 p-2">
          {recentDocs.map(doc => (
            <div key={doc.id} className="p-4 mx-2 my-1 rounded-xl hover:bg-white hover:shadow-sm transition-all flex items-center justify-between group cursor-pointer border border-transparent hover:border-slate-100" onClick={() => onDocumentClick(doc)}>
              <div className="flex items-center gap-5">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white overflow-hidden ${doc.coverColor} bg-gradient-to-br from-white/20 to-transparent shrink-0 shadow-inner`}>
                  {doc.coverBase64 ? (
                    <img src={doc.coverBase64} alt="Cover" className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800 group-hover:text-emerald-600 transition-colors leading-tight mb-1">{doc.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">{doc.category}</span>
                    <span className="text-slate-300">•</span>
                    <span>Tahun {doc.year}</span>
                    <span className="text-slate-300">•</span>
                    <span>{doc.size}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 ml-4">
                {isAdmin && (
                  <button onClick={(e) => { e.stopPropagation(); onDeleteDoc(doc.id); }} className="text-rose-600 bg-rose-50 px-3 py-2 rounded-lg text-sm font-semibold shrink-0 mr-2 hover:bg-rose-100 border border-rose-100 flex items-center gap-1" title="Hapus">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button className="text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg text-sm font-semibold shrink-0 border border-emerald-100">
                  Buka
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
