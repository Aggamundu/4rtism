export default function ImageDisplay(props: { images: string[], title: string}) {
  const { images, title} = props;
  return (
    <div className="flex text-sm flex-col w-full max-w-[60%] bg-white rounded-card px-custom py-[1%]">
      <label className="text-black text-sm mb-2 font-bold">{title}</label>
      <div className="flex flex-col gap-y-2">
      {images.map((image, index) => (
        <img key={index} src={image} alt="Commission" className="w-full h-full object-cover" />
      ))}
      </div>
    </div>
  )
}