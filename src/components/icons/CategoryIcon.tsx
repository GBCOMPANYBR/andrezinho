import {
  Smartphone,
  Laptop,
  Refrigerator,
  Sofa,
  Bike,
  Shirt,
  Gamepad2,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  laptop: Laptop,
  refrigerator: Refrigerator,
  sofa: Sofa,
  bike: Bike,
  shirt: Shirt,
  "gamepad-2": Gamepad2,
  "shopping-bag": ShoppingBag,
};

export function CategoryIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICONS[name] ?? ShoppingBag;
  return <Icon className={className} strokeWidth={1.75} />;
}
