import { Commission } from "../../types/Types";
import CommissionCard from "./CommissionCard";

interface CommissionCardGridProps {
  commissions: Commission[];
  className?: string;
  showProfileInfo?: boolean;
  onCardClick: (commission: Commission) => void;
}

export default function CommissionCardGrid({
  commissions,
  className = "",
  showProfileInfo = true,
  onCardClick
}: CommissionCardGridProps) {
  return (
    <div className={`w-full px-custom ${className}`}>
      <div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6"
      >
        {commissions.map((commission) => (
          <CommissionCard
            key={commission.id}
            commission={commission}
            showProfileInfo={showProfileInfo}
            onCardClick={onCardClick}
          />
        ))}
      </div>
    </div>
  );
}