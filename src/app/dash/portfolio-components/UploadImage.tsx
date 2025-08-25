import { useState } from "react";

interface UploadImageProps {
  onImageUpload?: () => void;
}

export default function UploadImage({ onImageUpload }: UploadImageProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const handleFileUpload = (files: FileList | null) => {
    if (files && files[0]) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImage(e.target.result as string);
            onImageUpload?.();
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-col px-custom items-center">
        {!uploadedImage ? (
          <div
            className={`flex items-center justify-center w-full aspect-square border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${isDragOver
              ? 'border-custom-accent bg-blue-50'
              : 'border-[#484659] hover:border-custom-accent hover:bg-gray-50'
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
              <svg className="w-8 h-8 text-black mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-black text-sm mb-1">Drag file</p>
              <p
                className="text-custom-accent underline text-sm mb-1 cursor-pointer"
                onClick={() => document.getElementById('file-input')?.click()}
              >
                or browse
              </p>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>
          </div>
        ) : (
          <div className="relative w-full aspect-square">
            <img
              src={uploadedImage}
              alt="Uploaded image"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setUploadedImage(null)}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
            >
              ×
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        <div className="flex items-center justify-between w-[95%] bg-white rounded-lg px-4 py-2 mb-4">
          <span className="text-base text-custom-lightgray font-medium">My Portfolio</span>
          <svg className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </div>
      </div>
    </div>
  );
}