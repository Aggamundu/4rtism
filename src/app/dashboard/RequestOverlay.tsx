import { useState } from "react";
import { supabaseClient } from "../../../utils/supabaseClient";
import RequestType from "./RequestType";

interface RequestOverlayProps {
  request: RequestType | null;
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export default function RequestOverlay({ request, isOpen, onClose, onRefresh }: RequestOverlayProps) {
  const [isExtended, setIsExtended] = useState(false);
  const [price, setPrice] = useState("");
  if (!isOpen || !request) return null;

  const validatePrice = (price: number) => {
    if (price <= 0) {
      return false;
    }
    if (price.toString().includes('e')) {
      return false;
    }
    // Check if there are more than 2 decimal places
    const decimalPlaces = price.toString().split('.')[1]?.length || 0;
    if (decimalPlaces > 2) {
      return false;
    }
    return true;
  };

  const deleteRequest = async () => {
    const { error } = await supabaseClient
      .from('requests')
      .delete()
      .eq('id', request.id);
    if (error) {
      console.error('Error deleting request:', error);
    } else {
      console.log('Request deleted successfully');
      onClose(); // Close the overlay after successful deletion
      onRefresh?.(); // Refresh the requests list
    }
  };

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
            <button
              onClick={() => setIsExtended(!isExtended)}
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
              Accept Request
            </button>
            <button onClick={deleteRequest} className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
              Decline Request
            </button>
            <button className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors">
              Contact Client
            </button>
          </div>

          {/* Extended Content */}
          {isExtended && (
            <div className="pt-6 border-t border-gray-200 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Set Price</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">$</span>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => {
                      const value = e.target.value;
                      setPrice(value);
                    }}
                    placeholder="0.00"
                    className={`flex-1 border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${price && !validatePrice(parseFloat(price))
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                      }`}
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
                <p className="text-blue-800 text-sm">
                  An invoice will be sent to <span className="font-medium">{request.email}</span>
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    // Handle sending invoice logic here
                    console.log('Sending invoice for $' + price);
                    setIsExtended(false);
                    setPrice("");
                  }}
                  disabled={!price || parseFloat(price) <= 0}
                  className="flex-1 bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Send Invoice
                </button>
                <button
                  onClick={() => {
                    setIsExtended(false);
                    setPrice("");
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 