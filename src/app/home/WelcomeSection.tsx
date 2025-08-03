"use client"
import { useEffect, useRef, useState } from "react";
import kai from "../../../public/images/kai.png";
import kai2 from "../../../public/images/kai2.png";
import kai3 from "../../../public/images/kai3.png";

export default function WelcomeSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10); // Show left button when scrolled more than 10px
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10); // Hide right button when near the end
    }
  };

  useEffect(() => {
    checkScrollPosition();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScrollPosition);
      return () => scrollContainer.removeEventListener('scroll', checkScrollPosition);
    }
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-[2%]">
      <h1 className="text-xl px-8">4 Artists & 4utists</h1>
      <div className="relative">
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute opacity-80 left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white text-black w-10 h-10 rounded-full shadow-lg hover:bg-opacity-80 hidden md:flex items-center justify-center"
          >
            ‹
          </button>
        )}
        <div
          ref={scrollContainerRef}
          className="flex flex-row gap-x-2 overflow-x-auto scrollbar-hide px-8"
        >
          <div className="relative flex flex-col items-center justify-center overflow-hidden w-[100%] sm:w-[40%] flex-shrink-0">
            <img src={kai.src} alt="Artists keep 100%" className="h-full w-full object-cover object-center rounded-[30px] brightness-50" />
            <div className="absolute inset-0 flex flex-col justify-center text-white p-[8%]">
              <h1 className="text-lg font-bold">Artists keep 100%</h1>
              <p className="text-base">Clients pay 5% in fees - the lowest out of any art commission site</p>
            </div>
            <div className="absolute bottom-1 right-4 text-white bg-custom-lightgray bg-opacity-40 rounded-full pl-2 pr-2">
              <a href="/@kaito" className="text-sm hover:underline">
                @kaito
              </a>
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center overflow-hidden w-[100%] sm:w-[40%] flex-shrink-0">
            <img src={kai2.src} alt="No Generative AI" className="h-full w-full object-cover object-center rounded-[30px] brightness-50" />
            <div className="absolute inset-0 flex flex-col justify-center text-white p-[8%]">
              <h1 className="text-lg font-bold">No Generative AI</h1>
              <p className="text-base">You will be permanently banned if you are found using generative AI</p>
            </div>
            <div className="absolute bottom-1 right-4 text-white bg-custom-lightgray bg-opacity-40 rounded-full pl-2 pr-2">
              <a href="/@kaito" className="text-sm hover:underline">
                @kaito
              </a>
            </div>
          </div>

          <div className="relative flex flex-col items-center justify-center overflow-hidden w-[100%] sm:w-[40%] flex-shrink-0">
            <img src={kai3.src} alt="Quality Over Quantity" className="h-full w-full object-cover object-center rounded-[30px] brightness-50" />
            <div className="absolute inset-0 flex flex-col justify-center text-white p-[8%]">
              <h1 className="text-lg font-bold">Quality Over Quantity</h1>
              <p className="text-base">All commissions start at $30 to incentivize better pay for art</p>
            </div>
            <div className="absolute bottom-1 right-4 text-white bg-custom-lightgray bg-opacity-40 rounded-full pl-2 pr-2">
              <a href="/@kaito" className="text-sm hover:underline">
                @kaito
              </a>
            </div>
          </div>
        </div>
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute opacity-80 right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white text-black w-10 h-10 rounded-full shadow-lg hover:bg-opacity-80 hidden md:flex items-center justify-center"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
} 