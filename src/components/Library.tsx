import React from 'react';
import { Filter, FileText, Plus, Trash2 } from 'lucide-react';
import { Document, DocumentCategory } from '../types';

interface LibraryProps {
  documents: Document[];
  category: DocumentCategory;
  searchQuery: string;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  onDocumentClick: (doc: Document) => void;
  isAdmin: boolean;
  onDeleteDoc: (id: string) => void;
  onAddDocClick: () => void;
}

export function Library({ documents, category, searchQuery, selectedYear, setSelectedYear, onDocumentClick, isAdmin, onDeleteDoc, onAddDocClick }: LibraryProps) {
  const years = ['Semua', '2024', '2023', '2022', '2021', '2020'];
  
  const filteredDocs = documents.filter(doc => {
    const matchCategory = category === 'Semua' || doc.category === category;
    const matchSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchYear = selectedYear === 'Semua' || doc.year.toString() === selectedYear;
    return matchCategory && matchSearch && matchYear;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">{category === 'Semua' ? 'Semua Dokumen' : category}</h2>
          <p className="text-slate-500 mt-1 text-sm font-medium">Menampilkan {filteredDocs.length} dokumen laporan.</p>
        </div>
        
        <div className="flex items-center gap-3">
          {isAdmin && (
            <button onClick={onAddDocClick} className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2.5 rounded-xl font-bold hover:shadow-lg hover:shadow-emerald-500/25 transition-all border border-emerald-400/20">
              <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Tambah Dokumen</span>
            </button>
          )}
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-white shadow-sm rounded-xl px-4 py-2.5 hover:shadow-md transition-all">
            <Filter className="w-4 h-4 text-emerald-500 shrink-0" />
            <select 
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent border-none text-sm focus:outline-none text-slate-700 font-semibold cursor-pointer appearance-none pr-4"
            >
              {years.map(y => <option key={y} value={y}>{y === 'Semua' ? 'Tahun: Semua' : `Tahun: ${y}`}</option>)}
            </select>
          </div>
        </div>
      </div>

      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredDocs.map(doc => (
            <div 
              key={doc.id} 
              onClick={() => onDocumentClick(doc)}
              className="bg-white/80 backdrop-blur-md rounded-2xl border border-white shadow-xl shadow-slate-200/40 overflow-hidden hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col h-full relative"
            >
              {isAdmin && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteDoc(doc.id); }}
                  className="absolute top-3 left-3 bg-rose-500/90 hover:bg-rose-600 text-white p-2 rounded-xl opacity-0 group-hover:opacity-100 transition-all z-20 shadow-md backdrop-blur-sm"
                  title="Hapus Dokumen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className={`h-40 ${doc.coverColor} bg-gradient-to-br from-white/20 to-black/20 flex items-center justify-center relative shrink-0 overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                {doc.coverBase64 ? (
                  <img src={doc.coverBase64} alt={`Cover ${doc.title}`} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <FileText className="w-16 h-16 text-white opacity-90 group-hover:scale-110 transition-transform duration-500 drop-shadow-md" />
                )}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
                  {doc.type}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col relative bg-white">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 uppercase tracking-wider">
                    {doc.category}
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold bg-slate-50 px-2.5 py-1 rounded-md">{doc.year}</span>
                </div>
                <h3 className="font-extrabold text-slate-800 mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors leading-tight text-lg">
                  {doc.title}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2 mb-6 flex-1 font-medium leading-relaxed">
                  {doc.description}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 shrink-0 font-medium">
                  <span>{doc.dateAdded}</span>
                  <span className="bg-slate-50 px-2 py-1 rounded text-slate-500">{doc.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-xl rounded-3xl border border-white py-24 flex flex-col items-center justify-center text-center shadow-xl shadow-slate-200/40">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-white rounded-full flex items-center justify-center mb-6 shadow-inner">
            <FileText className="w-10 h-10 text-slate-300" />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-2">Tidak ada dokumen ditemukan</h3>
          <p className="text-slate-500 max-w-md font-medium">Coba sesuaikan kata kunci pencarian atau ubah filter tahun untuk menemukan laporan yang Anda butuhkan.</p>
        </div>
      )}
    </div>
  );
}
