import { useRef } from "react";

type ImageInputProps = {
  setImage: (file: File | null) => void;
  setImagePreview: (previews: any) => void;
  imagePreview: string | undefined;
}

export default function ImageInput(props: ImageInputProps) {
  const {setImage, setImagePreview, imagePreview } = props;
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className="w-[150px] h-[100px] border-2 rounded-lg text-center flex flex-col justify-center items-center relative"
    >
      <p className="text-gray-500 text-sm">
        Drag and drop an image or{" "}
        <span
          className="underline cursor-pointer"
          onClick={e => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          browse
        </span>
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="absolute inset-0 opacity-0 pointer-events-none"
        onChange={e => {
          const file = e.target.files ? e.target.files[0] : null;
          setImage(file);
          const preview = file ? URL.createObjectURL(file) : '';
          setImagePreview(preview);
        }}
        tabIndex={-1}
      />
      <div className="flex gap-2 mt-2">
      {
        imagePreview !== undefined && (
          <img
            src={imagePreview}
            className="w-12 h-12 object-cover rounded border"
          />
        )
      }
    </div>
    </div>
  );
}