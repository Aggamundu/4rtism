import { Avatar } from '@mui/material';
import { useRouter } from "next/navigation";
import { Request } from "../app/types/Types";
export default function RequestCard({ request }: { request: Request }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/request-display/${request.id}`);
  }

  return (
    <div
      className=" bg-custom-darkgray w-full border-b border-gray-700 pt-1 pb-1"
      onClick={handleClick}
    >
      <div className="bg-custom-darkgray rounded-lg px-custom py-[1%] transition-colors hover:bg-custom-gray/15 cursor-pointer flex flex-col gap-2">
        <div className="flex flex-row items-center gap-2 mt-2">
          <Avatar
            src={request.profiles?.pfp_url}
            sx={{
              width: 32,
              height: 32,
            }}
            className="transition-all duration-200 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/${request.profiles?.user_name}`);
            }}
          />
          <p
            className="text-white text-sm hover:text-custom-blue transition-colors cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/${request.profiles?.user_name}`);
            }}
          >
            {request.profiles?.user_name}
          </p>
        </div>
        <h2 className="text-md text-white">{request.title}</h2>
        <p className="text-custom-lightgray text-sm line-clamp-3 mt-2">{request.description}</p>
        {request.image_urls.length > 0 && <img src={request.image_urls[0]} alt={request.title} className="w-full h-48 object-cover rounded-lg mt-2" />}
      </div>
    </div>

  )
}