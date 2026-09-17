export type DocumentCategory = 
  | 'Semua'
  | 'Renstra' 
  | 'Renja' 
  | 'LAKIP/SAKIP' 
  | 'Evaluasi Renja' 
  | 'Laporan Interim'
  | 'Lainnya';

export type DocumentType = 'PDF' | 'DOCX' | 'XLSX';

export interface Document {
  id: string;
  title: string;
  category: DocumentCategory;
  type: DocumentType;
  year: number;
  dateAdded: string;
  size: string;
  description: string;
  coverColor: string;
  coverBase64?: string;
  fileData?: string;
}
