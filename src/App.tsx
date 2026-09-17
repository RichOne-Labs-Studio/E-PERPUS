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
import { documentsCollection, db } from './lib/firebase';
import { getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

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
        const querySnapshot = await getDocs(documentsCollection);
        let docs = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        })) as Document[];
        
        // Seed mock documents if database is empty
        if (docs.length === 0) {
          for (const mDoc of mockDocuments) {
            const { id, ...docData } = mDoc;
            const docRef = await addDoc(documentsCollection, docData);
            docs.push({ ...mDoc, id: docRef.id });
          }
        }
        
        // Sort by date added (newest first)
        docs.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
        
        setDocuments(docs);
      } catch (error) {
        console.error("Error fetching documents: ", error);
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
      const docRef = await addDoc(documentsCollection, {
        title: newDoc.title,
        category: newDoc.category,
        type: newDoc.type,
        year: newDoc.year,
        dateAdded: newDoc.dateAdded,
        size: newDoc.size,
        description: newDoc.description,
        coverColor: newDoc.coverColor,
        coverBase64: newDoc.coverBase64 || '',
        fileData: newDoc.fileData || ''
      });
      
      const savedDoc = { ...newDoc, id: docRef.id };
      setDocuments([savedDoc, ...documents]);
      setShowAddModal(false);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'documents', id));
      setDocuments(documents.filter(doc => doc.id !== id));
    } catch (error) {
      console.error("Error deleting document: ", error);
      // alert removed due to iframe restrictions
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
