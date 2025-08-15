interface Service {
  id: string;
  title: string;
  price: string;
  description?: string;
  category?: string;
  deliveryTime?: string;
  image_urls: string[];
}

interface ServiceCardProps {
  service: Service;
  onCardClick: (service: Service) => void;
  deleteService: (service: Service) => void;
}

export default function ServiceCard({ service, onCardClick, deleteService }: ServiceCardProps) {
  return (
    <div
      className="flex flex-row w-[100%] h-32 bg-white rounded-card text-base"
    >
      <img src={service.image_urls[0] || '/blank_pfp.webp'} alt={service.title} className="w-[30%] rounded-l-card object-cover" />
      <div className="grid grid-cols-2 sm:grid-cols-3 w-[80%] items-center px-[1%] sm:px-[5%]">
        <div className="text-center">{service.title}</div>
        <div className="hidden sm:block text-custom-lightgray text-center">Est. ${service.price}</div>
        <div className="flex flex-row  text-center items-center justify-end">
          <button
            className="bg-black text-white hover:bg-black/80 rounded-card w-[40%] py-[.5%] px-custom"
            onClick={(e) => {
              e.stopPropagation();
              onCardClick(service);
            }}
          >
            Edit
          </button>
          <button className="ml-2" onClick={(e) => {
            e.stopPropagation();
            deleteService(service);
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}