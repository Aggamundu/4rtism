"use client"
import Header from "@/components/Header";
import { useEffect, useRef, useState } from "react";
import { supabaseClient } from "../../../utils/supabaseClient";
import { Commission, Option, Question } from "../types/Types";
import CommissionCardGrid from "./components/CommissionCardGrid";
import WelcomeSection from "./components/WelcomeSection";

export default function Home() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Price");
  const [selectedCategory, setSelectedCategory] = useState("Categories");
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [selectedCommissions, setSelectedCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
    getCommissionsByCategory(category);
  }

  const handleSortClick = (sort: string) => {
    setSelectedSort(sort);
    setIsSortOpen(false);
    getCommissionsByPrice(sort);
  }
  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Only close if category or sort is open and click is outside the dropdown area
      if ((isCategoryOpen) && categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isCategoryOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Only close if category or sort is open and click is outside the dropdown area
      if ((isSortOpen) && sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isSortOpen]);

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

  const getCommissionsByPrice = async (price: string) => {
    setIsLoading(true);
    let filteredCommissions: Commission[] = [];

    switch (price) {
      case "Up to $20":
        filteredCommissions = commissions.filter((commission) => commission.price <= 20);
        break;
      case "$20 - $30":
        filteredCommissions = commissions.filter((commission) => commission.price <= 30 && commission.price >= 20);
        break;
      case "$30 - $40":
        filteredCommissions = commissions.filter((commission) => commission.price <= 40 && commission.price >= 30);
        break;
      case "$40 - $50":
        filteredCommissions = commissions.filter((commission) => commission.price <= 50 && commission.price >= 40);
        break;
      case "$50 & above":
        filteredCommissions = commissions.filter((commission) => commission.price >= 50);
        break;
    }

    setSelectedCommissions(filteredCommissions);
    setIsLoading(false);
  }

  const getCommissionsByCategory = async (category: string) => {
    setIsLoading(true);
    const { data, error } = await supabaseClient
      .from('commissions')
      .select('*')
      .eq('category', category);

    if (error) {
      console.error(error)
      return [];
    }

    const commissionsData: Commission[] = [];
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
      commissionsData.push(commissionData);
    }

    setSelectedCommissions(commissionsData);
    setCommissions(commissionsData);
    setIsLoading(false);
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
      setSelectedCommissions(commissionsData)
      setCommissions(commissionsData)
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchCommissions();
  }, []);


  return (
    <div className="relative pt-14 min-h-screen">
      <Header />
      <WelcomeSection />
      {/* Categories */}
      <div className="flex flex-row text-sm px-custom mb-4">
        <div className="">
          <button onClick={() => setIsCategoryOpen(!isCategoryOpen)} className="bg-custom-darkgray text-white py-2 rounded-lg hover:bg-opacity-80 transition-all flex items-center min-w-[165px] justify-between px-4 border-white border-[1px]">
            <span className="truncate">{selectedCategory}</span>
            <svg className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isCategoryOpen && (
            <div className="absolute z-50 bg-custom-gray text-xs rounded-sm shadow-lg w-[25%] sm:w-[15%]" ref={categoryDropdownRef}>
              <div onClick={() => handleCategoryClick("Chibi")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-t-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Chibi
              </div>
              <div onClick={() => handleCategoryClick("Graphic Design")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Graphic Design
              </div>
              <div onClick={() => handleCategoryClick("Cartoon")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Cartoon
              </div>
              <div onClick={() => handleCategoryClick("Anime")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Anime
              </div>
              <div onClick={() => handleCategoryClick("Semi-Realistic")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Semi-Realistic
              </div>
              <div onClick={() => handleCategoryClick("Hyper-Realistic")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Hyper-Realistic
              </div>
              <div onClick={() => handleCategoryClick("Other")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Other
              </div>
            </div>
          )}
        </div>

        {/* Sort by */}
        <div className="gap-2 items-center px-4">
          <button onClick={() => setIsSortOpen(!isSortOpen)} className="min-w-[145px] bg-custom-darkgray border-white border-[1px] px-4 text-white py-2 rounded-lg hover:bg-opacity-80 transition-all flex items-center justify-between">
            <span className="truncate">{selectedSort}</span>
            <svg className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isSortOpen && (
            <div className="absolute bg-custom-gray text-xs rounded-sm shadow-lg z-50 w-[25%] sm:w-[15%]" ref={sortDropdownRef}>
              <div onClick={() => handleSortClick("Up to $20")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Up to $20
              </div>
              <div onClick={() => handleSortClick("$20 - $30")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                $20 - $30
              </div>
              <div onClick={() => handleSortClick("$30 - $40")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                $30 - $40
              </div>
              <div onClick={() => handleSortClick("$40 - $50")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                $40 - $50
              </div>
              <div onClick={() => handleSortClick("$50 & above")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                $50 & above
              </div>
            </div>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      ) : (
        <CommissionCardGrid commissions={selectedCommissions} />
      )}
    </div>
  );
}