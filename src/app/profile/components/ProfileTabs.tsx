'use client';
import { useState } from 'react';
import CommissionCardGrid from '../../home/components/CommissionCardGrid';
import Homepage from '../../homepage/homepage';
import ReviewTable from '../components/ReviewTable';

export default function ProfileTabs() {
  const [activeTab, setActiveTab] = useState<'commission' | 'portfolio' | 'reviews'>('commission');

  // Sample commission data
  const sampleCommissions = [
    {
      id: "1",
      title: "Portrait Commission",
      description: "Custom portrait artwork",
      price: 150,
      artist: "Kai",
      image: "/images/kai.png",
      profile_image_url: "/images/kai.png",
      rating: 4.8
    },
    {
      id: "2",
      title: "Landscape Art",
      description: "Beautiful landscape painting",
      price: 200,
      artist: "Kai",
      image: "/images/kai2.png",
      profile_image_url: "/images/kai.png",
      rating: 4.9
    },
    {
      id: "3",
      title: "Character Design",
      description: "Original character artwork",
      price: 180,
      artist: "Kai",
      image: "/images/kai3.png",
      profile_image_url: "/images/kai.png",
      rating: 4.7
    }
  ];

  return (
    <div className="w-full mt-[1rem]">
      {/* Tab Navigation */}
      <div className="px-custom overflow-x-auto">
        <div className="flex min-w-max">
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-0 py-3 font-bold text-lg transition-colors border-b-2 px-[1rem] whitespace-nowrap ${activeTab === 'commission'
              ? 'text-white border-white'
              : 'text-custom-lightgray border-custom-lightgray hover:text-gray-700'
              }`}
          >
            Commission
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-0 py-3 font-bold text-lg transition-colors border-b-2 px-[1rem] whitespace-nowrap ${activeTab === 'portfolio'
              ? 'text-white border-white'
              : 'text-custom-lightgray border-custom-lightgray hover:text-gray-700'
              }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-0 py-3 font-bold text-lg transition-colors border-b-2 px-[1rem] whitespace-nowrap ${activeTab === 'reviews'
              ? 'text-white border-white'
              : 'text-custom-lightgray border-custom-lightgray hover:text-gray-700'
              }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'commission' && (
          <div>
            <CommissionCardGrid commissions={sampleCommissions} showProfileInfo={false} />
          </div>
        )}
        {activeTab === 'portfolio' && (
          <div className="min-h-[200px]">
            <Homepage />
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="min-h-[200px]">
            <ReviewTable />
          </div>
        )}
      </div>
    </div>
  );
} 