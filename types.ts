export interface FileData {
    date: string | number | Date;
    id: number;
    type: string;
    name: string;
    added: string;
    slug?: string;
    files?: FileItem[];
  }
  
interface FileItem {
    date: string | number | Date;
    id: number;
    type: string;
    name: string;
    added: string;
    slug?: string;
  }
  