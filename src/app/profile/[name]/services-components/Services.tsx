'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../../../../../utils/supabaseClient';
import { Option, Question, Service } from '../../../types/Types';
import NewServiceOverlay from './NewServiceOverlay';
import ServiceCard from './ServiceCard';
import ServiceOverlay from './ServiceOverlay';

export default function Services({ onClose, onRefresh }: { onClose: () => void, onRefresh?: () => void }) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const { user } = useAuth();

  const fetchQuestions = async (commissionId: string) => {
    const { data, error } = await supabaseClient.from('questions').select('id, question_text, type, is_required, question_options(id, option_text, question_id)').eq('commission_id', commissionId);
    if (error) {
      console.error('Error fetching questions:', error);
    }
    console.log('questions:', data);
    return data;
  }

  const fetchCommissions = async () => {
    setIsLoading(true);
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
            question_text: question.question_text,
            type: question.type,
            is_required: question.is_required,
            options: question.question_options.map((option: Option) => ({
              id: option.id,
              option_text: option.option_text,
              question_id: option.question_id
            }))
          });
        }
        servicesWithQuestions.push({ ...service, questions });
      }
    }
    setServices(servicesWithQuestions);
    setIsLoading(false);
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

  const deleteService = async (service: Service) => {
    const { data, error } = await supabaseClient.from('commissions').delete().eq('profile_id', user?.id).eq('id', service.id);
    if (error) {
      console.error('Error deleting service:', error);
    }
    fetchCommissions();
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  const handleDeleteService = (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
  }

  const confirmDelete = () => {
    if (serviceToDelete) {
      deleteService(serviceToDelete);
      setShowDeleteModal(false);
      setServiceToDelete(null);
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
  }




  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-custom-darkgray rounded-card max-h-[100vh] overflow-y-auto w-full sm:w-[40rem] relative">
        {/* Header */}
        <div className="sticky top-0 bg-custom-darkgray z-10 flex justify-between items-center p-6 border-b border-custom-gray">
          <button
            onClick={onClose}
            className="text-custom-accent hover:text-white transition-colors"
          >
            Cancel
          </button>
          <h2 className="text-white text-base font-semibold">Edit Services</h2>
          <button
            onClick={() => setIsCreateFormOpen(true)}
            className="text-custom-accent hover:text-white transition-colors"
          >
            + Service
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          <div className="flex flex-col gap-y-4">
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-custom-pink4"></div>
              </div>
            ) : (
              services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onCardClick={handleCardClick}
                  deleteService={handleDeleteService}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <ServiceOverlay
        isOpen={isOverlayOpen}
        onClose={handleCloseOverlay}
        service={selectedService}
        onSuccess={fetchCommissions}
        onRefresh={onRefresh}
      />
      <NewServiceOverlay
        isOpen={isCreateFormOpen}
        onClose={handleCloseOverlay}
        onSuccess={fetchCommissions}
        onRefresh={onRefresh}
      />
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 text-sm">
          <div className="bg-custom-darkgray rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Service</h3>
            <p className="text-white mb-6">
              This action cannot be undone. Deleting this service will also delete all associated commission requests.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-white border border-custom-lightgray hover:border-white font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 "
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}