"use client"
import CommissionCardGrid from "../display-components/CommissionCardGrid";
import WelcomeSection from "./WelcomeSection";

export default function Home() {
  // Dummy commission data
  const dummyCommissions = [
    {
      id: "1",
      title: "Custom Portrait",
      description: "Beautiful hand-drawn portrait in your preferred style. Perfect for gifts or personal use.",
      price: 75,
      artist: "kaito",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      profile_image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 4.5,
      image_urls: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop"
      ]
    },
    {
      id: "2",
      title: "Fantasy Character Design",
      description: "Unique fantasy character design with full color and detailed background.",
      price: 120,
      artist: "sarah",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      profile_image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      rating: 4.5,
      image_urls: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop"
      ]
    },
    {
      id: "3",
      title: "Landscape Painting",
      description: "Stunning landscape painting in oil or digital format. Customize the scene to your vision.",
      price: 200,
      artist: "mike",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 4.5,
      image_urls: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
      ]
    },
    {
      id: "4",
      title: "Anime Style Commission",
      description: "High-quality anime style artwork. Perfect for fan art or original characters.",
      price: 60,
      artist: "luna",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      profile_image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      rating: 4.5,
      image_urls: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop"
      ]
    },
    {
      id: "5",
      title: "Pet Portrait",
      description: "Lovely pet portrait that captures your furry friend's personality perfectly.",
      price: 45,
      artist: "kaito",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      profile_image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 4.5,
      image_urls: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=300&fit=crop"
      ]
    },
    {
      id: "6",
      title: "Abstract Art Piece",
      description: "Modern abstract artwork that will add a unique touch to any space.",
      price: 150,
      artist: "alex",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
      profile_image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 4.5,
      image_urls: [
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop"
      ]
    }
  ];

  return (
    <div className="relative">
      <WelcomeSection />
      {/* Categories */}
      <div className="flex flex-row text-sm">
        <div className="pl-8 pr-0 mb-4">
          <button className="bg-custom-darkgray text-white px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all flex items-center">
            Categories
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        {/* Sort by */}
        <div className="mb-4 flex gap-2 items-center">
          <button className="bg-custom-darkgray text-white py-2 rounded-lg hover:bg-opacity-80 transition-all flex items-center">
            <span className="text-custom-lightgray mr-1">Sort by: </span> Price
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button className="bg-custom-gray w-8 h-8 justify-center text-white rounded-lg hover:bg-opacity-80 transition-all flex items-center">
            <svg className="w-4 h-4" fill="none" stroke="white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </button>
        </div>
      </div>
      <CommissionCardGrid commissions={dummyCommissions} />
    </div>
  );
}