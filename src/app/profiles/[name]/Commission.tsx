import BusIcon from "@/icons/Bus";
export default function Commission({ data }: { data: { title: string, type: string, price: number, description: string, images: string[], thumbnail: string, delivery_days: number } }) {
  const { title, type, price, description, images, thumbnail, delivery_days } = data;
  return <div className="flex flex-col md:flex-row w-[100%] justify-start items-start mb-4">
    <img src={thumbnail} alt={title} width={225} height={225} className="object-cover border-2 border-gray-300 rounded-md" />
    <div className="flex flex-col text-base mt-4 md:mt-0 md:ml-4 w-[100%]">
      <div className="flex flex-row items-center">${price} <BusIcon className="w-4 h-4 mr-1 ml-4" /> {delivery_days} day delivery</div>
      <div className="flex flex-col h-[200px] overflow-y-auto">
        <p className="text-lg">{title}</p>
        <pre className="text-base whitespace-pre-wrap">{description}</pre>
      </div>
      <button className="w-[100px] mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
        Order Now
      </button>
    </div>
  </div>
}