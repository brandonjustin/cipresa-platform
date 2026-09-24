'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Droplets, Sun, Globe, Clock, TrendingUp,
  Shield, Heart, MessageCircle, ChevronLeft,
  DollarSign, Award,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils/cn';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PageTransition, AnimatedSection } from '@/components/animations/motion-components';
import { formatCurrency } from '@/lib/utils/format';
import { useAuthStore } from '@/lib/store/auth-store';
import { toggleWishlistItem } from '@/lib/actions/wishlist';
import type { Course, Plant } from '@/types';
import { BgImage } from '@/components/ui/bg-image';

const waterLabels = { low: 'Faible', medium: 'Moyen', high: 'Élevé' };
const sunLabels = { full: 'Plein soleil', partial: 'Mi-ombre', shade: 'Ombre' };

interface PlantDetailViewProps {
  plant: Plant;
  relatedCourses: Course[];
  initialIsWishlisted: boolean;
}

export function PlantDetailView({ plant, relatedCourses, initialIsWishlisted }: PlantDetailViewProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [isWishlisted, setIsWishlisted] = useState(initialIsWishlisted);
  const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?next=/plant/${plant.slug}`);
      return;
    }
    setIsTogglingWishlist(true);
    const previous = isWishlisted;
    setIsWishlisted(!previous);
    try {
      const saved = await toggleWishlistItem('plant', plant.id);
      setIsWishlisted(saved);
      toast.success(saved ? 'Ajouté à vos favoris' : 'Retiré de vos favoris');
    } catch (err) {
      setIsWishlisted(previous);
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
    } finally {
      setIsTogglingWishlist(false);
    }
  };

  return (
    <PageTransition>
      <div className="pt-20 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/encyclopedia" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-cipresa-600 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Retour à l&apos;encyclopédie
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-12">
            <AnimatedSection direction="left">
              <div className="relative aspect-square overflow-hidden rounded-2xl shadow-card">
                <BgImage
                  src={plant.images[0]}
                  alt={plant.commonName}
                  className="absolute inset-0"
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                <Badge variant="success" size="md" className="absolute top-4 left-4">{plant.category.name}</Badge>
                {plant.exportPotential && <Badge variant="info" size="md" className="absolute top-4 right-4">Potentiel export</Badge>}
              </div>
            </AnimatedSection>

            <AnimatedSection direction="right" className="space-y-6">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{plant.commonName}</h1>
                <p className="text-lg text-gray-500 italic">{plant.scientificName}</p>
              </div>

              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{plant.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30">
                  <Droplets className="w-5 h-5 text-blue-500 mb-2" />
                  <p className="text-xs text-gray-500">Eau</p>
                  <p className="font-semibold text-sm">{waterLabels[plant.waterRequirement]}</p>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30">
                  <Sun className="w-5 h-5 text-amber-500 mb-2" />
                  <p className="text-xs text-gray-500">Soleil</p>
                  <p className="font-semibold text-sm">{sunLabels[plant.sunlight]}</p>
                </div>
                <div className="p-4 rounded-2xl bg-cipresa-50 dark:bg-cipresa-950/30">
                  <Clock className="w-5 h-5 text-cipresa-500 mb-2" />
                  <p className="text-xs text-gray-500">Cycle</p>
                  <p className="font-semibold text-sm">{plant.growthDuration}</p>
                </div>
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30">
                  <TrendingUp className="w-5 h-5 text-purple-500 mb-2" />
                  <p className="text-xs text-gray-500">Rendement</p>
                  <p className="font-semibold text-sm">{plant.estimatedYield}</p>
                </div>
              </div>

              {plant.price > 0 && (
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-cipresa-50 dark:bg-cipresa-950/30">
                  <DollarSign className="w-6 h-6 text-cipresa-500" />
                  <div>
                    <p className="text-sm text-gray-500">Prix indicatif</p>
                    <p className="text-xl font-bold text-cipresa-600">{formatCurrency(plant.price, plant.currency)}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {plant.availability && (
                  <Link href={`/contact?subject=${encodeURIComponent(`Demande de devis — ${plant.commonName}`)}`}>
                    <Button size="lg"><MessageCircle className="w-5 h-5" /> Demander un devis</Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className={cn('w-14', isWishlisted && 'border-red-400 text-red-500')}
                  title="Ajouter aux favoris"
                  loading={isTogglingWishlist}
                  onClick={handleToggleWishlist}
                >
                  <Heart className={cn('w-5 h-5', isWishlisted && 'fill-current')} />
                </Button>
              </div>
              {!plant.availability && (
                <p className="text-sm text-red-500">Actuellement indisponible.</p>
              )}
            </AnimatedSection>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mt-16">
            <AnimatedSection>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-cipresa-500" /> Conditions de culture</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Climat compatible</p>
                    <div className="flex flex-wrap gap-2">
                      {plant.climate.map((c) => <Badge key={c} variant="warning">{c}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Type de sol</p>
                    <div className="flex flex-wrap gap-2">
                      {plant.soilType.map((s) => <Badge key={s} variant="default">{s}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Régions compatibles</p>
                    <div className="flex flex-wrap gap-2">
                      {plant.regionCompatibility.map((r) => <Badge key={r} variant="info">{r}</Badge>)}
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <Card className="p-6">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-cipresa-500" /> Risques & Valeur</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Risques de maladies</p>
                    <div className="flex flex-wrap gap-2">
                      {plant.diseaseRisks.map((d) => <Badge key={d} variant="error">{d}</Badge>)}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Bénéfices nutritionnels</p>
                    <div className="flex flex-wrap gap-2">
                      {plant.nutritionalBenefits.map((n) => <Badge key={n} variant="success">{n}</Badge>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <Award className="w-5 h-5 text-cipresa-500" />
                    <div>
                      <p className="text-sm text-gray-500">Valeur marchande</p>
                      <p className="font-semibold">{plant.marketValue}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedSection>
          </div>

          {relatedCourses.length > 0 && (
            <AnimatedSection className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Formations associées</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedCourses.map((course) => (
                  <Link key={course.id} href={`/course/${course.slug}`} className="group block">
                    <Card className="flex gap-4 p-4">
                      <BgImage src={course.thumbnail} className="w-24 h-20 rounded-xl bg-gray-100 dark:bg-gray-800 flex-shrink-0" sizes="160px" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-cipresa-600 font-medium">{course.category.name}</p>
                        <h3 className="font-semibold text-sm text-gray-900 dark:text-white group-hover:text-cipresa-600 transition-colors line-clamp-2">{course.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">{course.price === 0 ? 'Gratuit' : formatCurrency(course.price, course.currency)}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
