export interface FileType {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content: string;
  modified: boolean;
  created: Date;
  lastModified: Date;
  size: number;
  children?: FileType[];
  parentId?: string;
}

export interface FileSystemState {
  files: FileType[];
  activeFileId: string | null;
  openFiles: string[];
}