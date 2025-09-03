"use client"

import Header from "@/components/Header";
import Stripe from "../dash/stripe-components/Stripe";

export default function StripePage() {
  return (
    <div className="flex flex-col pt-14">
      <Header />
      <Stripe />
    </div>

  );
}