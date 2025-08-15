import kai2 from '../../../../../public/images/kai2.png';
interface BannerProps {
  imageSrc: string | null;
}

export default function Banner({ imageSrc }: BannerProps) {
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
      />
    </div>
  );
} 