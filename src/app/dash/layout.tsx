import { ReactNode } from 'react';

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
