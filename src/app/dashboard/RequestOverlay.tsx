import RequestType from "./RequestType";

interface RequestOverlayProps {
  request: RequestType | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestOverlay({ request, isOpen, onClose }: RequestOverlayProps) {
  if (!isOpen || !request) return null;

  const getTimeAgo = (created_at: string) => {
    const now = new Date();
    const created = new Date(created_at);
    const diffInSeconds = Math.floor((now.getTime() - created.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    }

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`;
    }

    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Commission Request</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{request.title}</h3>
            <p className="text-gray-600">Requested by {request.name}</p>
            <p className="text-sm text-gray-500">{getTimeAgo(request.created_at)}</p>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{request.description}</p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
            <p className="text-gray-700">{request.email}</p>
          </div>

          {/* Reference Images */}
          {request.reference_images && request.reference_images.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Reference Images</h4>
              <div className="grid grid-cols-2 gap-4">
                {request.reference_images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Reference ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors">
              Accept Request
            </button>
            <button className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
              Decline Request
            </button>
            <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
              Contact Client
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 