import { useState } from 'react';

export default function UploadImages() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const imageFiles = Array.from(files).filter(file => file.type.startsWith('image/'));
      imageFiles.forEach(file => {
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

  return (
    <div className="flex flex-col w-full sm:max-w-[60%] bg-white rounded-card px-custom py-[1%]">
      <label className="text-black text-sm mb-2 font-bold">Upload Images</label>
      <div className="flex flex-col px-custom py-[1%] items-center">
        <div
          className={`flex items-center justify-center w-[30%] border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${isDragOver
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
              multiple
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
          </div>
        </div>

        {/* Display uploaded images */}
        {uploadedImages.length > 0 && (
          <div className="mt-4">
            <h3 className="text-black text-sm font-bold mb-2">Uploaded Images:</h3>
            <div className="grid grid-cols-3 gap-2">
              {uploadedImages.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={image}
                    alt={`Uploaded ${index + 1}`}
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button
                    onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== index))}
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
      <div className="flex justify-center">
        <button 
          disabled={uploadedImages.length === 0}
          className={`px-7 py-2 rounded-card w-[20%] ${
            uploadedImages.length === 0 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-custom-accent hover:bg-custom-accent/90'
          } text-white`}
        >
          Submit
        </button>
      </div>


    </div>

  );
}