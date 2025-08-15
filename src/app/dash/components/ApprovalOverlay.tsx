import { CommissionRequest } from "../../types/Types";
import ImageDisplay from "./ImageDisplay";
import TextDisplay from "./TextDisplay";
interface AcceptOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  commission?: CommissionRequest;
}

export default function ApprovalOverlay({ isOpen, onClose, commission }: AcceptOverlayProps) {
  if (!isOpen || !commission) return null;

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
          <div></div>
          {/* <ImageDisplay images={commission.reference_image_urls || []} title="Submitted Work" />
          <TextDisplay title="Description" value={commission.description} />
          <TextDisplay title="Is this drawing for commercial use?" value="yes" />
          <ImageDisplay images={commission.submission_urls || []} title="What face would you like?" /> */}
        </div>
      </div>
    </div>
  );
}