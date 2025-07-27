import Commission from "./Commission";
export default function Overlay({ data, close }: { data: { title: string, type: string, price: number, description: string, images: string[], thumbnail: string, delivery_days: number }[], close: () => void }) {
  return <div className="pl-4 pr-4 md:pl-[8rem] md:pr-[8rem] fixed inset-0 z-50 opacity-[0.95] bg-white flex flex-row flex-wrap items-start justify-start pt-10 overflow-y-auto">
    <button
      onClick={close}
      className="absolute top-4 right-4 md:right-[8rem] text-2xl hover:text-gray-600"
    >
      ✕
    </button>
    {data.map((commission, index) => (
      <Commission key={index} data={commission} />
    ))}
  </div>
}