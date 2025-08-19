'use client';
import { AnswerDisplay, CommissionRequest } from '@/app/types/Types';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../../../../utils/supabaseClient';
import { useAuth } from '../../../contexts/AuthContext';
import CommissionGrid from './CommissionGrid';

export default function CommissionsSeller() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');
  const [commissionsData, setCommissionsData] = useState<CommissionRequest[]>([]);
  const [answersData, setAnswersData] = useState<AnswerDisplay[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const onRefresh = () => {
    fetchResponses();
  }

  const CreateServiceDisplay = async (commissionId: string) => {
    const { data, error } = await supabaseClient.from('commissions').select('*').eq('id', commissionId).single();
    if (data) {
      return {
        title: data.title,
        price: data.price,
        image_urls: data.image_urls
      }
    }
  }
  // const fetchCommissionTitle

  const fetchAnswers = async (responseId: number) => {
    const answers: AnswerDisplay[] = [];
    const { data, error } = await supabaseClient.from('answers').select('*, questions!inner(question_text, type)').eq('response_id', responseId);
    if (data) {
      for (const answer of data) {
        switch (answer.questions.type) {
          case 'short-answer':
          case 'paragraph':
            answers.push({
              question_text: answer.questions.question_text,
              type: answer.questions.type,
              answer_text: answer.answer_text,
            });
            break;
          case 'multiple-choice':
            const { data: option, error } = await supabaseClient.from('question_options').select('*').eq('id', answer.selected_option_id).single();
            answers.push({
              question_text: answer.questions.question_text,
              type: answer.questions.type,
              selected_option: option.option_text,
            });
            break;
          case 'checkboxes':
            const selectedOptions: string[] = [];
            for (const option_id of answer.selected_option_ids) {
              const { data: option, error } = await supabaseClient.from('question_options').select('*').eq('id', option_id).single();
              selectedOptions.push(option.option_text);
            }
            answers.push({
              question_text: answer.questions.question_text,
              type: answer.questions.type,
              selected_options: selectedOptions,
            })
            break;
        }
      }
    }
    return answers;
  }

  const fetchResponses = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabaseClient.from('responses').select('*, commissions!inner(title)').eq('commissions.profile_id', user?.id);
      if (data) {
        const commissions: CommissionRequest[] = [];
        for (const response of data) {
          const answers = await fetchAnswers(response.id);
          const service = await CreateServiceDisplay(response.commission_id);
          const { data: clientData, error: clientError } = await supabaseClient.from('emails').select('*').eq('response_id', response.id).single();
          commissions.push({
            response_id: response.id,
            status: response.status,
            payment: response.payment,
            submitted: response.created_at,
            confirmed: response.confirmed,
            service: service || { title: '', price: '', image_urls: [] },
            commission_title: response.commissions.title,
            commission_id: response.commission_id,
            description: response.description,
            reference_image_urls: response.image_urls,
            submission_urls: response.submission_urls,
            answers: answers,
            instagram: response.instagram,
            discord: response.discord,
            twitter: response.twitter,
            client_email: clientData?.email || ''
          })
        }
        setCommissionsData(commissions);
        console.log("commissions data", commissions);
      } else {
        console.log("error", error);
      }
    } catch (error) {
      console.error("Error fetching responses:", error);
      setError("Failed to load commissions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchResponses();
  }, [user?.id]);



  return (
    <div className="bg-custom-offwhite min-h-screen overflow-y-auto w-[100%] float-right text-black px-[5%] py-[.5%] rounded-[30px]">
      <div className="text-xl mb-6">
        Commissions
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 gap-x-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`text-base transition-colors ${activeTab === 'active'
            ? 'text-black border-b-2 border-black'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={` text-base transition-colors ${activeTab === 'completed'
            ? 'text-black border-b-2 border-black'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={` text-base transition-colors ${activeTab === 'all'
            ? 'text-black border-b-2 border-black'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          All
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-green mx-auto mb-4"></div>
              <p className="text-gray-600">Loading commissions...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  fetchResponses();
                }}
                className="bg-custom-green hover:bg-custom-green/90 text-white font-bold py-2 px-4 rounded"
              >
                Retry
              </button>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'active' && (
              <div>
                <CommissionGrid activeTab={activeTab} commissionsData={commissionsData} onRefresh={onRefresh} />
              </div>
            )}

            {activeTab === 'completed' && (
              <div>
                <CommissionGrid activeTab={activeTab} commissionsData={commissionsData} onRefresh={onRefresh} />
              </div>
            )}

            {activeTab === 'all' && (
              <div>
                <CommissionGrid activeTab={activeTab} commissionsData={commissionsData} onRefresh={onRefresh} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}