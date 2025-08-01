"use client"
import { useState } from 'react';
import RequestOverlay from "./RequestOverlay";
import RequestType from "./RequestType";

export default function RequestCards({ requests, onRefresh, onOpenMessage, name }: { requests: RequestType[], onRefresh?: () => void, onOpenMessage?: (userId: string) => void, name: string }) {
  const [selectedRequest, setSelectedRequest] = useState<RequestType | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleRequestClick = (request: RequestType) => {
    setSelectedRequest(request);
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedRequest(null);
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

  const displayRequests = requests.map((request) => {
    const { id, created_at, title, name, description, reference_images, email } = request;
    return (
      <div
        key={id}
        onClick={() => handleRequestClick(request)}
        className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-blue-100 transition-colors cursor-pointer"
      >
        <div>
          <p className="font-medium">{title} for {name}</p>
          {/* <p className="text-sm text-gray-500">{description}</p> */}
        </div>
        <span className="text-sm text-gray-400">{getTimeAgo(created_at)}</span>
      </div>
    )
  });

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">New Commission Requests</h3>
      <div className="bg-white p-6 rounded-lg shadow">
        <div>
          <div className="space-y-3">
            {displayRequests}
          </div>

          {/* Overlay */}
          <RequestOverlay
            request={selectedRequest}
            isOpen={isOverlayOpen}
            onClose={closeOverlay}
            onRefresh={onRefresh}
            onOpenMessage={onOpenMessage}
            name={name}
          />
        </div>
      </div>
    </div>

  )
}