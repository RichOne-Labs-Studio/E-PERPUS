import React from 'react';
import { X, Download, Eye, FileText, Share2 } from 'lucide-react';
import { Document } from '../types';

interface DocumentViewerProps {
  document: Document | null;
  onClose: () => void;
}

export function DocumentViewer({ document, onClose }: DocumentViewerProps) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      
      <div className="bg-slate-50 w-full max-w-5xl h-[90vh] rounded-3xl shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-white/50">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-200/60 bg-white/80 backdrop-blur-xl shrink-0 z-20 shadow-sm">
          <div className="flex items-center gap-5">
             <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white overflow-hidden ${document.coverColor} bg-gradient-to-br from-white/20 to-transparent shrink-0 shadow-lg shadow-slate-200/50`}>
                 {document.coverBase64 ? (
                   <img src={document.coverBase64} alt="Cover" className="w-full h-full object-cover" />
                 ) : (
                   <FileText className="w-7 h-7 drop-shadow-md" />
                 )}
             </div>
             <div>
               <h2 className="font-extrabold text-slate-800 text-xl leading-tight line-clamp-1">{document.title}</h2>
               <div className="flex items-center gap-3 mt-1.5 text-[13px] text-slate-500 font-medium">
                 <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{document.category}</span>
                 <span className="text-slate-300">•</span>
                 <span>Tahun {document.year}</span>
                 <span className="text-slate-300">•</span>
                 <span>{document.size}</span>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 ml-4">
            <button 
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:from-emerald-600 hover:to-teal-700 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25 font-bold border border-emerald-400/20" 
              onClick={() => {
                if (document.fileData && document.fileData.length > 0) {
                  if (document.fileData.startsWith('http')) {
                    window.open(document.fileData, '_blank');
                  } else {
                    const link = window.document.createElement('a');
                    link.href = document.fileData;
                    link.download = `${document.title}.${document.type.toLowerCase()}`;
                    link.click();
                  }
                }
              }}
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Unduh {document.type}</span>
            </button>
            <div className="w-px h-8 bg-slate-200 mx-2 hidden sm:block"></div>
            <button className="p-2.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 rounded-xl transition-colors" title="Bagikan">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-slate-400 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-colors" onClick={onClose} title="Tutup">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Viewer Content (Mock or Real) */}
        <div className="flex-1 bg-slate-100/50 p-4 sm:p-8 overflow-y-auto flex items-start justify-center relative">
          {/* Subtle background ornament in the viewer area */}
          <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none"></div>

          {document.fileData && document.fileData.length > 0 ? (
            <div className="bg-white shadow-2xl shadow-slate-200/50 w-full h-full relative flex flex-col border border-slate-100 rounded-lg overflow-hidden z-10">
              <iframe src={document.fileData} className="w-full h-full border-none" title={document.title}></iframe>
            </div>
          ) : (
            <div className="bg-white shadow-2xl shadow-slate-200/50 max-w-3xl w-full min-h-[800px] p-8 sm:p-16 relative flex flex-col border border-slate-100 rounded-lg my-4 z-10">
               {/* Mock PDF Pages */}
               <div className="absolute top-6 right-6 text-[10px] font-mono text-slate-400 border border-slate-200 px-2 py-1 rounded-md bg-slate-50 font-bold tracking-widest">PRATINJAU MOCKUP</div>
               
               <div className="text-center mb-20 mt-12">
                 <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 mb-8 leading-tight tracking-tight">{document.title}</h1>
                 <div className="w-20 h-1.5 bg-gradient-to-r from-emerald-400 to-teal-500 mx-auto mb-8 rounded-full"></div>
                 <h2 className="text-xl font-bold text-slate-700 mb-1 tracking-wide">DINAS KETAHANAN PANGAN, PERTANIAN DAN PERIKANAN</h2>
                 <h3 className="text-lg text-slate-500 font-semibold tracking-wide">KOTA CIREBON</h3>
                 <p className="mt-12 text-emerald-600 font-extrabold tracking-[0.2em] bg-emerald-50 inline-block px-4 py-2 rounded-full">TAHUN {document.year}</p>
               </div>

               <div className="space-y-6 text-slate-600 leading-relaxed mt-12 opacity-40 flex-1 px-8">
                 <div className="h-4 bg-slate-200 rounded-full w-3/4"></div>
                 <div className="h-4 bg-slate-200 rounded-full w-full"></div>
                 <div className="h-4 bg-slate-200 rounded-full w-full"></div>
                 <div className="h-4 bg-slate-200 rounded-full w-5/6"></div>
                 <br/>
                 <div className="h-4 bg-slate-200 rounded-full w-full"></div>
                 <div className="h-4 bg-slate-200 rounded-full w-full"></div>
                 <div className="h-4 bg-slate-200 rounded-full w-4/5"></div>
                 
                 <div className="flex flex-col items-center justify-center p-12 mt-16 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                   <Eye className="w-12 h-12 text-slate-300 mb-5" />
                   <p className="text-center text-sm font-bold text-slate-500">
                     Dokumen ini tidak memiliki file asli yang dilampirkan.
                   </p>
                   <p className="text-center text-xs text-slate-400 mt-2 font-medium">
                     Ini hanyalah pratinjau mockup dari data dummy.
                   </p>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
