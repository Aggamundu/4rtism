import { useEffect, useState } from "react";
import kai from "../../../../public/images/kai.png";

import AcceptOverlay from "./AcceptOverlay";
import ReviewOverlay from "./ReviewOverlay";
import WIPOverlay from "./WIPOverlay";
import ApprovalOverlay from "./ApprovalOverlay";
import { CommissionRequest } from "../../types/Types";
import CommissionRequestCard from "./CommissionCard";


export default function CommissionGrid({ activeTab, commissionsData }: { activeTab: string, commissionsData: CommissionRequest[] }) {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [selectedCommission, setSelectedCommission] = useState<any>(null);
  const [isAcceptOverlayOpen, setIsAcceptOverlayOpen] = useState(false);
  const [isReviewOverlayOpen, setIsReviewOverlayOpen] = useState(false);
  const [isWIPOverlayOpen, setIsWIPOverlayOpen] = useState(false);
  const [isApprovalOverlayOpen, setIsApprovalOverlayOpen] = useState(false);
  
  useEffect(() => {
    if (activeTab === "active") {
      setCommissions(commissionsData.filter((commission) => commission.status === "Request" || commission.status === "Pending" || commission.status === "WIP" || commission.status === "Approval"));
    } else if (activeTab === "completed") {
      setCommissions(commissionsData.filter((commission) => commission.status === "Completed"));
    } else if (activeTab === "all") {
      setCommissions(commissionsData);
    }
  }, [activeTab]);

  const handleCardClick = (commission: any) => {
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
        setIsApprovalOverlayOpen(true);
        break;
    }
  };

  const handleCloseOverlay = () => {
    setIsAcceptOverlayOpen(false);
    setIsReviewOverlayOpen(false);
    setIsWIPOverlayOpen(false);
    setIsApprovalOverlayOpen(false);
    setSelectedCommission(null);
  };

  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex flex-row justify-evenly bg-white text-sm text-black font-bold rounded-card items-center py-[1%] px-4">
        <div className="flex-1 text-center">Status</div>
        <div className="flex-1 text-center">Payment</div>
        <div className="flex-1 text-center">Submitted</div>
        <div className="flex-1 text-center">Confirmed</div>
        <div className="flex-1 text-center">Client/Title</div>
        <div className="w-8"></div>
      </div>
      {commissions.map((commission, index) => (
        <CommissionRequestCard key={index} commission={commission} onCardClick={handleCardClick} />
      ))}

      <AcceptOverlay
        isOpen={isAcceptOverlayOpen}
        onClose={handleCloseOverlay}
        commission={commissionsData[0]}
      />
      <ReviewOverlay
        isOpen={isReviewOverlayOpen}
        onClose={handleCloseOverlay}
        commission={commissionsData[0]}
      />
      <WIPOverlay
        isOpen={isWIPOverlayOpen}
        onClose={handleCloseOverlay}
        commission={commissionsData[0]}
      />
      <ApprovalOverlay
        isOpen={isApprovalOverlayOpen}
        onClose={handleCloseOverlay}
        commission={commissionsData[0]}
      />
    </div>
  )
}