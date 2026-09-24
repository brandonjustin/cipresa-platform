import {
  Wheat, LeafyGreen, TreePalm, Tractor, ClipboardList,
  Sprout, FlaskConical, Wrench, Droplets, Package,
  Apple, Citrus, Trees, ShoppingBag, Flame, Sparkles,
  Sun, CloudSun, Moon, Handshake, Truck, Phone,
  Wallet, Gift, GraduationCap, Video, BookOpen,
  Trophy
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  wheat: Wheat,
  leafyGreen: LeafyGreen,
  treePalm: TreePalm,
  tractor: Tractor,
  clipboardList: ClipboardList,
  sprout: Sprout,
  flaskConical: FlaskConical,
  wrench: Wrench,
  droplets: Droplets,
  package: Package,
  apple: Apple,
  citrus: Citrus,
  trees: Trees,
  shoppingBag: ShoppingBag,
  flame: Flame,
  sparkles: Sparkles,
  sun: Sun,
  cloudSun: CloudSun,
  moon: Moon,
  handshake: Handshake,
  truck: Truck,
  phone: Phone,
  wallet: Wallet,
  gift: Gift,
  graduationCap: GraduationCap,
  video: Video,
  bookOpen: BookOpen,
  trophy: Trophy,
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const LucideIcon = iconMap[name];
  if (!LucideIcon) return <span className={className}>{name}</span>;
  return <LucideIcon className={className} />;
}
