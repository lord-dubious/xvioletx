import { useState, useRef } from 'react';
import { Progress } from '../components/ui/progress';
import { cn } from '../lib/utils';
import { Video, X, Upload, AlertCircle } from 'lucide-react';
import { uploadFileWithProgress, validateFile, type FileWithValidType } from '../file-upload/fileUploading';
import { type MediaFile } from './hooks/useMediaUpload';

interface MediaUploadProps {
  className?: string;
  onMediaChange?: (mediaFiles: MediaFile[]) => void;
  maxFiles?: number;
  disabled?: boolean;
}

export default function MediaUpload({ 
  className, 
  onMediaChange, 
  maxFiles = 4,
  disabled = false 
}: MediaUploadProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImage = (file: File) => file.type.startsWith('image/');
  const isVideo = (file: File) => file.type.startsWith('video/');

  const createMediaFile = (file: File): MediaFile => ({
    id: `${Date.now()}-${Math.random()}`,
    file,
    preview: URL.createObjectURL(file),
    uploadProgress: 0,
    uploaded: false,
  });

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || disabled) return;

    const newFiles = Array.from(files).slice(0, maxFiles - mediaFiles.length);
    const validFiles: MediaFile[] = [];

    for (const file of newFiles) {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        // Show error for invalid files
        const errorFile = createMediaFile(file);
        errorFile.error = validationError.message;
        validFiles.push(errorFile);
        continue;
      }

      // Only allow images and videos for tweets
      if (!isImage(file) && !isVideo(file)) {
        const errorFile = createMediaFile(file);
        errorFile.error = 'Only images and videos are allowed for tweets';
        validFiles.push(errorFile);
        continue;
      }

      validFiles.push(createMediaFile(file));
    }

    const updatedFiles = [...mediaFiles, ...validFiles];
    setMediaFiles(updatedFiles);
    onMediaChange?.(updatedFiles);

    // Start uploading valid files
    validFiles.forEach(mediaFile => {
      if (!mediaFile.error) {
        uploadMedia(mediaFile);
      }
    });
  };

  const uploadMedia = async (mediaFile: MediaFile) => {
    try {
      await uploadFileWithProgress({
        file: mediaFile.file as FileWithValidType,
        setUploadProgressPercent: (progress: number) => {
          setMediaFiles(prev => prev.map(f =>
            f.id === mediaFile.id
              ? { ...f, uploadProgress: progress, uploaded: progress === 100 }
              : f
          ));
        }
      });

      // Mark as uploaded
      setMediaFiles(prev => {
        const updated = prev.map(f => 
          f.id === mediaFile.id 
            ? { ...f, uploaded: true, uploadProgress: 100 }
            : f
        );
        onMediaChange?.(updated);
        return updated;
      });

    } catch (error: unknown) {
      // Mark as error
      const errorMessage = error instanceof Error ? error.message : 'Upload failed. Please try again.';
      setMediaFiles(prev => {
        const updated = prev.map(f =>
          f.id === mediaFile.id
            ? { ...f, error: errorMessage }
            : f
        );
        onMediaChange?.(updated);
        return updated;
      });
    }
  };

  const removeMedia = (id: string) => {
    setMediaFiles(prev => {
      const updated = prev.filter(f => f.id !== id);
      onMediaChange?.(updated);
      return updated;
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const canAddMore = mediaFiles.length < maxFiles && !disabled;

  return (
    <div className={cn('space-y-3', className)}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          className={cn(
            'border-2 border-dashed border-border rounded-lg p-4',
            'transition-colors duration-200 cursor-pointer',
            'hover:border-primary hover:bg-primary/5',
            isDragOver && 'border-primary bg-primary/10',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <Upload className="w-6 h-6 text-muted-foreground" />
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Click to upload</span> or drag and drop
            </div>
            <div className="text-xs text-muted-foreground">
              Images and videos up to 5MB ({maxFiles - mediaFiles.length} remaining)
            </div>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* Media Previews */}
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {mediaFiles.map((mediaFile) => (
            <div
              key={mediaFile.id}
              className="relative group bg-muted rounded-lg overflow-hidden aspect-square"
            >
              {/* Media Preview */}
              {isImage(mediaFile.file) ? (
                <img
                  src={mediaFile.preview}
                  alt="Upload preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                  <Video className="w-8 h-8 text-muted-foreground" />
                  <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-1 rounded">
                    Video
                  </div>
                </div>
              )}

              {/* Remove Button */}
              <button
                type="button"
                className="absolute top-1 right-1 w-6 h-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center"
                onClick={() => removeMedia(mediaFile.id)}
              >
                <X className="w-3 h-3" />
              </button>

              {/* Upload Progress */}
              {!mediaFile.uploaded && !mediaFile.error && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                  <Progress value={mediaFile.uploadProgress} className="h-1" />
                  <div className="text-xs text-white mt-1">
                    {mediaFile.uploadProgress}%
                  </div>
                </div>
              )}

              {/* Error State */}
              {mediaFile.error && (
                <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <div className="text-center p-2">
                    <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
                    <div className="text-xs text-red-500 font-medium">
                      {mediaFile.error}
                    </div>
                  </div>
                </div>
              )}

              {/* Success State */}
              {mediaFile.uploaded && !mediaFile.error && (
                <div className="absolute top-1 left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
