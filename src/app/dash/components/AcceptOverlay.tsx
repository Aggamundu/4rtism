import ImageDisplay from "./ImageDisplay";
import TextDisplay from "./TextDisplay";
interface AcceptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  commission?: any;
}

export default function AcceptOverlay({ isOpen, onClose, commission }: AcceptOverlayProps) {
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
          <TextDisplay title="Description" value={commission.description} />
          <ImageDisplay images={commission.images} links={commission.links} title="Reference Images/Links" />
          <TextDisplay title="Is this drawing for commercial use?" value="yes" />
          <ImageDisplay images={commission.images} title="What face would you like?" />
          <div className="flex flex-row gap-x-[30%] justify-center">
            <button className="bg-custom-pink text-white px-7 py-2 rounded-card">Reject</button>
            <button className="bg-custom-accent text-white px-7 py-2 rounded-card">Accept</button>
          </div>
        </div>
      </div>
    </div>
  );
}