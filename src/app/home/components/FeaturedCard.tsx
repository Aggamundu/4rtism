export default function FeaturedCard({image, artist}: {image: string, artist: string}) {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden w-[100%] sm:w-[40%] flex-shrink-0">
    <img src={image} alt="Artists keep 100%" className="h-full w-full object-cover object-center rounded-[30px]" />
    <div className="absolute bottom-1 right-4 text-white bg-custom-lightgray bg-opacity-40 rounded-full pl-2 pr-2">
      <a href={`/profile/${artist}`} className="text-sm hover:underline">
        @{artist}
      </a>
    </div>
  </div>
  )
}