"use client"

import Header from "@/components/Header";
import Stripe from "../dash/stripe-components/Stripe";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabaseClient } from "../../../utils/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
export default function StripePage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const checkHasOnboarded = async () => {
    const { data, error } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single()
    if (!data?.has_onboarded) {
      router.push('/onboarding')
    }
  }

  useEffect(() => {
    if (!user && !loading) {
      router.push('/');
      toast.error('Please login to access Stripe', { duration: 2000 });
      return;
    }
    if (!loading && user) {
      checkHasOnboarded()
    }
  }, [user, loading])
  return (
    <div className="flex flex-col pt-14">
      <Header />
      <Stripe />
    </div>

  );
}