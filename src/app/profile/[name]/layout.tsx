import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { name: string } }): Promise<Metadata> {
  return {
    title: `${params.name}`,
  };
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 