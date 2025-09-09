import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  className?: string;
}
export default function FeatureCard({ title, description, Icon, className }: FeatureCardProps) {
  return (
    <div className={`flex flex-col rounded-card items-center justify-center py-custom px-[1rem] hover:bg-custom-gray/80 hover:shadow-lg transition-all duration-300 mb-4 ${className || ''}`}>
      <Icon className="w-10 h-10" />

      <h1 className="text-lg font-bold">{title}</h1>
      <p className="leading-relaxed min-h-[78px]">{description}</p>
    </div>
  )
}