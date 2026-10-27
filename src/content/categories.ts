// Reporting categories — exact list and grouping from
// `.claude/skills/sos-content-accuracy/SKILL.md` ("Reporting categories" /
// "Category grouping (approved)"). Do not add, remove, rename, or regroup an
// incident type without updating the skill first. Descriptions are intentionally
// generic: they describe what the category covers, never who responds or how fast.

import type { LucideIcon } from "lucide-react";
import {
  LifeBuoy,
  ShieldAlert,
  Flame,
  TriangleAlert,
  Megaphone,
  Wine,
  Video,
  HeartHandshake,
  Accessibility,
  UserX,
  PawPrint,
  Trash2,
  Zap,
  CarFront,
  Construction,
  Waves,
  CircleDot,
  CloudRain,
} from "lucide-react";

export interface IncidentType {
  id: string;
  label: string;
  icon: string; // lucide-react export name, kept as a string for the manifest + lookup map
  description: string;
}

export interface CategoryGroup {
  id: string;
  title: string;
  description: string;
  items: IncidentType[];
}

export const categoryGroups: CategoryGroup[] = [
  {
    id: "emergency-response",
    title: "Emergency Response",
    description: "Situations that call for immediate attention from the appropriate responders.",
    items: [
      { id: "rescue", label: "Rescue", icon: "LifeBuoy", description: "Report situations where someone may need rescue assistance." },
      { id: "police", label: "Police", icon: "ShieldAlert", description: "Report situations that may require police attention." },
      { id: "fire", label: "Fire", icon: "Flame", description: "Report a fire or fire-related hazard." },
      { id: "other-emergency", label: "Other emergency reports", icon: "TriangleAlert", description: "Report an emergency that doesn't fit another category." },
    ],
  },
  {
    id: "public-safety",
    title: "Public Safety",
    description: "Everyday concerns that affect the safety and order of a community.",
    items: [
      { id: "public-disturbances", label: "Public disturbances", icon: "Megaphone", description: "Report a disturbance affecting public order." },
      { id: "public-intoxication", label: "Public intoxication", icon: "Wine", description: "Report a public intoxication concern." },
      { id: "video-complaints", label: "Video complaints", icon: "Video", description: "Submit a report with video evidence of a concern." },
    ],
  },
  {
    id: "vulnerable-community-support",
    title: "Vulnerable Community Support",
    description: "Concerns involving people who may need extra care or protection.",
    items: [
      { id: "violence-vulnerable-sector", label: "Violence and vulnerable-sector concerns", icon: "HeartHandshake", description: "Report concerns involving violence or members of vulnerable sectors." },
      { id: "disabilities-senior", label: "Incidents involving persons with disabilities and senior citizens", icon: "Accessibility", description: "Report an incident involving a person with a disability or a senior citizen." },
      { id: "bullying", label: "Bullying", icon: "UserX", description: "Report a bullying incident." },
    ],
  },
  {
    id: "infrastructure-hazards",
    title: "Infrastructure Hazards",
    description: "Hazards affecting shared utilities and public infrastructure.",
    items: [
      { id: "power-lines", label: "Fallen or damaged power lines", icon: "Zap", description: "Report a fallen or damaged power line." },
      { id: "manholes", label: "Open or damaged manholes", icon: "CircleDot", description: "Report an open or damaged manhole." },
    ],
  },
  {
    id: "weather-environment",
    title: "Weather & Environment",
    description: "Weather-related incidents and concerns affecting the local environment.",
    items: [
      { id: "flooding", label: "Flooding", icon: "Waves", description: "Report flooding in your area." },
      { id: "typhoon", label: "Typhoon-related incidents", icon: "CloudRain", description: "Report an incident related to typhoon conditions." },
      { id: "waste-sanitation", label: "Waste and sanitation issues", icon: "Trash2", description: "Report a waste or sanitation issue." },
    ],
  },
  {
    id: "traffic-community-concerns",
    title: "Traffic & Community Concerns",
    description: "Road and neighborhood conditions that affect everyday movement and safety.",
    items: [
      { id: "traffic-incidents", label: "Traffic incidents", icon: "CarFront", description: "Report a traffic incident." },
      { id: "road-obstructions", label: "Road obstructions", icon: "Construction", description: "Report an obstruction blocking a road." },
      { id: "animal-concerns", label: "Animal concerns", icon: "PawPrint", description: "Report an animal-related concern." },
    ],
  },
];

// Keep the lucide-react imports referenced so tree-shaking doesn't drop icons that are
// only looked up by name at render time in the categories section.
export const categoryIconComponents: Record<string, LucideIcon> = {
  LifeBuoy,
  ShieldAlert,
  Flame,
  TriangleAlert,
  Megaphone,
  Wine,
  Video,
  HeartHandshake,
  Accessibility,
  UserX,
  PawPrint,
  Trash2,
  Zap,
  CarFront,
  Construction,
  Waves,
  CircleDot,
  CloudRain,
};
