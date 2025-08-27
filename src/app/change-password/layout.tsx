import { ReactNode } from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Change Password"
};

interface ChangePasswordLayoutProps {
  children: ReactNode;
}

export default function ChangePasswordLayout({ children, }: ChangePasswordLayoutProps) {
  return (
    <div className="">
      {children}
    </div>
  );
}
