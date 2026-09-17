import React, { useState } from 'react';
import { X, Lock, User } from 'lucide-react';

export function LoginModal({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi otentikasi
    if (username === 'admin' && password === 'admin123') {
      onSuccess();
    } else {
      setError('Username atau password salah.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={onClose} />
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl relative z-10 p-8 animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 p-2 rounded-xl transition-colors">
          <X className="w-5 h-5" />
        </button>
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800">Login Admin</h2>
          <p className="text-slate-500 mt-2 text-sm">Masuk untuk mengelola dokumen (demo: admin / admin123)</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100 text-center font-medium">{error}</div>}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="Masukkan username" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all" placeholder="Masukkan password" required />
            </div>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-teal-700 transition-all mt-4">
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
