'use client';
import { useState } from 'react';
import CommissionCardGrid from '../../../home/components/CommissionCardGrid';
import Homepage from '../../../homepage/homepage';
import { Commission, Review } from '../../../types/Types';
import ReviewTable from '../components/ReviewTable';
import ReviewOverview from './ReviewOverview';

export default function ProfileTabs({ commissions, pictures, reviews, displayName }: { commissions: Commission[], pictures: string[], reviews: Review[], displayName: string }) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'reviews' | 'services'>('portfolio');


  return (
    <div className="w-full mt-0 relative sm:top-[-2.5rem] top-[-1rem]">
      {/* Tab Navigation */}
      <div className="px-custom overflow-x-auto">
        <div className="flex min-w-max gap-x-[1rem] text-sm items-center">
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-0 transition-colors whitespace-nowrap ${activeTab === 'portfolio'
              ? 'text-white border-b-2 border-custom-orange'
              : 'text-custom-lightgray hover:text-gray-700'
              }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-0  transition-colors whitespace-nowrap ${activeTab === 'services'
              ? 'text-white border-b-2 border-custom-orange'
              : 'text-custom-lightgray hover:text-gray-700'
              }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-0  transition-colors whitespace-nowrap ${activeTab === 'reviews'
              ? 'text-white border-b-2 border-custom-orange'
              : 'text-custom-lightgray hover:text-gray-700'
              }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-[1rem]">
        {activeTab === 'portfolio' && (
          <div>
            <Homepage pictures={pictures} />
          </div>
        )}
        {activeTab === 'services' && (
          <div className="min-h-[200px]">
            <CommissionCardGrid commissions={commissions} showProfileInfo={false} />
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