'use client';
import { useState } from 'react';
import CommissionCardGrid from '../../../home/components/CommissionCardGrid';
import Homepage from '../../../homepage/homepage';
import ReviewTable from '../components/ReviewTable';
import { Commission, Picture } from '../../../types/Types';

export default function ProfileTabs({ commissions, pictures }: { commissions: Commission[], pictures: Picture[] }) {
  const [activeTab, setActiveTab] = useState<'commission' | 'portfolio' | 'reviews'>('commission');


  return (
    <div className="w-full mt-0">
      {/* Tab Navigation */}
      <div className="px-custom overflow-x-auto pt-[0.5rem]">
        <div className="flex min-w-max gap-x-[1rem]">
          <button
            onClick={() => setActiveTab('commission')}
            className={`px-0 font-bold text-lg transition-colors whitespace-nowrap ${activeTab === 'commission'
              ? 'text-white border-b-2 border-white'
              : 'text-custom-lightgray hover:text-gray-700'
              }`}
          >
            Commission
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-0 font-bold text-lg transition-colors whitespace-nowrap ${activeTab === 'portfolio'
              ? 'text-white border-b-2 border-white'
              : 'text-custom-lightgray hover:text-gray-700'
              }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-0 font-bold text-lg transition-colors whitespace-nowrap ${activeTab === 'reviews'
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
            <ReviewTable />
          </div>
        )}
      </div>
    </div>
  );
} 