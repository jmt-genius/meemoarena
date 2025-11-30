import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  href: string;
  onClick?: () => void;
}

export const FeatureCard = ({ icon, title, description, href, onClick }: FeatureCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className="bg-card text-card-foreground rounded-[48px] p-8 hover-lift panel-shadow group cursor-pointer transition-all duration-300"
    >
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="text-card-foreground/80">{description}</p>
      </div>
    </a>
  );
};
