'use client';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import Portfolio from '../profile/[name]/portfolio-components/Portfolio';
export default function EditPortfolio() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const fetchUsername = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('user_name').eq('id', user.id).single();
    if (error) {
      console.error(error);
    }
    setUsername(data?.user_name || "");
  }

  useEffect(() => {
    if (!user && !loading) {
      router.push('/');
    }
    if (user && !loading) {
      fetchUsername();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-[100vh] items-center justify-center p-6 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="">
      <Header />
      <Portfolio
        onClose={() => {
          router.push(`/profile/${username}`);
          // Force refresh the profile page after navigation
          setTimeout(() => router.refresh(), 100);
        }}
        onRefresh={() => {
          router.push(`/profile/${username}`);
          // Force refresh the profile page after navigation
          setTimeout(() => router.refresh(), 100);
        }}
      />
    </div>
  )
}