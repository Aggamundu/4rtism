"use client";

import Header from "@/components/Header";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabaseClient } from "../../../utils/supabaseClient";
import CommissionCardGrid from "../home/components/CommissionCardGrid";
import { Commission, Option, Question } from "../types/Types";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState<Commission[]>([]);
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
    if (results.length > 0) {
      return <div className="">
        <div className="px-custom text-white mb-2 mt-2">Results for {query}</div>
        <CommissionCardGrid commissions={results} />
      </div>
    } else {
      return <div className="flex justify-center items-center min-h-[50vh]">
        <div className="text-white">No results found for {query}</div>
      </div>
    }
  }

  useEffect(() => {
    fetchCommissions()
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