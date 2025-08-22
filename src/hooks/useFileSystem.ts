import { useState, useCallback } from 'react';

export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content: string;
  path: string;
  modified: boolean;
  lastSaved: Date;
}

export function useFileSystem() {
  const [files, setFiles] = useState<FileItem[]>(() => {
    // Load files from localStorage on initialization
    const savedFiles = localStorage.getItem('codette-files');
    if (savedFiles) {
      try {
        return JSON.parse(savedFiles);
      } catch (error) {
        console.error('Failed to load saved files:', error);
      }
    }
    
    // Default files if none saved
    return [
      {
        id: 'welcome',
        name: 'welcome.md',
        type: 'file' as const,
        content: '# Welcome to Codette\n\nStart coding with AI assistance!',
        path: '/welcome.md',
        modified: false,
        lastSaved: new Date()
      }
    ];
  });

  const [activeFile, setActiveFile] = useState<FileItem | null>(() => {
    const savedActiveFileId = localStorage.getItem('codette-active-file');
    if (savedActiveFileId) {
      const savedFiles = localStorage.getItem('codette-files');
      if (savedFiles) {
        try {
          const parsedFiles = JSON.parse(savedFiles);
          return parsedFiles.find((f: FileItem) => f.id === savedActiveFileId) || null;
        } catch (error) {
          console.error('Failed to load active file:', error);
        }
      }
    }
    return null;
  });

  // Save files to localStorage whenever files change
  const saveFilesToStorage = useCallback((updatedFiles: FileItem[]) => {
    try {
      localStorage.setItem('codette-files', JSON.stringify(updatedFiles));
    } catch (error) {
      console.error('Failed to save files to localStorage:', error);
    }
  }, []);

  const openFile = useCallback((file: FileItem) => {
    setActiveFile(file);
    localStorage.setItem('codette-active-file', file.id);
  }, []);

  const closeFile = useCallback((fileId: string) => {
    if (activeFile?.id === fileId) {
      setActiveFile(null);
      localStorage.removeItem('codette-active-file');
    }
  }, [activeFile]);

  const createFile = useCallback((name: string, type: 'file' | 'folder' = 'file') => {
    const newFile: FileItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      type,
      content: type === 'file' ? '' : '',
      path: `/${name}`,
      modified: false,
      lastSaved: new Date()
    };

    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    saveFilesToStorage(updatedFiles);

    if (type === 'file') {
      openFile(newFile);
    }

    return newFile;
  }, [files, saveFilesToStorage, openFile]);

  const deleteFile = useCallback((fileId: string) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    saveFilesToStorage(updatedFiles);

    if (activeFile?.id === fileId) {
      setActiveFile(null);
      localStorage.removeItem('codette-active-file');
    }
  }, [files, activeFile, saveFilesToStorage]);

  const updateFileContent = useCallback((fileId: string, content: string) => {
    const updatedFiles = files.map(file => 
      file.id === fileId 
        ? { ...file, content, modified: true }
        : file
    );
    
    setFiles(updatedFiles);
    
    // Update active file if it's the one being modified
    if (activeFile?.id === fileId) {
      setActiveFile({ ...activeFile, content, modified: true });
    }
    
    // Auto-save to localStorage after a short delay
    setTimeout(() => {
      saveFilesToStorage(updatedFiles);
    }, 1000);
  }, [files, activeFile, saveFilesToStorage]);

  const saveFile = useCallback((fileId: string) => {
    const updatedFiles = files.map(file => 
      file.id === fileId 
        ? { ...file, modified: false, lastSaved: new Date() }
        : file
    );
    
    setFiles(updatedFiles);
    saveFilesToStorage(updatedFiles);
    
    // Update active file if it's the one being saved
    if (activeFile?.id === fileId) {
      setActiveFile({ ...activeFile, modified: false, lastSaved: new Date() });
    }
    
    console.log(`File ${fileId} saved successfully`);
  }, [files, activeFile, saveFilesToStorage]);

  return {
    files,
    activeFile,
    openFile,
    closeFile,
    createFile,
    deleteFile,
    updateFileContent,
    saveFile
  };
}