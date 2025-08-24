import { useState } from "react";
import { Commission } from "../../types/Types";
import CommissionCard from "./CommissionCard";
import CommissionRequestOverlay from "@/app/profile/[name]/components/CommissionRequestOverlay";

interface CommissionCardGridProps {
  commissions: Commission[];
  className?: string;
  showProfileInfo?: boolean;
}

export default function CommissionCardGrid({
  commissions,
  className = "",
  showProfileInfo = true,
  
}: CommissionCardGridProps) {
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const handleCardClick = (commission: Commission) => {
    setSelectedCommission(commission);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setSelectedCommission(null);
  };

  return (
    <div className={`w-full px-custom ${className}`}>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6"
      >
        {commissions.map((commission) => (
          <CommissionCard
            key={commission.id}
            commission={commission}
            showProfileInfo={showProfileInfo}
            onCardClick={handleCardClick}
          />
        ))}
      </div>
      {isOverlayOpen && (
        <CommissionRequestOverlay
          isOpen={isOverlayOpen}
          onClose={handleCloseOverlay}
          commission={selectedCommission}
        />
      )}
      </div>
  );
}