import { useState, useCallback } from 'react';

export interface MediaFile {
  id: string;
  file: File;
  preview: string;
  uploadProgress: number;
  uploaded: boolean;
  error?: string;
  key?: string; // S3 key after upload
}

export function useMediaUpload() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);

  const addMediaFiles = useCallback((files: MediaFile[]) => {
    setMediaFiles(prev => [...prev, ...files]);
  }, []);

  const updateMediaFile = useCallback((id: string, updates: Partial<MediaFile>) => {
    setMediaFiles(prev => prev.map(file => 
      file.id === id ? { ...file, ...updates } : file
    ));
  }, []);

  const removeMediaFile = useCallback((id: string) => {
    setMediaFiles(prev => prev.filter(file => file.id !== id));
  }, []);

  const clearMediaFiles = useCallback(() => {
    setMediaFiles([]);
  }, []);

  const getUploadedFiles = useCallback(() => {
    return mediaFiles.filter(file => file.uploaded && !file.error);
  }, [mediaFiles]);

  const hasUploadingFiles = useCallback(() => {
    return mediaFiles.some(file => !file.uploaded && !file.error);
  }, [mediaFiles]);

  const hasErrors = useCallback(() => {
    return mediaFiles.some(file => file.error);
  }, [mediaFiles]);

  return {
    mediaFiles,
    setMediaFiles,
    addMediaFiles,
    updateMediaFile,
    removeMediaFile,
    clearMediaFiles,
    getUploadedFiles,
    hasUploadingFiles,
    hasErrors,
  };
}
