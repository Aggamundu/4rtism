'use client'
import Header from '@/components/Header';
import RequestCard from '@/components/RequestCard';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../../../utils/supabaseClient';
import { Request } from '../types/Types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface ConfirmationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

function ConfirmationOverlay({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Delete",
  cancelText = "Cancel"
}: ConfirmationOverlayProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-custom-darkgray rounded-lg p-6 max-w-sm mx-4 text-white">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <p className="mb-6 text-sm">{message}</p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-custom-lightgray hover:border-white transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyRequestsPage() {
  const [selectedRequests, setSelectedRequests] = useState<Request[]>([]);
  const [confirmationOverlay, setConfirmationOverlay] = useState<{
    isOpen: boolean;
    requestId: string | null;
  }>({
    isOpen: false,
    requestId: null
  });
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && !loading) {
      fetchRequests();
    }
  }, [user]);

  const checkHasOnboarded = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single()
    if (!data?.has_onboarded) {
      router.push('/onboarding')
    }
  }

  useEffect(() => {
    if (!user && !loading) {
      router.push('/');
      toast.error('Please login to access requests', { duration: 2000 });
      return;
    }
    if (!loading && user) {
      checkHasOnboarded()
    }
  }, [user, loading])

  const fetchRequests = async () => {
    const { data, error } = await supabaseClient.from('requests').select('*').eq('user_id', user?.id);
    if (error) {
      console.error(error);
    } else {
      setSelectedRequests(data as Request[]);
    }
  }

  const handleDeleteRequest = (id: string) => {
    setConfirmationOverlay({
      isOpen: true,
      requestId: id
    });
  }

  const handleConfirmDelete = () => {
    if (confirmationOverlay.requestId) {
      deleteRequest(confirmationOverlay.requestId);
    }
    setConfirmationOverlay({
      isOpen: false,
      requestId: null
    });
  }

  const handleCloseConfirmation = () => {
    setConfirmationOverlay({
      isOpen: false,
      requestId: null
    });
  }

  const deleteRequest = async (id: string) => {
    const { data, error } = await supabaseClient.from('requests').delete().eq('id', id);
    if (error) {
      console.error(error);
    } else {
      fetchRequests();
    }
  }

  return (
    <div className="flex flex-col pt-14 items-center">
      <Header />
      <div className="flex flex-col sm:w-[50%] w-full px-custom overflow-y-auto min-h-0 h-[calc(100vh-3.5rem)]">
        {selectedRequests.map((request) => (
          <div key={request.id} className="flex flex-row">
            <RequestCard request={request} />
            <button onClick={() => handleDeleteRequest(request.id)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <ConfirmationOverlay
        isOpen={confirmationOverlay.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmDelete}
        title="Delete Request"
        message="Are you sure you want to delete this request? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}