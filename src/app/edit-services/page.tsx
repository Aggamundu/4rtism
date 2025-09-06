'use client';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabaseClient } from '../../../utils/supabaseClient';
import { useAuth } from '../../contexts/AuthContext';
import Services from '../profile/[name]/services-components/Services';

export default function EditServices() {
  const router = useRouter();
  const [username, setUsername] = useState<string>("");
  const { user, loading } = useAuth();
  const fetchUsername = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('user_name').eq('id', user?.id).single();
    if (error) {
      console.error(error);
    }
    setUsername(data?.user_name || "");
  }

  useEffect(() => {
    if (user && !loading) {
      fetchUsername();
    }
  }, [user]);

  return (
    <div>
      <Header />
      <Services
        onClose={() => {
          router.push(`/profile/${username}`);
        }}
        onRefresh={() => {
          router.push(`/profile/${username}`);
        }}
      />
    </div>
  )
}