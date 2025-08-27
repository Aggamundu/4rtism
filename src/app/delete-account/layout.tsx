import { ReactNode } from 'react';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Delete Account"
};

interface DeleteAccountLayoutProps {
  children: ReactNode;
}

export default function DeleteAccountLayout({ children, }: DeleteAccountLayoutProps) {
  return (
    <div className="">
      {children}
    </div>
  );
}
