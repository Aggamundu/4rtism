import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: `${params.id}`,
  };
}

export default function RequestDisplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 