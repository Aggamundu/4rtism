interface BannerProps {
  imageSrc: string;
}

export default function Banner({ imageSrc }: BannerProps) {
  return (
    <div className="w-full sm:h-[7rem] h-[5rem] relative overflow-hidden rounded-b-card">
      <img
        src={imageSrc}
        alt="Profile banner"
        className="w-full h-full object-cover"
      />
    </div>
  );
} 