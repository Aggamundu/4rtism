'use client';
import { useState } from 'react';

interface AboutProps {
  imageSrc: string;
  displayName: string;
  userName: string;
  bio: string;
}

export default function About({ imageSrc, displayName, userName, bio }: AboutProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const maxLength = 80; // Characters to show before "see more"

  const shouldShowSeeMore = bio.length > maxLength;
  const displayText = isExpanded ? bio : bio.slice(0, maxLength) + (shouldShowSeeMore ? '...' : '');

  const handleSeeMore = () => {
    setShowOverlay(true);
  };

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  return (
    <>
      <div className="flex w-full flex-row items-start justify-left gap-x-6 px-custom sm:px-custom mt-[1rem] flex-wrap">
        <img src={imageSrc} alt="Profile" className="hidden sm:block w-[10rem] h-[10rem] rounded-full border-2 border-black" />
        <div className="hidden sm:flex flex-col items-left justify-start text-left relative -top-2">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold">{displayName}</div>
          </div>
          <div className="relative -top-2">
            <div className="flex flex-row items-center">
              <div className="text-base mb-0">@{userName}</div>
              <button className="bg-custom-gray w-8 h-8 justify-center text-white rounded-full hover:bg-opacity-80 transition-all flex items-center ml-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </button>
            </div>
            <div className="text-sm text-custom-lightgray mb-0 relative top-1">
              {displayText}
              {shouldShowSeeMore && (
                <button
                  onClick={handleSeeMore}
                  className="text-custom-accent hover:text-custom-darkAccent font-medium ml-1"
                >
                  see more
                </button>
              )}
            </div>
          </div>
        </div>

        {/* mobile */}
        <div className="sm:hidden">
          <div className="flex flex-row">
            <img src={imageSrc} alt="Profile" className="w-[7rem] h-[7rem] rounded-full border-2 border-black mr-5" />
            <div className="flex flex-col items-left justify-start text-left relative -top-2">
              <div className="flex items-center gap-4">
                <div className="text-xl font-bold">{displayName}</div>
              </div>
              <div className="relative -top-2">
                <div className="flex flex-row items-center">
                  <div className="text-base mb-0">@{userName}</div>
                  <button className="bg-custom-gray w-8 h-8 justify-center text-white rounded-full hover:bg-opacity-80 transition-all flex items-center ml-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="text-sm text-custom-lightgray mb-0 relative top-1">
            {displayText}
            {shouldShowSeeMore && (
              <button
                onClick={handleSeeMore}
                className="text-custom-accent hover:text-custom-darkAccent font-medium ml-1"
              >
                see more
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bio Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-custom-darkpurple rounded-card max-h-[95vh] overflow-y-auto w-full sm:w-[50rem] p-custom relative">
            <div className="flex justify-between items-center mb-4">
              <button 
            onClick={handleCloseOverlay}
            className="absolute top-2 right-2 text-custom-lightgray hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            </button>
            </div>
            <div className="text-custom-lightgray">
              {bio}
            </div>
          </div>
        </div>
      )}
    </>
  );
}