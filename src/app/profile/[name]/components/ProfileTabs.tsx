'use client';
import { useState } from 'react';
import CommissionCardGrid from '../../../home/components/CommissionCardGrid';
import Homepage from '../../../homepage/homepage';
import { Commission, Picture, Review } from '../../../types/Types';
import ReviewTable from '../components/ReviewTable';
import ReviewOverview from './ReviewOverview';

export default function ProfileTabs({ commissions, pictures, reviews }: { commissions: Commission[], pictures: Picture[], reviews: Review[] }) {
  const [activeTab, setActiveTab] = useState<'commission' | 'portfolio' | 'reviews'>('commission');


  return (
    <div className="w-full mt-0">
      {/* Tab Navigation */}
      <div className="px-custom overflow-x-auto">
        <div className="flex min-w-max gap-x-[1rem] text-base sm:text-lg">
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-0 font-bold  transition-colors whitespace-nowrap ${activeTab === 'commission'
              ? 'text-white border-b-2 border-white'
              : 'text-custom-lightgray hover:text-gray-700'
              }`}
          >
            Commission
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-0 font-bold ransition-colors whitespace-nowrap ${activeTab === 'portfolio'
              ? 'text-white border-b-2 border-white'
              : 'text-custom-lightgray hover:text-gray-700'
              }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-0 font-bold  transition-colors whitespace-nowrap ${activeTab === 'reviews'
              ? 'text-white border-b-2 border-white'
              : 'text-custom-lightgray hover:text-gray-700'
              }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-[1rem]">
        {activeTab === 'commission' && (
          <div>
            <CommissionCardGrid commissions={commissions} showProfileInfo={false} />
          </div>
        )}
        {activeTab === 'portfolio' && (
          <div className="min-h-[200px]">
            <Homepage pictures={pictures} />
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="min-h-[200px]">
            <ReviewOverview reviews={reviews} />
            <ReviewTable reviews={reviews} />
          </div>
        )}
      </div>
    </div>
  );
} 