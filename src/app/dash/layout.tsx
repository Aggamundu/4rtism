import { ReactNode } from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard"
};

interface DashLayoutProps {
  children: ReactNode;
}

export default function DashLayout({ children, }: DashLayoutProps) {
  return (
    <div className="bg-gradient-to-b from-custom-darkgray to-custom-gray h-screen overflow-y-auto">
      {children}
    </div>
  );
}
