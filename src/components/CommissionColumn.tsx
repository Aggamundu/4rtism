import CommissionCard from "@/app/home/components/CommissionCard";
import CommissionRequestOverlay from "@/app/profile/[name]/components/CommissionRequestOverlay";
import { useState } from "react";
import { Commission } from "../app/types/Types";

interface CommissionCardGridProps {
  commissions: Commission[];
  className?: string;
  showProfileInfo?: boolean;
  size?: 'small' | 'medium' | 'large';
}
export default function CommissionColumn({ commissions, className = "", showProfileInfo = true, size = 'small' }: CommissionCardGridProps) {
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
    <div className={`flex flex-col gap-4 ${className}`}>
      {commissions.map((commission) => (
        <CommissionCard
          key={commission.id}
          commission={commission}
          onCardClick={() => handleCardClick(commission)}
          showProfileInfo={showProfileInfo}
          size={size}
        />
      ))}
      {isOverlayOpen && selectedCommission && (
        <CommissionRequestOverlay
          isOpen={isOverlayOpen}
          commission={selectedCommission}
          onClose={handleCloseOverlay}
        />
      )}
    </div>
  )
}