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
    { value: 'requests', label: 'Your Requests' },
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
      {/* Desktop Sidebar */}


      {/* Main Content */}
      <div className="w-full min-h-screen">
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto">
          {renderComponent()}
        </div>
      </div>
    </div>
  );
}