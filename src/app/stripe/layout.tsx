import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stripe"
};

export default function StripeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 