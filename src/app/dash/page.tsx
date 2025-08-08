'use client';
import { useState } from 'react';
import CommissionsSeller from './components/CommissionsSeller';
import UploadImages from './components/UploadImages';
import Portfolio from './portfolio-components/Portfolio';
import Services from './services-components/Services'

export default function DashPage() {
  const [activeNav, setActiveNav] = useState('commissions');

  const renderComponent = () => {
    switch (activeNav) {
      case 'commissions':
        return <CommissionsSeller />;
      case 'services':
        return <Services/>
      case 'stripe':
        return <div className="text-white">Stripe Dashboard Component</div>;
      case 'portfolio':
        return <Portfolio />;
      default:
        return <CommissionsSeller />;
    }
  };

  return (
    <div className="flex flex-row">
      <div className="w-[20%] h-screen text-white text-base px-custom">
        <div className="relative top-[15%]">
          <div className="text-custom-lightgray mb-4">
            Seller
          </div>
          <nav className="space-y-4 flex flex-col items-center pl-[10%]">
            <button
              onClick={() => setActiveNav('commissions')}
              className={`w-[100%] text-left ${activeNav === 'commissions' ? 'text-custom-accent' : ''}`}
            >
              Commissions
            </button>
            <button
              onClick={() => setActiveNav('services')}
              className={`w-[100%] text-left ${activeNav === 'services' ? 'text-custom-accent' : ''}`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveNav('stripe')}
              className={`w-[100%] text-left ${activeNav === 'stripe' ? 'text-custom-accent' : ''}`}
            >
              Stripe Dashboard
            </button>
            <button
              onClick={() => setActiveNav('portfolio')}
              className={`w-[100%] text-left ${activeNav === 'portfolio' ? 'text-custom-accent' : ''}`}
            >
              Portfolio
            </button>
          </nav>
        </div>
      </div>
      <div className="w-[80%] h-screen">
        {renderComponent()}
      </div>
    </div>
  );
}