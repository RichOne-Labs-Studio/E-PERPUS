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
    // Simulasi memuat data
    setTimeout(() => {
      setDocuments(mockDocuments);
      setIsLoadingDocs(false);
    }, 500);
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

  const handleAddDocument = (newDoc: Document) => {
    setDocuments([newDoc, ...documents]);
    setShowAddModal(false);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
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
