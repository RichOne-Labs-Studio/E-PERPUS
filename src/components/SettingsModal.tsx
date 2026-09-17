import React from 'react';
import { X, Settings, Shield, HardDrive, Bell } from 'lucide-react';

export function SettingsModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl relative z-10 p-8 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="mb-8 flex items-center gap-4 border-b border-slate-100 pb-4">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center shadow-inner">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800">Pengaturan Sistem</h2>
            <p className="text-slate-500 text-sm font-medium">Konfigurasi preferensi E-Perpus (Mode Admin)</p>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
            <Shield className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-sm mb-1">Keamanan & Akses</h3>
              <p className="text-sm text-slate-500 font-medium mb-3">Kelola kata sandi dan hak akses pengguna sistem.</p>
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                Ubah Kata Sandi
              </button>
            </div>
          </div>
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
            <HardDrive className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-slate-800 text-sm mb-1">Penyimpanan & Pencadangan</h3>
              <p className="text-sm text-slate-500 font-medium mb-3">Sistem menyimpan 45.2 MB dari total kapasitas 5 GB.</p>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
              <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
                Cadangkan Database (Backup)
              </button>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex items-start gap-4">
            <Bell className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-800 text-sm">Notifikasi Pembaruan</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
              <p className="text-sm text-slate-500 font-medium">Terima pemberitahuan jika ada perubahan dokumen secara publik.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
