'use client';
import { useState } from 'react';
import CommissionGrid from './CommissionGrid';
export default function CommissionsSeller() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'all'>('active');

  return (
    <div className="bg-custom-offwhite min-h-screen overflow-y-auto w-[100%] float-right text-black px-[5%] py-[.5%] rounded-[30px]">
      <div className="text-xl mb-6">
        Commissions
      </div>

      {/* Tab Navigation */}
      <div className="flex mb-6 gap-x-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`text-base transition-colors ${activeTab === 'active'
            ? 'text-black border-b-2 border-black'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={` text-base transition-colors ${activeTab === 'completed'
            ? 'text-black border-b-2 border-black'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          Completed
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={` text-base transition-colors ${activeTab === 'all'
            ? 'text-black border-b-2 border-black'
            : 'text-gray-500 hover:text-gray-700'
            }`}
        >
          All
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'active' && (
          <div>
            <CommissionGrid activeTab={activeTab} />
          </div>
        )}

        {activeTab === 'completed' && (
          <div>
            <CommissionGrid activeTab={activeTab} />
          </div>
        )}

        {activeTab === 'all' && (
          <div>
            <CommissionGrid activeTab={activeTab} />
          </div>
        )}
      </div>
    </div>
  )
}