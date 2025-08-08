"use client"
import { useState } from "react";

export default function CommissionCard({
  id,
  title,
  price,
  artist,
  image_urls,
  pfp_url,
  minHeight = 150,
  rating,
  showProfileInfo = true
}: any) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use image_urls if available, otherwise use empty array
  const images = image_urls && image_urls.length > 0 ? image_urls : [];

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <div
      className="bg-custom-darkgray rounded-lg overflow-hidden group"
      style={{ minHeight: `${minHeight}px` }}
    >
      <div className="relative">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={title}
            className="w-full h-48 object-cover rounded-[15px] transition-all duration-300 ease-in-out"
          />
        ) : (
          <div className="w-full h-48 bg-gray-600 rounded-[15px] flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        {/* Heart icon on hover */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="bg-black bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 text-white text-opacity-30 w-6 h-6 rounded-full flex items-center justify-center "
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 text-white text-opacity-30 w-6 h-6 rounded-full flex items-center justify-center"
            >
              ›
            </button>
          </>
        )}

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_: string, index: number) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-1 h-1 rounded-full transition-opacity ${index === currentImageIndex
                  ? 'bg-white opacity-100'
                  : 'bg-white opacity-40'
                  }`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-0">
        <h1 className="text-white font-medium mb-0">{title}</h1>
        {showProfileInfo && (
          <div className="flex items-center">
            <img src={pfp_url} alt={artist} className="w-5 h-5 rounded-full mr-2" />
            <span className="text-custom-lightgray text-sm">@{artist}</span>
            <span className="text-custom-lightgray text-sm ml-auto mr-2">~${price}</span>
            <span className="text-white text-sm">★ {rating}</span>
          </div>
        )}
        {!showProfileInfo && (
          <div className="flex items-center justify-start">
            <span className="text-custom-lightgray text-sm">~${price}</span>
          </div>
        )}
      </div>
    </div>
  );
}