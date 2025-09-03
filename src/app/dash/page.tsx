'use client';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabaseClient } from '../../../utils/supabaseClient';
import CommissionsSeller from './components/CommissionsSeller';
import Stripe from './stripe-components/Stripe';

export default function DashPage() {
  const [activeNav, setActiveNav] = useState('commissions');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();
  const navOptions = [
    { value: 'commissions', label: 'Commissions' },
    { value: 'stripe', label: 'Stripe Dashboard' },
  ];

  const checkHasOnboarded = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single()
    if (!data?.has_onboarded) {
      router.push('/onboarding')
    }
  }

  const renderComponent = () => {
    switch (activeNav) {
      case 'commissions':
        return <CommissionsSeller />;
      case 'stripe':
        return <Stripe />;

      default:
        return <CommissionsSeller />;
    }
  };
  useEffect(() => {
    if (!user && !loading) {
      router.push('/');
      toast.error('Please login to access the dashboard', { duration: 2000 });
      return;
    }
    if (!loading && user) {
      checkHasOnboarded()
    }
  }, [user, loading])
  // Show loading state while auth is being determined
  if (loading) {
    return (
      <div className="flex flex-col sm:flex-row pt-14">
        <Header />
        <div className="w-full h-screen flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }



  return (
    <div className="flex flex-col sm:flex-row pt-14">
      <Header />
      {/* Mobile Navigation */}
      <div className="sm:hidden w-full bg-custom-darkgray p-4">
        <div className="relative">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full bg-custom-gray text-white px-4 py-2 rounded-lg flex items-center justify-between"
          >
            <span>{navOptions.find(option => option.value === activeNav)?.label}</span>
            <svg className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isMobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-custom-gray rounded-lg mt-1 z-50">
              {navOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setActiveNav(option.value);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-custom-lightgray ${activeNav === option.value ? 'text-custom-beige bg-custom-lightgray' : 'text-white'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden sm:block w-[15%] h-screen text-white text-base items-center">
        <div className="relative top-[15%]">
          <nav className="space-y-4 flex flex-col items-center pl-[10%]">
            <button
              onClick={() => setActiveNav('commissions')}
              className={`w-[100%] text-left ${activeNav === 'commissions' ? 'text-custom-beige' : ''}`}
            >
              Commissions
            </button>
            <button
              onClick={() => setActiveNav('stripe')}
              className={`w-[100%] text-left ${activeNav === 'stripe' ? 'text-custom-beige' : ''}`}
            >
              Stripe
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full sm:w-[85%] h-screen">
        {renderComponent()}
      </div>
    </div>
  );
}