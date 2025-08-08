'use client';
import { useState } from 'react';
import kai from "../../../../public/images/kai.png";
import kai2 from "../../../../public/images/kai2.png";
import ServiceCard from './ServiceCard';
import ServiceOverlay from './ServiceOverlay';
import NewServiceOverlay from './NewServiceOverlay';

interface Service {
  id: string;
  image: string;
  title: string;
  price: string;
  description?: string;
  category?: string;
  deliveryTime?: string;
  images?: string[];
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const services: Service[] = [
    {
      id: "1",
      image: kai.src,
      title: "Service 1",
      price: "100",
      description: "This is a description of service 1",
      category: "Art",
      deliveryTime: "3-5 days",
      images: [kai.src, kai2.src]
    },
    {
      id: "2",
      image: kai2.src,
      title: "Service 2",
      price: "150",
      description: "This is a description of service 2",
      category: "Design",
      deliveryTime: "1-2 weeks",
      images: [kai2.src]
    }
  ];

  const handleCardClick = (service: Service) => {
    setSelectedService(service);
    setIsOverlayOpen(true);
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    setIsCreateFormOpen(false);
    setSelectedService(null);
  };

  return (
    <div className="bg-custom-offwhite min-h-screen overflow-y-auto w-[100%] float-right text-black px-[5%] py-[.5%] rounded-[30px]">
      <div className="flex flex-row items-center mb-6">
        <div className="text-xl mr-[5%]">
          Services
        </div>
        <button className="bg-black text-white hover:bg-black/80 rounded-card w-[17%] py-[.5%] px-custom relative top-[10%]" onClick={() => setIsCreateFormOpen(true)}>
          + Service
        </button>
      </div>
      <div className="flex flex-col gap-y-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onCardClick={handleCardClick}
          />
        ))}
      </div>
      <ServiceOverlay
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
        service={selectedService}
      />
      <NewServiceOverlay
        isOpen={isCreateFormOpen}
        onClose={handleCloseOverlay}
      />
    </div>
  );
}