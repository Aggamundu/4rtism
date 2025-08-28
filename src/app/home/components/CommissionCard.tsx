"use client"
import { useEffect, useRef, useState } from "react";
import { Commission } from "../../types/Types";

interface CommissionCardProps {
  commission: Commission;
  showProfileInfo?: boolean;
  onCardClick: (commission: Commission) => void;
  size?: 'small' | 'medium' | 'large';
}

export default function CommissionCard({
  commission,
  showProfileInfo = true,
  onCardClick,
  size = 'medium'
}: CommissionCardProps) {

  const { title, price, artist, image_urls, pfp_url } = commission;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Size-based styling
  const sizeClasses = {
    small: {
      image: 'h-32',
      title: 'text-sm',
      price: 'text-xs',
      artist: 'text-xs',
      pfp: 'w-4 h-4'
    },
    medium: {
      image: 'h-48',
      title: 'text-base',
      price: 'text-sm',
      artist: 'text-sm',
      pfp: 'w-5 h-5'
    },
    large: {
      image: 'h-64',
      title: 'text-lg',
      price: 'text-base',
      artist: 'text-base',
      pfp: 'w-6 h-6'
    }
  };

  const currentSize = sizeClasses[size];
  const [backgroundColor, setBackgroundColor] = useState("#1f2937"); // Default gray-800

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Use image_urls if available, otherwise use empty array
  const images = image_urls && image_urls.length > 0 ? image_urls : [];

  // Extract edge color when image changes
  useEffect(() => {
    if (images.length > 0 && images[currentImageIndex]) {
      extractEdgeColor(images[currentImageIndex]);
    }
  }, [currentImageIndex, images]);

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

  // Function to extract edge color from image
  const extractEdgeColor = (imageUrl: string) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Sample pixels from the edges only
        const edgePixels = [];

        // Top edge
        for (let x = 0; x < width; x += 2) {
          const index = (0 * width + x) * 4;
          if (data[index + 3] > 128) { // Check alpha
            edgePixels.push({
              r: data[index],
              g: data[index + 1],
              b: data[index + 2]
            });
          }
        }

        // Bottom edge
        for (let x = 0; x < width; x += 2) {
          const index = ((height - 1) * width + x) * 4;
          if (data[index + 3] > 128) {
            edgePixels.push({
              r: data[index],
              g: data[index + 1],
              b: data[index + 2]
            });
          }
        }

        // Left edge
        for (let y = 0; y < height; y += 2) {
          const index = (y * width + 0) * 4;
          if (data[index + 3] > 128) {
            edgePixels.push({
              r: data[index],
              g: data[index + 1],
              b: data[index + 2]
            });
          }
        }

        // Right edge
        for (let y = 0; y < height; y += 2) {
          const index = (y * width + (width - 1)) * 4;
          if (data[index + 3] > 128) {
            edgePixels.push({
              r: data[index],
              g: data[index + 1],
              b: data[index + 2]
            });
          }
        }

        if (edgePixels.length > 0) {
          // Calculate average edge color
          const avgR = Math.round(edgePixels.reduce((sum, pixel) => sum + pixel.r, 0) / edgePixels.length);
          const avgG = Math.round(edgePixels.reduce((sum, pixel) => sum + pixel.g, 0) / edgePixels.length);
          const avgB = Math.round(edgePixels.reduce((sum, pixel) => sum + pixel.b, 0) / edgePixels.length);

          setBackgroundColor(`rgb(${avgR}, ${avgG}, ${avgB})`);
        }
      } catch (error) {
        console.log("Error extracting edge color:", error);
      }
    };

    img.onerror = () => {
      setBackgroundColor("#1f2937"); // Fallback to gray-800
    };

    img.src = imageUrl;
  };

  return (
    <div
      onClick={() => onCardClick(commission)}
      className="bg-custom-darkgray rounded-lg overflow-hidden group hover:cursor-pointer"
    >
      <div className="relative">
        {images.length > 0 ? (
          <img
            src={images[currentImageIndex]}
            alt={title}
            className={`w-full ${currentSize.image} object-contain rounded-[15px] transition-all duration-300 ease-in-out`}
            style={{ backgroundColor }}
          />
        ) : (
          <div className={`w-full ${currentSize.image} bg-gray-600 rounded-[15px] flex items-center justify-center`}>
            <span className="text-gray-400">No image</span>
          </div>
        )}

        {/* Hidden canvas for color extraction */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Heart icon on hover */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Add your heart/favorite logic here
            }}
            className="bg-black bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-30 text-white text-opacity-30 w-6 h-6 rounded-full flex items-center justify-center "
            >
              ‹
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextImage();
              }}
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
      <div className="p-0 ">
        <div className="flex flex-row justify-between">
          <h1 className={`text-white font-medium mb-0 ${currentSize.title}`}>{title}</h1>
          {showProfileInfo && <span className={`text-custom-lightgray ml-auto mr-2 ${currentSize.price}`}>${price}</span>}
        </div>

        {showProfileInfo && (
          <div className="flex items-center">
            <img src={pfp_url} alt={artist} className={`${currentSize.pfp} rounded-full mr-2 object-cover`} />
            <span className={`text-custom-lightgray ${currentSize.artist}`}>@{artist}</span>
          </div>
        )}
        {!showProfileInfo && (
          <div className="flex items-center justify-start">
            <span className={`text-custom-lightgray ${currentSize.price}`}>${price}</span>
          </div>
        )}
      </div>
    </div>
  );
}