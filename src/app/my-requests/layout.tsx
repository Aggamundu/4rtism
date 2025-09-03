import { ReactNode } from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Requests"
};

interface MyRequestsLayoutProps {
  children: ReactNode;
}

export default function MyRequestsLayout({ children, }: MyRequestsLayoutProps) {
  return (
    <div className="">
      {children}
    </div>
  );
}
