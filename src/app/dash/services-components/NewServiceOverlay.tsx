
import TextArea from "../components/TextArea";
import TextInput from "./TextInput";
import CreateForm from "./CreateForm";
import UploadServiceImages from "./UploadServiceImages";
interface Service {
  id: string;
  image: string;
  title: string;
  price: string;
  description?: string;
  category?: string;
  deliveryTime?: string;
  images?: string[];
}

interface ServiceOverlayProps {
  isOpen: boolean;
  onClose: () => void;

}

export default function NewServiceOverlay({ isOpen, onClose,}: ServiceOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-custom-offwhite rounded-card max-h-[95vh] overflow-y-auto w-full relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="flex flex-col p-6 justify-center items-center gap-y-4">
          <TextInput title="Title"/>
          <TextArea title="Description" />
          <TextInput title="Price (USD)" />
          <UploadServiceImages />
          <TextInput title="Delivery Time" />
          <CreateForm />
        </div>
        <div className="flex flex-row justify-center items-center gap-x-4 pb-[1%]">
          <button className="bg-custom-accent text-white hover:bg-custom-darkAccent rounded-card w-[50%] sm:w-[17%] py-[.5%] px-custom relative top-[10%]" onClick={onClose}>
            Submit
          </button>
        </div>


      </div>
    </div>
  );
} 