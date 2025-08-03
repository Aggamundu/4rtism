"use client"
import { useState } from "react";

interface CommissionCardProps {
  id: string;
  title: string;
  price: number;
  artist: string;
  image: string;
  image_urls?: string[];
  minHeight?: number;
  profile_image_url: string;
  rating: number;
}

export default function CommissionCard({
  id,
  title,
  price,
  artist,
  image,
  image_urls,
  profile_image_url,
  minHeight = 150,
  rating
}: CommissionCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Use image_urls if available, otherwise fall back to the single image
  const images = image_urls && image_urls.length > 0 ? image_urls : [image];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };
  return (
    <div
      className="bg-custom-darkgray rounded-lg overflow-hidden "
      style={{ minHeight: `${minHeight}px` }}
    >
      <div className="relative">
        <img
          src={images[currentImageIndex]}
          alt={title}
          className="w-full h-48 object-cover rounded-[15px] transition-all duration-300 ease-in-out"
        />

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute text-white left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 w-6 h-6 rounded-full flex items-center justify-center hover:opacity-50 transition-opacity"
            >
              ‹
            </button>
            <button
              onClick={nextImage}
              className="absolute text-white right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 w-6 h-6 rounded-full flex items-center justify-center hover:opacity-50 transition-opacity"
            >
              ›
            </button>
          </>
        )}

        {/* Image indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {images.map((_, index) => (
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
        <div className="flex items-center">
          <img src={profile_image_url} alt={artist} className="w-5 h-5 rounded-full mr-2" />
          <span className="text-custom-lightgray text-sm">@{artist}</span>
          <span className="text-custom-lightgray text-sm ml-auto mr-2">~${price}</span>
          <span className="text-white text-sm">★ {rating}</span>
        </div>
      </div>
    </div>
  );
}