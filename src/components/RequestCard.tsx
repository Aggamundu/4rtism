import { Request } from "../app/types/Types";

export default function RequestCard({ request }: { request: Request }) {
  return (
    <div className=" bg-custom-darkgray w-full border-b border-gray-700 pt-1 pb-1">
      <div className="bg-custom-darkgray rounded-lg px-custom py-[1%] transition-colors hover:bg-custom-gray/80 cursor-pointer">
        <h2 className="text-md text-custom-blue">{request.title}</h2>
        <p className="text-white text-sm line-clamp-3 mt-2">{request.description}</p>
    </div>
    </div>

  )
}