/**
 * Shared icon config for project features & qualities.
 * Industry-related icons for real estate: homes, amenities, sustainability, quality.
 * Used in admin dropdowns (with previews) and public project pages.
 */

import type { LucideIcon } from "lucide-react"
import {
  Sun,
  Shield,
  ShieldCheck,
  Leaf,
  Home,
  Star,
  Zap,
  Droplets,
  Wind,
  Layers,
  Paintbrush,
  Wrench,
  Building2,
  KeyRound,
  TreePine,
  Landmark,
  MapPin,
  Sparkles,
  Flower2,
  Mountain,
  Car,
  Dumbbell,
  Waves,
  Armchair,
  ThermometerSun,
} from "lucide-react"

export interface IconOption {
  id: string
  label: string
  Icon: LucideIcon
}

const RAW_OPTIONS: IconOption[] = [
  { id: "Sun", label: "Sol", Icon: Sun },
  { id: "Shield", label: "Seguridad", Icon: Shield },
  { id: "ShieldCheck", label: "Garantía", Icon: ShieldCheck },
  { id: "Leaf", label: "Natural / Verde", Icon: Leaf },
  { id: "Home", label: "Hogar", Icon: Home },
  { id: "Star", label: "Destacado", Icon: Star },
  { id: "Zap", label: "Energía", Icon: Zap },
  { id: "Droplets", label: "Agua", Icon: Droplets },
  { id: "Wind", label: "Ventilación", Icon: Wind },
  { id: "Layers", label: "Acabados", Icon: Layers },
  { id: "Paintbrush", label: "Diseño", Icon: Paintbrush },
  { id: "Wrench", label: "Mantenimiento", Icon: Wrench },
  { id: "Building2", label: "Edificio", Icon: Building2 },
  { id: "KeyRound", label: "Entrega llaves", Icon: KeyRound },
  { id: "TreePine", label: "Zonas verdes", Icon: TreePine },
  { id: "Landmark", label: "Ubicación céntrica", Icon: Landmark },
  { id: "MapPin", label: "Ubicación", Icon: MapPin },
  { id: "Sparkles", label: "Exclusividad", Icon: Sparkles },
  { id: "Flower2", label: "Jardín", Icon: Flower2 },
  { id: "Mountain", label: "Vistas", Icon: Mountain },
  { id: "Car", label: "Garaje", Icon: Car },
  { id: "Dumbbell", label: "Gimnasio", Icon: Dumbbell },
  { id: "Waves", label: "Piscina", Icon: Waves },
  { id: "Armchair", label: "Comodidad", Icon: Armchair },
  { id: "ThermometerSun", label: "Eficiencia energética", Icon: ThermometerSun },
]

const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  RAW_OPTIONS.map((o) => [o.id, o.Icon])
)

/** For dropdowns: full list with label and Icon component. */
export const PROJECT_ICON_OPTIONS = RAW_OPTIONS

/** For rendering: icon name → Lucide component. Falls back to Sun if unknown. */
export function getProjectIcon(name: string): LucideIcon {
  return iconMap[name] ?? Sun
}

export { iconMap }
