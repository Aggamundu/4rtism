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
    <div className="flex flex-col w-full sm:max-w-[90%] bg-custom-darkpurple rounded-card py-[1%]">
      <label className="text-white text-sm">Reference Images<span className="text-red-500 ml-1">*</span></label>
      
      <div className="flex flex-col py-[1%] items-center">
        <div
          className={`flex items-center justify-center w-[100%] border-2 border-dashed rounded-lg p-4 transition-all duration-200 ${isDragOver
            ? 'border-custom-accent bg-blue-50'
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
            <svg className={`w-8 h-8 mb-2 ${isDragOver ? 'text-black' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className={`text-sm mb-1 ${isDragOver ? 'text-black' : 'text-white'}`}>Drag file</p>
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
            <h3 className="text-white text-sm">Uploaded Images:</h3>
            <div className="grid grid-cols-3 gap-2 border-[1px] border-dashed border-custom-gray rounded-card p-custom">
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
      {/* <div className="flex justify-center">
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
      </div> */}


    </div>

  );
}