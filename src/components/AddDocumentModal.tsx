import React, { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';
import { Document, DocumentCategory } from '../types';
import { supabase } from '../lib/supabase';

export function AddDocumentModal({ onClose, onAdd }: { onClose: () => void, onAdd: (doc: Document) => void }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Renstra');
  const [year, setYear] = useState('2024');
  const [desc, setDesc] = useState('');
  const [fileType, setFileType] = useState<'PDF' | 'DOCX' | 'XLSX'>('PDF');
  
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [rawCover, setRawCover] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: File | null) => void) => {
    const file = e.target.files?.[0];
    if (!file) {
      setter(null);
      return;
    }
    setErrorMsg('');
    setter(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    
    try {
      const colors = ['bg-emerald-600', 'bg-teal-600', 'bg-blue-600', 'bg-indigo-600', 'bg-orange-600', 'bg-purple-600'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      let fileUrl = '';
      let coverUrl = '';
      const uniqueId = Date.now().toString();

      // Upload Document File ke Supabase Storage (Bucket 'files')
      if (rawFile) {
        const filePath = `documents/${uniqueId}_${rawFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('files').upload(filePath, rawFile);
        if (uploadError) throw uploadError;
        
        const { data: publicUrlData } = supabase.storage.from('files').getPublicUrl(filePath);
        fileUrl = publicUrlData.publicUrl;
      }

      // Upload Cover File ke Supabase Storage (Bucket 'files')
      if (rawCover) {
        const coverPath = `covers/${uniqueId}_${rawCover.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
        const { error: uploadError } = await supabase.storage.from('files').upload(coverPath, rawCover);
        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage.from('files').getPublicUrl(coverPath);
        coverUrl = publicUrlData.publicUrl;
      }

      const newDoc: Document = {
        id: 'doc-' + uniqueId, // Akan diganti oleh Supabase jika menggunakan auto-increment, tapi tidak apa-apa diset sementara
        title,
        category,
        type: fileType,
        year: parseInt(year),
        dateAdded: new Date().toISOString().split('T')[0],
        size: rawFile ? (rawFile.size / (1024 * 1024)).toFixed(2) + ' MB' : '0 MB',
        description: desc,
        coverColor: randomColor,
        coverBase64: coverUrl,
        fileData: fileUrl
      };
      
      onAdd(newDoc);
    } catch (err: any) {
      console.error("Upload error:", err);
      // Deteksi jika bucket belum ada
      if (err.message?.includes('bucket not found') || err.message?.includes('The resource was not found')) {
        setErrorMsg("Storage Bucket 'files' belum dibuat di Supabase Anda. Silakan buat bucket public bernama 'files'.");
      } else if (err.message?.includes('new row violates row-level security')) {
        setErrorMsg("Gagal mengunggah karena aturan keamanan (RLS) Supabase Storage menolak aksi ini.");
      } else {
        setErrorMsg("Gagal mengunggah dokumen: " + (err.message || 'Unknown error'));
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="mb-6 flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center shadow-inner">
            <UploadCloud className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Tambah Dokumen Baru</h2>
            <p className="text-slate-500 text-sm font-medium">Unggah laporan ke pustaka digital</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="bg-rose-50 text-rose-600 text-sm p-3 rounded-xl border border-rose-100 font-medium">
              {errorMsg}
            </div>
          )}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Judul Dokumen</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium" required placeholder="Contoh: Laporan Kinerja Q1" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Kategori</label>
              <select value={category} onChange={e => setCategory(e.target.value as DocumentCategory)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium">
                <option value="Renstra">Renstra</option>
                <option value="Renja">Renja</option>
                <option value="LAKIP/SAKIP">LAKIP/SAKIP</option>
                <option value="Evaluasi Renja">Evaluasi Renja</option>
                <option value="Laporan Interim">Laporan Interim</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Tahun Anggaran</label>
              <input type="number" value={year} onChange={e => setYear(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium" required min="2000" max="2099" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Format File</label>
              <select value={fileType} onChange={e => setFileType(e.target.value as any)} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-medium">
                <option value="PDF">PDF</option>
                <option value="DOCX">DOCX</option>
                <option value="XLSX">XLSX</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Pilih File</label>
              <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx" onChange={(e) => handleFileChange(e, setRawFile)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Sampul Dokumen Asli (Opsional)</label>
            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setRawCover)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 transition-all cursor-pointer" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Singkat</label>
            <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none font-medium" placeholder="Jelaskan isi singkat dari laporan ini..."></textarea>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-6 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all">Batal</button>
            <button type="submit" disabled={isLoading} className="px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-70">
              {isLoading ? 'Menyimpan...' : 'Simpan Dokumen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
