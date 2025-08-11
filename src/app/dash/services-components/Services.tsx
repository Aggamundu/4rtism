'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../../../../utils/supabaseClient';
import NewServiceOverlay from './NewServiceOverlay';
import ServiceCard from './ServiceCard';
import ServiceOverlay from './ServiceOverlay';

interface Question {
  id: string;
  title: string;
  type: 'short-answer' | 'paragraph' | 'multiple-choice' | 'checkboxes';
  required: boolean;
  options?: string[];
}

interface Service {
  id: string;
  title: string;
  price: string;
  description?: string;
  deliveryTime?: string;
  image_urls?: string[];
  questions?: Question[];
}

export default function Services() {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const { user } = useAuth();

  const fetchQuestions = async (commissionId: string) => {
    const { data, error } = await supabaseClient.from('questions').select('id, question_text, type, is_required, question_options(option_text)').eq('commission_id', commissionId);
    if (error) {
      console.error('Error fetching questions:', error);
    }
    console.log('questions:', data);
    return data;
  }

  const fetchCommissions = async () => {
    const { data, error } = await supabaseClient.from('commissions').select('*').eq('profile_id', user?.id);
    if (error) {
      console.error('Error fetching commissions:', error);
    }
    if (!data) return;

    const servicesWithQuestions = [];

    for (const service of data) {
      const questions: Question[] = [];
      const questionsData = await fetchQuestions(service.id);
      if (!questionsData) {
        servicesWithQuestions.push(service);
      } else {
        for (const question of questionsData) {
          questions.push({
            id: question.id,
            title: question.question_text,
            type: question.type,
            required: question.is_required,
            options: question.question_options.map((option: any) => option.option_text)
          });
        }
        servicesWithQuestions.push({ ...service, questions });
      }
    }
    setServices(servicesWithQuestions);
  }
  useEffect(() => {
    fetchCommissions();
  }, []);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 gap-4 sm:gap-0">
        <div className="text-xl sm:mr-[5%]">
          Services
        </div>
        <button className="bg-black text-white hover:bg-black/80 rounded-card w-36 py-[.5%] px-custom" onClick={() => setIsCreateFormOpen(true)}>
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
        onSuccess={fetchCommissions}
      />
      <NewServiceOverlay
        isOpen={isCreateFormOpen}
        onClose={handleCloseOverlay}
        onSuccess={fetchCommissions}
      />
    </div>
  );
}