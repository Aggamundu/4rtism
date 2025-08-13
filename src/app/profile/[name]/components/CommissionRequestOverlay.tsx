"use client"
import { useEffect, useRef, useState } from "react";
import { Commission } from "../../../types/Types";
import Question from "./Question";
import UploadImages from "./UploadImages";

export default function CommissionRequestOverlay({
  isOpen,
  onClose,
  commission,
  displayName
}: {
  isOpen: boolean,
  onClose: () => void,
  commission: Commission,
  displayName: string
}) {
  const { image_urls, price, title, description, delivery_days, pfp_url, artist, questions } = commission;
  const [backgroundColor, setBackgroundColor] = useState("#1f2937");
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Extract edge color when component mounts or image changes
  useEffect(() => {
    if (image_urls && image_urls.length > 0) {
      extractEdgeColor(image_urls[0]); // Using the second image as in your code
    }
  }, [image_urls]);

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
      <div className="bg-custom-darkpurple rounded-card max-h-[95vh] overflow-y-auto w-full p-custom relative">
        <div className="fixed top-0 right-0 left-0 bg-custom-darkpurple p-[1%] z-50 flex justify-end items-center border-b border-custom-gray">
          <button
            onClick={onClose}
            className="text-custom-lightgray hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-white pt-[5%] sm:pt-[0%]">
          <div className="flex flex-col sm:flex-row gap-[1%]">
            {/* Images - Slideshow on mobile, fixed column on desktop */}
            <div className="w-full sm:w-[40%] sm:h-[90vh] sm:overflow-y-auto sm:pr-4 sm:sticky sm:top-0">
              {/* Mobile image */}
              <div className="sm:hidden">
                <div className="relative">
                  {image_urls && image_urls.length > 0 && (
                    <img
                      src={image_urls[0]}
                      className="w-full h-[10rem] object-contain rounded-lg"
                      style={{ backgroundColor }}
                      alt="Commission preview"
                    />
                  )}
                </div>

                {/* Hidden canvas for color extraction */}
                <canvas ref={canvasRef} className="hidden" />
              </div>

              {/* Desktop grid */}
              <div className="hidden sm:grid grid-cols-1 gap-2">
                {image_urls?.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    className="w-full h-auto rounded-lg object-cover"
                  />
                ))}
              </div>
            </div>

            {/* Content - Full width on mobile, 60% on desktop */}
            <div className="w-full sm:w-[60%] sm:h-[90vh] sm:overflow-y-auto">
              <p className="text-xl font-bold">{title}</p>
              <div className="relative -top-[1rem]">
                <div className="flex flex-row gap-[3%] text-lg text-custom-lightgray ">
                  <p>Est. ${price}</p>
                  <div className="flex items-center gap-1">
                    <p>{delivery_days} Days</p>
                    <img src="/truck.svg" alt="truck" className="w-6 h-6" />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-y-[.5rem] ">
                <div className="flex flex-row gap-[1%] mb-[.5rem]">
                  <img src={pfp_url} alt="pfp" className="w-[3.2rem] h-[3.2rem] rounded-full border-[1px] border-custom-lightgray" />
                  <div>
                    <p className="">{displayName}</p>
                    <p className="">@{artist}</p>
                  </div>
                </div>
                <div className="w-[100%] sm:w-[90%] border-[1px] border-custom-gray rounded-card p-custom">
                  <p className="break-words whitespace-pre-wrap text-custom-lightgray">{description}</p>
                </div>
                <UploadImages />
                <div className="mb-[1%]">
                  <div className="py-[1%]">
                    <span className="text-white text-sm font-medium">
                      Describe your commission
                      <span className="text-red-500 ml-1">*</span>
                    </span>
                  </div>
                  <textarea
                    className="sm:w-[90%] w-[100%] bg-custom-gray text-white rounded-lg p-3 focus:outline-none resize-none"
                    rows={4}
                    placeholder="Enter your commission details..."
                  />
                </div>
                {questions?.map((question, index) => (
                  <Question key={index} question={question} />
                ))}
              </div>
              <button className="bg-custom-accent text-white px-4 py-2 rounded-full">Request Commission</button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}