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
  const [selectedSort, setSelectedSort] = useState("All Prices");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const [selectedCommissions, setSelectedCommissions] = useState<Commission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
  useEffect(() => {
    fetchCommissions();
  }, []);


  return (
    <div className="relative pt-14 min-h-screen">
      <Header />
      <WelcomeSection />
      {/* Categories */}
      <div className="flex flex-col sm:flex-row text-sm px-custom mb-[2%]">
        <div className="">
          <button onClick={() => {
            setIsCategoryOpen(!isCategoryOpen);
            setIsSortOpen(false);
          }} className="hover:bg-white/10 bg-custom-darkgray text-white py-2 rounded-lg hover:bg-opacity-80 transition-all flex items-center min-w-[165px] justify-between px-4 border-white border-[1px]">
            <span className="truncate">{selectedCategory}</span>
            <svg className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isCategoryOpen && (
            <div className="absolute z-50 bg-custom-gray text-xs rounded-sm shadow-lg w-[40%] sm:w-[15%]" ref={categoryDropdownRef}>
              <div onClick={() => handleFilter("All Categories", selectedSort)} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-t-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                All Categories
              </div>
              <div onClick={() => handleFilter("Chibi", selectedSort)} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-t-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Chibi
              </div>
              <div onClick={() => handleFilter("Graphic Design", selectedSort)} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Graphic Design
              </div>
              <div onClick={() => handleFilter("Cartoon", selectedSort)} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Cartoon
              </div>
              <div onClick={() => handleFilter("Anime", selectedSort)} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Anime
              </div>
              <div onClick={() => handleFilter("Semi-Realistic", selectedSort)} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Semi-Realistic
              </div>
              <div onClick={() => handleFilter("Hyper-Realistic", selectedSort)} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Hyper-Realistic
              </div>
              <div onClick={() => handleFilter("Other", selectedSort)} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Other
              </div>
            </div>
          )}
        </div>

        {/* Sort by */}
        <div className="flex flex-row sm:mt-0 mt-2 gap-2 sm:gap-0">
        <div className="gap-2 items-center sm:px-4">
          <button onClick={() => {
            setIsSortOpen(!isSortOpen);
            setIsCategoryOpen(false);
          }} className="hover:bg-white/10 min-w-[145px] bg-custom-darkgray border-white border-[1px] px-4 text-white py-2 rounded-lg hover:bg-opacity-80 transition-all flex items-center justify-between">
            <span className="truncate">{selectedSort}</span>
            <svg className={`w-4 h-4 ml-2 flex-shrink-0 transition-transform duration-200 ${isSortOpen ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isSortOpen && (
            <div className="absolute bg-custom-gray text-xs rounded-sm shadow-lg z-50 w-[40%] sm:w-[15%]" ref={sortDropdownRef}>
              <div onClick={() => handleFilter(selectedCategory, "All Prices")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                All Prices
              </div>
              <div onClick={() => handleFilter(selectedCategory, "Up to $20")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                Up to $20
              </div>
              <div onClick={() => handleFilter(selectedCategory, "$20 - $30")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                $20 - $30
              </div>
              <div onClick={() => handleFilter(selectedCategory, "$30 - $40")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                $30 - $40
              </div>
              <div onClick={() => handleFilter(selectedCategory, "$40 - $50")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                $40 - $50
              </div>
              <div onClick={() => handleFilter(selectedCategory, "$50 & above")} className="block px-4 py-2 text-base text-gray-300 hover:bg-gray-700 hover:rounded-sm hover:text-white transition-colors duration-200 cursor-pointer ">
                $50 & above
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-center">
          <button className="px-2 border-white border-[1px] rounded-lg py-2 hover:bg-white/10 transition-all active:scale-95" onClick={() => handleShuffle()}>
            <img src="/shuffle.svg" alt="Shuffle" className="w-[21px] h-[21px]" style={{ filter: 'brightness(0) saturate(100%) invert(100%)' }} />
          </button>
        </div>
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