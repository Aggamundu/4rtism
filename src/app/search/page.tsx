"use client";
import CommissionColumn from "@/components/CommissionColumn";
import Header from "@/components/Header";
import RequestCard from "@/components/RequestCard";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { supabaseClient } from "../../../utils/supabaseClient";
import { Commission, Option, Question, Request } from "../types/Types";
import CommissionCardGrid from "../home/components/CommissionCardGrid";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState<Commission[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const getOptions = async (questionId: number) => {
    const { data, error } = await supabaseClient
      .from('question_options')
      .select('*')
      .eq('question_id', questionId);

    if (error) {
      console.error(error);
    }
    if (data) {
      const options: Option[] = [];
      for (const option of data) {
        options.push({
          id: option.id,
          option_text: option.option_text,
          question_id: option.question_id
        });
      }
      console.log('Options:', options);
      return options;
    }
  }

  const getQuestions = async (commissionId: number) => {
    const questions: Question[] = [];
    const { data, error } = await supabaseClient
      .from('questions')
      .select('*')
      .eq('commission_id', commissionId);

    if (error) {
      console.error(error);
    }
    if (data) {
      return Promise.all(data.map(async (question) => ({
        id: question.id,
        question_text: question.question_text,
        type: question.type,
        is_required: question.is_required,
        options: await getOptions(question.id)
      }))).then(questions => {
        console.log('Questions:', questions);
        return questions;
      });
    }
  }

  const getProfileData = async (id: string) => {
    const { data, error } = await supabaseClient.from('profiles').select('pfp_url').eq('id', id).single()
    if (error) {
      console.error(error)
    }
    return data
  }

  const fetchRequests = async () => {
    const { data, error } = await supabaseClient.from('requests').select('*').textSearch('search_vector', query || '', { type: 'websearch' });
    if (error) {
      console.error(error)
    } else {
      const requestsData: Request[] = []
      for (const request of data) {
        const requestData = {
          id: request.id,
          title: request.title,
          description: request.description,
          image_urls: request.image_urls,
          user_id: request.user_id
        } as Request
        requestsData.push(requestData)
      }
      setRequests(requestsData)
    }
  }

  const fetchCommissions = async () => {
    setIsLoading(true);
    const { data, error } = await supabaseClient
      .from('commissions')
      .select('*')
      .textSearch('search_vector', query || '', { type: 'websearch' });
    if (error) {
      console.error(error)
    } else {
      const commissionsData: Commission[] = []
      for (const commission of data) {
        const profileData = await getProfileData(commission.profile_id)
        const questions = await getQuestions(commission.id)
        const commissionData = {
          id: commission.id,
          title: commission.title,
          description: commission.description,
          price: commission.price,
          artist: commission.artist,
          image_urls: commission.image_urls,
          pfp_url: profileData?.pfp_url,
          rating: commission.rating,
          delivery_days: commission.delivery_days,
          questions: questions
        } as Commission
        console.log('Commission Data:', commissionData)
        commissionsData.push(commissionData)
      }
      setResults(commissionsData)
      setIsLoading(false);
    }
  }

  const displayResults = () => {
    if (results.length > 0 && requests.length > 0) {
      return <div className="flex flex-row">
        <div className="flex flex-col items-center w-[100%] pr-custom overflow-y-auto min-h-0 h-[calc(100vh-3.5rem)]">
          {requests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
        <CommissionColumn commissions={results} showProfileInfo={true} />
      </div>
    } else if (results.length > 0) {
      return <CommissionCardGrid commissions={results} />
    } else if (requests.length > 0) {
      return <div className="flex flex-col items-center w-[100%] px-custom">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    } else {
      return <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-white">No results found for {query}</div>
      </div>
    }
  }

  useEffect(() => {
    fetchCommissions()
    fetchRequests()
  }, [query]);


  return <div className="min-h-screen pt-14">
    <Header />
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        displayResults()
      )}
    </div>
  </div>;
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-14">
        <Header />
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}