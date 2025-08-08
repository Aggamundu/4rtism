import CommissionCard from "./CommissionCard";
import { Commission } from "../../types/Types";

interface CommissionCardGridProps {
  commissions: Commission[];
  minHeight?: number; // in pixels
  maxHeight?: number; // in pixels
  className?: string;
  showProfileInfo?: boolean;
}

export default function CommissionCardGrid({
  commissions,
  minHeight = 400,
  maxHeight = 450,
  className = "",
  showProfileInfo = true
}: CommissionCardGridProps) {
  return (
    <div className={`w-full px-custom ${className}`}>
      <div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 auto-rows-fr"
        style={{
          minHeight: `${minHeight}px`,
        }}
      >
        {commissions.map((commission) => (
          <CommissionCard
            key={commission.id}
            id={commission.id}
            title={commission.title}
            price={commission.price}
            artist={commission.artist}
            profile_image_url={commission.pfp_url}
            image_urls={commission.image_urls}
            minHeight={minHeight / 2}
            rating={commission.rating}
            showProfileInfo={showProfileInfo}
          />
        ))}
      </div>
    </div>
  );
}