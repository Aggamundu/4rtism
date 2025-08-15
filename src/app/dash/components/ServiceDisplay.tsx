import { ServiceDisplay as ServiceDisplayType } from "../../types/Types";

interface ServiceDisplayProps {
  service: ServiceDisplayType;
}

export default function ServiceDisplay({ service}: ServiceDisplayProps) {
  return (
    <div
      className="flex flex-row w-[100%] h-32 bg-white rounded-card text-base"
    >
      <img src={service.image_urls[0] || '/blank_pfp.webp'} alt={service.title} className="w-[30%] rounded-l-card object-cover" />
      <div className="grid grid-cols-2 sm:grid-cols-3 w-[80%] items-center px-[1%] sm:px-[5%]">
        <div className="text-center">{service.title}</div>
        <div className="hidden sm:block text-custom-lightgray text-center">Est. ${service.price}</div>
        <div className="flex flex-row  text-center items-center justify-end">
        </div>
      </div>
    </div>
  );
}