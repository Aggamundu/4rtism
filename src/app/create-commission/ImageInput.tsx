import { useRef, useState } from "react";
import PencilIcon from "@/icons/PencilIcon";
import TrashIcon from "@/icons/Trash";
type ImageInputProps = {
  setImage: (file: File | null) => void;
  setImagePreview: (previews: any) => void;
  imagePreview: string | undefined;
}

export default function ImageInput(props: ImageInputProps) {
  const { setImage, setImagePreview, imagePreview } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`group w-[200px] h-[250px] border-2 rounded-lg text-center flex flex-col justify-center items-center relative ${isDragging ? "border-blue-400 bg-blue-50" : ""}`}
      onDragOver={e => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
      }}
      onDragEnter={e => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
      }}
      onDragLeave={e => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
      }}
      onDrop={e => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) {
          setImage(file);
          const preview = URL.createObjectURL(file);
          setImagePreview(preview);
        }
      }}
    >
      {!imagePreview && (
        <p className="text-gray-500 text-[14px] z-10">
          Drag and drop an image or{" "}
          <span
            className="underline cursor-pointer text-blue-500"
            onClick={e => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            browse
          </span>
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 pointer-events-none"
        onChange={e => {
          const file = e.target.files ? e.target.files[0] : null;
          if (file) {
            setImage(file);
            const preview = URL.createObjectURL(file);
            setImagePreview(preview);
          }
        }}
        tabIndex={-1}
      />
      
      {imagePreview && (<>
        <button
          type="button"
          className="hidden group-hover:flex absolute top-1 right-1 z-20 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100 transition"
          onClick={e => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          tabIndex={-1}
          aria-label="Change image"
        >
          <PencilIcon className="w-4 h-4 text-gray-700" />
        </button>
        <button
          type="button"
          className="hidden group-hover:flex absolute top-1 left-1 z-20 bg-white bg-opacity-80 rounded-full p-1 shadow hover:bg-opacity-100 transition"
          onClick={e => {
            e.stopPropagation();
            setImage(null);
            setImagePreview(undefined);
          }}
          tabIndex={-1}
          aria-label="Delete image"
        >
          <TrashIcon className="w-4 h-4 text-gray-700" />
        </button>
          <img
            src={imagePreview}
            className="absolute inset-0 w-full h-full object-cover rounded-lg border-2"
            style={{ zIndex: 1 }}
          />
        </>
      )}
      
    </div>
  );
}