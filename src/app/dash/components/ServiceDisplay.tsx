
interface ServiceDisplayProps {
  image_urls: string[];
  title: string;
  price: string;
}

export default function ServiceDisplay({ image_urls, title, price }: ServiceDisplayProps) {
  return (
    <div className="flex flex-col w-full sm:max-w-[60%] rounded-card ">
      <label className="text-black text-sm mb-2 font-bold ">Selected Service</label>
      <div
        className="flex flex-row  h-32 bg-white rounded-card text-base"
      >
        <img src={image_urls[0] || '/blank_pfp.webp'} alt={title} className="w-[30%] rounded-l-card object-cover" />
        <div className="grid sm:grid-cols-3 w-[80%] items-center px-[1%] sm:px-[5%]">
          <div className="text-center">{title}</div>
          <div className="sm:block text-custom-lightgray text-center">Est. ${price}</div>
          <div className="flex flex-row  text-center items-center justify-end">
          </div>
        </div>
      </div>
    </div>

  );
}