"use client"
import { useAuth } from "@/contexts/AuthContext";
import CommissionCardGrid from "./components/CommissionCardGrid";
import WelcomeSection from "./components/WelcomeSection";

export default function Home() {
  const { user } = useAuth();
  // Dummy commission data
  const dummyCommissions = [
    {
      id: "1",
      title: "Digital Portrait Commission",
      description: "Custom digital portrait in semi-realistic style",
      price: 45.99,
      artist: "artista_123",
      image_urls: [
        "https://example.com/portrait1.jpg",
        "https://example.com/portrait2.jpg"
      ],
      pfp_url: "https://example.com/artist1_pfp.jpg",
      rating: 4.5
    },
    {
      id: "2",
      title: "Character Design",
      description: "Original character design in anime style",
      price: 75.00,
      artist: "anime_artist",
      image_urls: [
        "https://example.com/character1.jpg",
        "https://example.com/character2.jpg"
      ],
      pfp_url: "https://example.com/artist2_pfp.jpg",
      rating: 5
    },
    {
      id: "3",
      title: "Pet Portrait",
      description: "Realistic pet portrait in watercolor style",
      price: 35.50,
      artist: "pet_artist",
      image_urls: [
        "https://example.com/pet1.jpg"
      ],
      pfp_url: "https://example.com/artist3_pfp.jpg",
      rating: 4.8
    },
    {
      id: "4",
      title: "Logo Design",
      description: "Professional logo design for your brand",
      price: 89.99,
      artist: "logo_master",
      image_urls: [
        "https://example.com/logo1.jpg",
        "https://example.com/logo2.jpg"
      ],
      pfp_url: "https://example.com/artist4_pfp.jpg",
      rating: 4.2
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