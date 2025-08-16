'use client'
import { use, useEffect } from "react";
import { supabaseClient } from "../../../../utils/supabaseClient";
import { useAuth } from "../../../contexts/AuthContext";

export default function Return({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const updateStripeAccountInformation = async () => {
    const { data, error } = await supabaseClient.from("profiles").update({
      added_stripe_information: true,
    }).eq("id", user?.id);
    if (error) {
      console.log(user?.id);
      console.error(error);
    } else {
      console.log("success");
    }
  }

  useEffect(() => {
    updateStripeAccountInformation();
  }, [user]);

  const { id } = use(params);
  console.log(id);
  return (
    <div className="bg-gradient-to-b from-custom-darkgray to-custom-gray h-screen overflow-y-auto">
      <div className="flex flex-col items-center justify-center h-full text-white">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4 text-custom-beige">Details submitted</h2>
          <p className="text-custom-lightgray mb-8">That's everything we need for now</p>
          <a
            href="/dash"
            className="bg-custom-accent hover:bg-custom-accent/90 text-white font-bold py-3 px-8 rounded-full inline-block transition-colors"
          >
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}