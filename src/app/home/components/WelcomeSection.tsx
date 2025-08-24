"use client"
import { useEffect, useRef, useState } from "react";
import kai from "../../../../public/images/kai.png";
import kai2 from "../../../../public/images/kai2.png";
import kai3 from "../../../../public/images/kai3.png";
import FeaturedCard from "./FeaturedCard";

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
    <div className="relative mb-[2%] px-custom">
      <p className="text-base pt-2 pb-2">Featured Art</p>
      {/* <h1 className="text-xl px-8">4 Artists & 4utists</h1> */}
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
          className="flex flex-row gap-x-2 overflow-x-auto scrollbar-hide"
        >
          <FeaturedCard image={kai.src} artist="kaito" />

          <FeaturedCard image={kai2.src} artist="kaito" />

          <FeaturedCard image={kai3.src} artist="kaito" />
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