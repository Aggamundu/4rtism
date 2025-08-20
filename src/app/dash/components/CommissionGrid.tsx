import { useEffect, useState } from "react";

import { CommissionRequest } from "../../types/Types";
import AcceptOverlay from "./AcceptOverlay";
import ApprovalOverlay from "./ApprovalOverlay";
import CommissionCard from "./CommissionCard";
import ReviewOverlay from "./ReviewOverlay";
import WIPOverlay from "./WIPOverlay";


export default function CommissionGrid({ activeTab, commissionsData, onRefresh }: { activeTab: string, commissionsData: CommissionRequest[], onRefresh?: () => void }) {
  const [commissions, setCommissions] = useState<CommissionRequest[]>([]);
  const [selectedCommission, setSelectedCommission] = useState<CommissionRequest | undefined>(undefined);
  const [isAcceptOverlayOpen, setIsAcceptOverlayOpen] = useState(false);
  const [isReviewOverlayOpen, setIsReviewOverlayOpen] = useState(false);
  const [isWIPOverlayOpen, setIsWIPOverlayOpen] = useState(false);
  const [isApprovalOverlayOpen, setIsApprovalOverlayOpen] = useState(false);
  const [isCompletedOverlayOpen, setIsCompletedOverlayOpen] = useState(false);
  useEffect(() => {
    if (activeTab === "active") {
      setCommissions(commissionsData.filter((commission) => commission.status === "Request" || commission.status === "Pending" || commission.status === "WIP" || commission.status === "Approval"));
    } else if (activeTab === "completed") {
      setCommissions(commissionsData.filter((commission) => commission.status === "Completed"));
    } else if (activeTab === "all") {
      setCommissions(commissionsData);
    }
  }, [activeTab, commissionsData]);

  const handleCardClick = (commission: CommissionRequest) => {
    setSelectedCommission(commission);
    switch (commission.status) {
      case "Request":
        setIsAcceptOverlayOpen(true);
        break;
      case "Pending":
        setIsReviewOverlayOpen(true);
        break;
      case "WIP":
        setIsWIPOverlayOpen(true);
        break;
      case "Approval":
        setIsApprovalOverlayOpen(true);
        break;
      case "Completed":
        setIsCompletedOverlayOpen(true);
        break;
      default:
        console.log("default", commission.status);
        break;
    }
  };

  const handleCloseOverlay = () => {
    setIsAcceptOverlayOpen(false);
    setIsReviewOverlayOpen(false);
    setIsWIPOverlayOpen(false);
    setIsApprovalOverlayOpen(false);
    setIsCompletedOverlayOpen(false);
    setSelectedCommission(undefined);
  };

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex flex-row justify-evenly bg-white text-sm text-black font-bold rounded-card items-center py-[1%] px-4">
        <div className="flex-1 text-center">Status</div>
        <div className="flex-1 text-center">Payment</div>
        <div className="flex-1 text-center">Submitted</div>
        <div className="flex-1 text-center">Confirmed</div>
        <div className="flex-1 text-center">Client</div>
      </div>
      {commissions.map((commission, index) => (
        <CommissionCard key={index} commission={commission} onCardClick={handleCardClick} />
      ))}

      {isAcceptOverlayOpen && selectedCommission && (
        <AcceptOverlay
          isOpen={isAcceptOverlayOpen}
          onClose={handleCloseOverlay}
          commission={selectedCommission}
          onRefresh={onRefresh}
        />
      )}
      {isReviewOverlayOpen && (
        <ReviewOverlay
          isOpen={isReviewOverlayOpen}
          onClose={handleCloseOverlay}
          commission={selectedCommission}
        />
      )}
      {isWIPOverlayOpen && (
        <WIPOverlay
        isOpen={isWIPOverlayOpen}
        onClose={handleCloseOverlay}
        commission={selectedCommission}
        onRefresh={onRefresh}
      />
      )}
      {isApprovalOverlayOpen && (
        <ApprovalOverlay
          isOpen={isApprovalOverlayOpen}
          onClose={handleCloseOverlay}
          commission={selectedCommission}
          title="Pending Approval"
        />
      )}
      {isCompletedOverlayOpen && (
        <ApprovalOverlay
          isOpen={isCompletedOverlayOpen}
          onClose={handleCloseOverlay}
          commission={selectedCommission}
          title="Completed Commission"
        />
      )}
    </div>
  )
}