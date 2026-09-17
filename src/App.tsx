import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { Library } from './components/Library';
import { DocumentViewer } from './components/DocumentViewer';
import { LoginModal } from './components/LoginModal';
import { AddDocumentModal } from './components/AddDocumentModal';
import { SettingsModal } from './components/SettingsModal';
import { mockDocuments } from './data';
import { DocumentCategory, Document } from './types';
import { supabase } from './lib/supabase';

export default function App() {
  const [activeCategory, setActiveCategory] = useState<DocumentCategory | 'Dashboard'>('Dashboard');
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('eperpus_admin') === 'true';
  });
  const [showLogin, setShowLogin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('Semua');
  const [viewDocument, setViewDocument] = useState<Document | null>(null);

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const { data, error } = await supabase
          .from('documents')
          .select('*')
          .order('dateAdded', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          setDocuments(data);
        } else {
          // Jika tabel kosong, kita bisa mencoba memasukkan mock data
          const { error: insertError } = await supabase
            .from('documents')
            .insert(mockDocuments.map(({ id, ...doc }) => doc)); // omit id supaya Supabase buatkan UUID/auto-increment

          if (!insertError) {
            const { data: newData } = await supabase.from('documents').select('*').order('dateAdded', { ascending: false });
            if (newData) setDocuments(newData);
          } else {
            // Fallback ke mock data jika RLS/Tabel mencegah insert
            setDocuments(mockDocuments);
          }
        }
      } catch (error: any) {
        console.error("Error mengambil data dari Supabase:", error);
        // Fallback jika tabel 'documents' belum ada
        if (error.message?.includes('relation "public.documents" does not exist')) {
          console.warn("Tabel 'documents' belum dibuat di Supabase. Menampilkan data lokal sementara.");
        }
        setDocuments(mockDocuments);
      } finally {
        setIsLoadingDocs(false);
      }
    };
    
    loadDocuments();
  }, []);

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    localStorage.setItem('eperpus_admin', 'true');
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('eperpus_admin');
  };

  const handleAddDocument = async (newDoc: Document) => {
    try {
      // Hilangkan ID sementara dari object sebelum insert agar Supabase membuat ID unik
      const { id, ...docData } = newDoc;
      const { data, error } = await supabase.from('documents').insert([docData]).select();
      
      if (error) {
        console.error("Error insert row:", error);
        alert("Gagal menyimpan ke database Supabase: " + error.message);
        return;
      }
      
      if (data && data.length > 0) {
        setDocuments([data[0] as Document, ...documents]);
      } else {
        // Fallback jika tidak ada data yang di-return (karena RLS misalnya)
        setDocuments([newDoc, ...documents]);
      }
      setShowAddModal(false);
    } catch (e) {
      console.error("Error adding document:", e);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      const { error } = await supabase.from('documents').delete().eq('id', id);
      if (error) throw error;
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error: any) {
      console.error("Error menghapus dokumen: ", error);
      alert("Gagal menghapus dokumen: " + error.message);
    }
  };

  // If search query is active, switch from Dashboard to "Semua" implicitly for better UX
  const isSearchActive = searchQuery.trim().length > 0;
  const currentView = isSearchActive && activeCategory === 'Dashboard' ? 'Semua' : activeCategory;

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans text-slate-900 relative">
      {/* Background Ornaments */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden bg-grid-pattern">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-400/10 blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px]"></div>
      </div>

      <Sidebar 
        activeCategory={activeCategory} 
        setActiveCategory={setActiveCategory}
        isAdmin={isAdmin}
        onLoginClick={() => setShowLogin(true)}
        onLogoutClick={handleLogout}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {currentView === 'Dashboard' ? (
              <DashboardOverview 
                documents={documents} 
                onDocumentClick={setViewDocument}
                onViewAllClick={() => setActiveCategory('Semua')}
                isAdmin={isAdmin}
                onDeleteDoc={handleDeleteDocument}
              />
            ) : (
              <Library 
                documents={documents}
                category={currentView as DocumentCategory}
                searchQuery={searchQuery}
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                onDocumentClick={setViewDocument}
                isAdmin={isAdmin}
                onDeleteDoc={handleDeleteDocument}
                onAddDocClick={() => setShowAddModal(true)}
              />
            )}
          </div>
        </main>
      </div>

      <DocumentViewer document={viewDocument} onClose={() => setViewDocument(null)} />
      
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />}
      {showAddModal && <AddDocumentModal onClose={() => setShowAddModal(false)} onAdd={handleAddDocument} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
