import CommissionCard from "./CommissionCard";

interface CommissionCard {
  id: string;
  title: string;
  description: string;
  price: number;
  artist: string;
  image: string;
  image_urls?: string[];
  profile_image_url: string;
  rating: number;
}

interface CommissionCardGridProps {
  commissions: CommissionCard[];
  minHeight?: number; // in pixels
  maxHeight?: number; // in pixels
  className?: string;
}

export default function CommissionCardGrid({
  commissions,
  minHeight = 300,
  maxHeight = 500,
  className = ""
}: CommissionCardGridProps) {
  return (
    <div className={`w-full px-8 ${className}`}>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-6 auto-rows-fr"
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
            profile_image_url={commission.profile_image_url}
            image={commission.image}
            image_urls={commission.image_urls}
            minHeight={minHeight / 2}
            rating={commission.rating}
          />
        ))}
      </div>
    </div>
  );
}