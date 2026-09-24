'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Leaf, Droplets, Sun, Clock, CloudSun, Moon, Trees } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageTransition, StaggerContainer, StaggerItem } from '@/components/animations/motion-components';
import { cn } from '@/lib/utils/cn';
import type { Plant, PlantCategory } from '@/types';
import { BgImage } from '@/components/ui/bg-image';

const waterLabels = { low: 'Faible', medium: 'Moyen', high: 'Élevé' } as const;
const sunLabels = { full: 'Plein soleil', partial: 'Mi-ombre', shade: 'Ombre' } as const;

interface EncyclopediaBrowserProps {
  plants: Plant[];
  categories: PlantCategory[];
}

export function EncyclopediaBrowser({ plants, categories }: EncyclopediaBrowserProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedClimate, setSelectedClimate] = useState<string | null>(null);
  const [selectedWater, setSelectedWater] = useState<string | null>(null);

  const filtered = plants.filter((p) => {
    if (searchQuery && !p.commonName.toLowerCase().includes(searchQuery.toLowerCase()) && !p.scientificName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory && p.category.slug !== selectedCategory) return false;
    if (selectedClimate && !p.climate.some((c) => c.toLowerCase().includes(selectedClimate.toLowerCase()))) return false;
    if (selectedWater && p.waterRequirement !== selectedWater) return false;
    return true;
  });

  const climates = useMemo(() => Array.from(new Set(plants.flatMap((p) => p.climate))), [plants]);

  return (
    <PageTransition>
      <div className="pt-20">
        <div className="bg-gradient-to-b from-gray-950 to-gray-900 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
              <Badge variant="premium" className="mb-4">Encyclopédie</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Encyclopédie des plantes</h1>
              <p className="text-white/60 max-w-2xl mx-auto mb-8">
                Explorez notre base de connaissances sur les plantes africaines
              </p>
              <div className="max-w-2xl mx-auto relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Rechercher une plante..."
                  value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cipresa-500 backdrop-blur-sm" />
              </div>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setSelectedCategory(null)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all', !selectedCategory ? 'bg-cipresa-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700')}>Toutes</button>
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(selectedCategory === cat.slug ? null : cat.slug)} className={cn('px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5', selectedCategory === cat.slug ? 'bg-cipresa-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700')}>
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap">Climat:</span>
            <button onClick={() => setSelectedClimate(null)} className={cn('px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all', !selectedClimate ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700')}>Tous</button>
            {climates.map((c) => (
              <button key={c} onClick={() => setSelectedClimate(selectedClimate === c ? null : c)} className={cn('px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all', selectedClimate === c ? 'bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700')}>
                {c}
              </button>
            ))}
            <span className="text-xs text-gray-400 font-medium whitespace-nowrap ml-2">Eau:</span>
            {Object.entries(waterLabels).map(([key, label]) => (
              <button key={key} onClick={() => setSelectedWater(selectedWater === key ? null : key)} className={cn('px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-all', selectedWater === key ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700')}>
                {label}
              </button>
            ))}
          </div>

          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pb-16">
            {filtered.map((plant) => (
              <StaggerItem key={plant.id}>
                <Link href={`/plant/${plant.slug}`} className="group block">
                  <Card className="h-full">
                    <div className="relative h-48 bg-gradient-to-br from-cipresa-100 to-blue-50 dark:from-cipresa-950 dark:to-gray-900 flex items-center justify-center overflow-hidden">
                      <BgImage src={plant.images[0]} className="w-full h-full group-hover:scale-105 transition-transform duration-500" sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" />
                      {!plant.images[0] && <Trees className="w-24 h-24 text-cipresa-300 dark:text-cipresa-700" />}
                      <Badge variant="success" size="sm" className="absolute top-3 left-3">{plant.category.name}</Badge>
                      {plant.exportPotential && <Badge variant="info" size="sm" className="absolute top-3 right-3">Export</Badge>}
                    </div>
                    <CardContent>
                      <div className="mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-cipresa-600 transition-colors">{plant.commonName}</h3>
                        <p className="text-sm text-gray-500 italic">{plant.scientificName}</p>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{plant.description}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {plant.climate.slice(0, 2).map((c) => (
                          <span key={c} className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 text-[10px] font-medium">{c}</span>
                        ))}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1" title="Eau">
                          <Droplets className="w-3.5 h-3.5 text-blue-400" />
                          {waterLabels[plant.waterRequirement]}
                        </span>
                        <span className="flex items-center gap-1" title="Soleil">
                          {plant.sunlight === 'full' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : plant.sunlight === 'partial' ? <CloudSun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-gray-400" />}
                          {sunLabels[plant.sunlight]}
                        </span>
                        <span className="flex items-center gap-1" title="Cycle">
                          <Clock className="w-3.5 h-3.5" />
                          {plant.growthDuration}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <Leaf className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Aucune plante trouvée</h3>
              <p className="text-gray-500">Essayez de modifier vos filtres</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
