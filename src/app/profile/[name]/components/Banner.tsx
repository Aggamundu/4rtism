import kai2 from '../../../../../public/images/kai2.png';

interface BannerProps {
  imageSrc: string | null;
  isLoading?: boolean;
}

export default function Banner({ imageSrc, isLoading = false }: BannerProps) {
  // Show loading skeleton if loading
  if (isLoading) {
    return (
      <div className="w-full sm:h-[14rem] h-[8rem] relative overflow-hidden">
        <div className="w-full h-full bg-custom-darkgray animate-pulse"></div>
      </div>
    );
  }

  if (imageSrc === null) {
    return (
      <div className="w-full sm:h-[14rem] h-[8rem] relative overflow-hidden">
        <img src={kai2.src} alt="Profile banner" className="w-full h-full object-cover" />
      </div>
    );
  }

  return (
    <div className="w-full sm:h-[14rem] h-[8rem] relative overflow-hidden">
      <img
        src={imageSrc}
        alt="Profile banner"
        className="w-full h-full object-cover"
        onError={() => {
          console.error('Failed to load banner image:', imageSrc);
        }}
      />
    </div>
  );
} 