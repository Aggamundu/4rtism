import { ReactNode } from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Forgot Password"
};

interface ForgotPasswordLayoutProps {
  children: ReactNode;
}

export default function ForgotPasswordLayout({ children, }: ForgotPasswordLayoutProps) {
  return (
    <div className="">
      {children}
    </div>
  );
}
