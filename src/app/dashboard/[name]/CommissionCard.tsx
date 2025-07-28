"use client"
import { useState } from 'react';
import CommissionOverlay from "./CommissionOverlay";
import CommissionType from "./CommissionType";

export default function CommissionCard({ commission }: { commission: CommissionType }) {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const { id, title, description, status, dueDate, client } = commission;

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusElement = (status: string) => {
    switch (status) {
      case 'Awaiting Payment':
        return <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Awaiting Payment</span>
      case 'in_progress':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">In Progress</span>
      case 'Awaiting Approval':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Awaiting Approval</span>
      default:
        return <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">Unknown</span>
    }
  };

  const handleCardClick = () => {
    setIsOverlayOpen(true);
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
  };

  return (
    <>
      <div
        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
        onClick={handleCardClick}
      >
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{title}</h4>
            <p className="text-sm text-gray-600">Client: {client}</p>
            <p className="text-sm text-gray-500">Due in {getDaysUntilDue(dueDate)} days</p>
          </div>
          {getStatusElement(status)}
        </div>
      </div>

      {/* Overlay */}
      <CommissionOverlay
        commission={commission}
        isOpen={isOverlayOpen}
        onClose={closeOverlay}
      />
    </>
  )
}