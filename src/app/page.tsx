"use client"
import CommissionColumn from "@/components/CommissionColumn";
import Header from "@/components/Header";
import RequestCard from "@/components/RequestCard";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { supabaseClient } from "../../utils/supabaseClient";
import { Commission, Option, Question, Request } from "./types/Types";

export default function Home() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("All Prices");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedCommissions, setSelectedCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRequests, setSelectedRequests] = useState<Request[]>([]);
  const { user, loading } = useAuth()
  const router = useRouter()
  useEffect(() => {
    fetchRequests()
    fetchCommissions()
  }, [])

  // Handle click outside to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Close category dropdown if click is outside
      if (isCategoryOpen && categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
      // Close sort dropdown if click is outside  
      if (isSortOpen && sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isCategoryOpen, isSortOpen]);

  const fetchRequests = async () => {
    const { data, error } = await supabaseClient.from('requests').select('*');
    if (error) {
      console.error(error)
    } else {
      setSelectedRequests(data as Request[])
    }
  }
  const handleShuffle = () => {
    const shuffledCommissions = [...selectedCommissions].sort(() => Math.random() - 0.5);
    setSelectedCommissions(shuffledCommissions);
  }

  const handleFilter = async (category: string, price: string) => {
    setSelectedCategory(category);
    setSelectedSort(price);
    setIsCategoryOpen(false);
    setIsSortOpen(false);

    let filteredCommissions: Commission[] = [];
    setIsLoading(true);

    // Define price ranges
    const priceRanges = {
      "All Prices": null,
      "Up to $20": { min: 0, max: 20 },
      "$20 - $30": { min: 20, max: 30 },
      "$30 - $40": { min: 30, max: 40 },
      "$40 - $50": { min: 40, max: 50 },
      "$50 & above": { min: 50, max: null }
    };

    const priceRange = priceRanges[price as keyof typeof priceRanges];
    let query = supabaseClient.from('commissions').select('*');

    if (category !== "All Categories") {
      query = query.eq('category', category);
    }

    if (priceRange) {
      if (priceRange.min !== null) {
        query = query.gte('price', priceRange.min);
      }
      if (priceRange.max !== null) {
        query = query.lt('price', priceRange.max);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);
    } else {
      for (const commission of data) {
        const profileData = await getProfileData(commission.profile_id);
        const questions = await getQuestions(commission.id);
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
        } as Commission;
        filteredCommissions.push(commissionData);
      }

      const shuffledCommissions = [...filteredCommissions].sort(() => Math.random() - 0.5);
      setSelectedCommissions(shuffledCommissions);
      setIsLoading(false);
    }
  }

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
    const { data, error } = await supabaseClient.from('commissions').select('*');
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
      // Randomize the order of commissions
      const shuffledCommissions = [...commissionsData].sort(() => Math.random() - 0.5);
      setSelectedCommissions(shuffledCommissions)
      setIsLoading(false);
    }
  }


  const checkHasOnboarded = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single()
    if (!data?.has_onboarded) {
      router.push('/onboarding')
    }
  }

  useEffect(() => {
    if (!loading && user) {
      checkHasOnboarded()
    }
  }, [user, loading])


  return (
    <div className="relative pt-14 min-h-screen px-custom">
      <Header />
      <div className="flex flex-row">
        <div className="flex flex-col items-center w-[100%] pr-custom overflow-y-auto min-h-0 h-[calc(100vh-3.5rem)]">
          {selectedRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))}
        </div>
        <CommissionColumn commissions={selectedCommissions} showProfileInfo={true} />
      </div>
      {/* Categories */}


    </div>
  );
}