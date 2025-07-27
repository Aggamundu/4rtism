"use client"
import { useEffect, useRef, useState } from 'react';

export default function Header() {
  const [hasOverflow, setHasOverflow] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkOverflow = () => {
      if (categoriesRef.current) {
        const element = categoriesRef.current;
        const isOverflowing = element.scrollWidth > element.clientWidth;
        setHasOverflow(isOverflowing);
        setCanScrollLeft(element.scrollLeft > 0);
        setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth);
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, []);

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      categoriesRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });

      // Update scroll state after scrolling
      setTimeout(() => {
        if (categoriesRef.current) {
          const element = categoriesRef.current;
          setCanScrollLeft(element.scrollLeft > 0);
          setCanScrollRight(element.scrollLeft < element.scrollWidth - element.clientWidth);
        }
      }, 300);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col sm:flex-row text-base items-center justify-between p-2 space-y-2 sm:space-y-0">
        <div className="text-lg font-bold mr-0 sm:mr-4 order-1 sm:order-1">
          Project
        </div>
        <div className="relative w-full sm:w-[55%] flex justify-center order-3 sm:order-2">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
          />
          <svg
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <div className="flex flex-row items-center order-2 sm:order-3">
          <p className="text-base font-bold mr-4">Login</p>
          <p className="text-base font-bold mr-4">Signup</p>
        </div>
      </div>
      <div className="flex text-base items-center justify-between p-2">
        {canScrollLeft && (
          <button
            onClick={() => scrollCategories('left')}
            className="mr-2 p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <div ref={categoriesRef} className="flex space-x-6 text-[10px] overflow-x-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <a href="#" className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">Trending</a>
          <a href="#" className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">Graphic Design/Logo</a>
          <a href="#" className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">Chibi</a>
          <a href="#" className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">Cartoon</a>
          <a href="#" className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">Anime</a>
          <a href="#" className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">Semi-Realistic/Realistic</a>
          <a href="#" className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">Hyper-Realistic</a>
          <a href="#" className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">OC Portrait</a>
          <a href="#" className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">Cyberpunk</a>
          <a href="#" className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">Mecha</a>
          <a href="#" className="text-gray-500 hover:text-black transition-colors whitespace-nowrap">Vector</a>
        </div>
        {canScrollRight && (
          <button
            onClick={() => scrollCategories('right')}
            className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
      <div className="w-full h-[1px] bg-gray-300"></div>
    </div>
  )
}