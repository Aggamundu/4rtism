import { useEffect, useRef, useState } from 'react';

interface UploadImagesProps {
  initialImages?: string[];
  onFilesChange?: (files: File[]) => void;
  onImagesChange?: (images: string[], deletedUrls?: string[]) => void;
}

export default function UploadImages({
  initialImages = [],
  onFilesChange,
  onImagesChange
}: UploadImagesProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [deletedImageUrls, setDeletedImageUrls] = useState<string[]>([]);

  // Use ref to store the latest callback
  const onImagesChangeRef = useRef(onImagesChange);
  onImagesChangeRef.current = onImagesChange;

  // Use ref to store the latest files callback
  const onFilesChangeRef = useRef(onFilesChange);
  onFilesChangeRef.current = onFilesChange;

  // Sanitize file name function
  const sanitizeFileName = (fileName: string): string => {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters with underscores
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/_{2,}/g, '_') // Replace multiple consecutive underscores with single
      .replace(/^_+|_+$/g, '') // Remove leading and trailing underscores
      .toLowerCase(); // Convert to lowercase
  };

  // Use ref to track previous initialImages
  const prevInitialImagesRef = useRef<string[]>([]);

    // Track if we've already initialized
const hasInitialized = useRef(false);

  // Update uploadedImages when initialImages changes, but only if we haven't initialized yet
  useEffect(() => {
    if (!hasInitialized.current && initialImages) {
      setUploadedImages(initialImages);
      prevInitialImagesRef.current = initialImages;
      hasInitialized.current = true;
    } else if (hasInitialized.current && initialImages) {
      // After initialization, only update if the content actually changed
      const prevImages = JSON.stringify(prevInitialImagesRef.current);
      const newImages = JSON.stringify(initialImages);
      if (prevImages !== newImages) {
        setUploadedImages(initialImages);
        prevInitialImagesRef.current = initialImages;
      }
    }
  }, [initialImages]);
  // Notify parent when selectedFiles changes
  useEffect(() => {
    if (onFilesChangeRef.current) {
      onFilesChangeRef.current(selectedFiles);
    }
  }, [selectedFiles]);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));

      // Update the selected files state with sanitized file names
      const sanitizedFiles = imageFiles.map(file => {
        const sanitizedName = sanitizeFileName(file.name);
        const fileExtension = file.name.split('.').pop();
        const newFileName = `${sanitizedName}.${fileExtension}`;

        // Create a new File object with the sanitized name
        return new File([file], newFileName, { type: file.type });
      });

      setSelectedFiles(prev => [...prev, ...sanitizedFiles]);

      // Create preview URLs for display
      sanitizedFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages(prev => [...prev, e.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = uploadedImages[index];
    const updatedImages = uploadedImages.filter((_, i) => i !== index);
    const updatedFiles = selectedFiles.filter((_, i) => i !== index);

    setUploadedImages(updatedImages);
    setSelectedFiles(updatedFiles);

    // Track deleted image URL if it's not a data URL (actual uploaded URL)
    if (imageToRemove && !imageToRemove.startsWith('data:')) {
      setDeletedImageUrls(prev => [...prev, imageToRemove]);
    }

    // Reset file input to allow re-uploading the same file
    setFileInputKey(prev => prev + 1);
  }



  return (
    <div className="flex flex-col w-full bg-custom-darkgray rounded-card py-[1%]">
      <label className="text-white text-sm">Reference Images</label>

      <div className="flex flex-col py-[1%] items-center">
        <div
          className={`flex items-center justify-center w-[100%] border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${isDragOver
            ? 'border-custom-accent bg-custom-gray'
            : 'border-custom-gray'
            }`}
          onDragOver={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);
            handleFileUpload(e.dataTransfer.files);
          }}
        >
          <div className="flex flex-col items-center">
            <svg className={`w-8 h-8 mb-2 `} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className={`text-sm mb-1 `}>Drag file</p>
            <p
              className={`text-sm mb-1 cursor-pointer text-custom-accent underline`}
              onClick={() => document.getElementById('file-input')?.click()}
            >
              or browse
            </p>
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
        </div>

        {/* Display uploaded images */}
        {uploadedImages.length > 0 && (
          <div className="mt-[1%]">
            <div className="grid grid-cols-3 gap-2 border-[1px] border-dashed border-custom-gray rounded-card p-custom">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}