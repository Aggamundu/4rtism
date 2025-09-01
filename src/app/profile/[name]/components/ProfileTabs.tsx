'use client';
import { useState } from 'react';
import CommissionCardGrid from '../../../home/components/CommissionCardGrid';
import Homepage from '../../../homepage/homepage';
import { Commission, Review } from '../../../types/Types';
import ReviewTable from '../components/ReviewTable';
import CommissionRequestOverlay from './CommissionRequestOverlay';
import ReviewOverview from './ReviewOverview';

export default function ProfileTabs({ commissions, pictures, reviews, displayName }: { commissions: Commission[], pictures: string[], reviews: Review[], displayName: string }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'portfolio' | 'reviews'>('overview');


  return (
    <div className="w-full mt-0 relative sm:top-[-2.5rem] top-[-1rem]">
      {/* Tab Navigation */}
      <div className="px-custom overflow-x-auto">
        <div className="flex min-w-max gap-x-[1rem] text-sm">
          <svg className="w-6 h-6 fill-custom-lightgray">
            <path d="M0 1.75A.75.75 0 0 1 .75 1h4.253c1.227 0 2.317.59 3 1.501A3.743 3.743 0 0 1 11.006 1h4.245a.75.75 0 0 1 .75.75v10.5a.75.75 0 0 1-.75.75h-4.507a2.25 2.25 0 0 0-1.591.659l-.622.621a.75.75 0 0 1-1.06 0l-.622-.621A2.25 2.25 0 0 0 5.258 13H.75a.75.75 0 0 1-.75-.75Zm7.251 10.324.004-5.073-.002-2.253A2.25 2.25 0 0 0 5.003 2.5H1.5v9h3.757a3.75 3.75 0 0 1 1.994.574ZM8.755 4.75l-.004 7.322a3.752 3.752 0 0 1 1.992-.572H14.5v-9h-3.495a2.25 2.25 0 0 0-2.25 2.25Z">
            </path>
          </svg>
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-0 transition-colors whitespace-nowrap ${activeTab === 'overview'
              ? 'text-white border-b-2 border-white'
              : 'text-custom-lightgray hover:text-gray-700'
              }`}
          >
            Overview
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
        {activeTab === 'overview' && (
          <div>
            <CommissionCardGrid commissions={commissions} showProfileInfo={false}/>
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