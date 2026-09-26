import React from 'react';
import EmergencyCategoryCard from './EmergencyCategoryCard';
import {
  Activity,
  Heart,
  Wind,
  Baby,
  Pill,
  PawPrint,
  Flame,
  Brain,
  Zap,
} from 'lucide-react';

export const EMERGENCY_CATEGORIES = [
  { id: 'Trauma', label: 'Trauma', icon: Activity },
  { id: 'Cardiac', label: 'Cardiac', icon: Heart },
  { id: 'Respiratory', label: 'Respiratory', icon: Wind },
  { id: 'Obstetrics / Pregnancy', label: 'Obstetrics / Pregnancy', icon: Baby },
  { id: 'Poisoning / Intoxication', label: 'Poisoning / Intoxication', icon: Pill },
  { id: 'Neonatal / Pediatric', label: 'Neonatal / Pediatric', icon: Baby },
  { id: 'Animal Bite', label: 'Animal Bite', icon: PawPrint },
  { id: 'Burns', label: 'Burns', icon: Flame },
  { id: 'Neurological', label: 'Neurological', icon: Brain },
  { id: 'Electrocution', label: 'Electrocution', icon: Zap },
];

export default function EmergencyCategoryGrid({
  selectedCategory = 'Trauma',
  onSelectCategory,
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Emergency Category Options"
      className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5"
    >
      {EMERGENCY_CATEGORIES.map((cat) => (
        <EmergencyCategoryCard
          key={cat.id}
          category={cat}
          isSelected={selectedCategory === cat.id}
          onClick={() => onSelectCategory && onSelectCategory(cat.id)}
        />
      ))}
    </div>
  );
}
