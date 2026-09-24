import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { supabasePublic } from '@/lib/supabase/public';
import { supabaseAdmin } from '@/lib/supabase/admin';
import type { Plant, PlantCategory } from '@/types';

interface PlantCategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
}

interface PlantRow {
  id: string;
  scientific_name: string;
  common_name: string;
  slug: string;
  images: string[];
  description: string | null;
  climate: string[];
  soil_type: string[];
  water_requirement: Plant['waterRequirement'];
  sunlight: Plant['sunlight'];
  growth_duration: string | null;
  harvest_time: string | null;
  estimated_yield: string | null;
  region_compatibility: string[];
  disease_risks: string[];
  nutritional_benefits: string[];
  market_value: string | null;
  export_potential: boolean;
  price: number | null;
  currency: string;
  availability: boolean;
  is_published: boolean;
  created_at: string;
  category: PlantCategoryRow;
}

function mapCategory(row: PlantCategoryRow): PlantCategory {
  return { id: row.id, name: row.name, slug: row.slug, description: row.description ?? '', icon: row.icon ?? '', count: 0 };
}

function mapPlant(row: PlantRow, relatedCourses: string[] = []): Plant {
  return {
    id: row.id,
    scientificName: row.scientific_name,
    commonName: row.common_name,
    slug: row.slug,
    images: row.images ?? [],
    category: mapCategory(row.category),
    description: row.description ?? '',
    climate: row.climate ?? [],
    soilType: row.soil_type ?? [],
    waterRequirement: row.water_requirement,
    sunlight: row.sunlight,
    growthDuration: row.growth_duration ?? '',
    harvestTime: row.harvest_time ?? '',
    estimatedYield: row.estimated_yield ?? '',
    regionCompatibility: row.region_compatibility ?? [],
    diseaseRisks: row.disease_risks ?? [],
    nutritionalBenefits: row.nutritional_benefits ?? [],
    marketValue: row.market_value ?? '',
    exportPotential: row.export_potential,
    price: row.price !== null ? Number(row.price) : 0,
    currency: row.currency,
    availability: row.availability,
    isPublished: row.is_published,
    relatedCourses,
    createdAt: row.created_at,
  };
}

const PLANT_SELECT = '*, category:plant_categories(*)';

export async function getPublishedPlants(): Promise<Plant[]> {
  const { data, error } = await supabasePublic.from('plants').select(PLANT_SELECT).eq('is_published', true).order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as unknown as PlantRow[]).map((row) => mapPlant(row));
}

export async function getPlantsByIds(ids: string[]): Promise<Plant[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabasePublic.from('plants').select(PLANT_SELECT).in('id', ids);
  if (error || !data) return [];
  return (data as unknown as PlantRow[]).map((row) => mapPlant(row));
}

// Public, published-only data: served from Next's data cache (shared across
// visitors, refreshed every 5 minutes) with the cookie-free public client,
// instead of one Supabase round trip per page view. React cache() still
// dedupes generateMetadata() + the page within a single request.
const getPlantBySlugCached = unstable_cache(
  async (slug: string): Promise<Plant | null> => {
    const { data, error } = await supabasePublic.from('plants').select(PLANT_SELECT).eq('slug', slug).eq('is_published', true).single();
    if (error || !data) return null;

    const { data: relations } = await supabasePublic.from('plant_courses').select('course_id').eq('plant_id', (data as { id: string }).id);
    return mapPlant(data as unknown as PlantRow, (relations ?? []).map((r) => r.course_id as string));
  },
  ['plant-by-slug'],
  { revalidate: 300, tags: ['plants'] }
);

export const getPlantBySlug = cache((slug: string) => getPlantBySlugCached(slug));

export async function getPlantCategories(): Promise<PlantCategory[]> {
  const { data, error } = await supabasePublic.from('plant_categories').select('*').order('display_order');
  if (error || !data) return [];
  return (data as PlantCategoryRow[]).map(mapCategory);
}

// ==================== Admin ====================

export async function getAllPlantsForAdmin(): Promise<Plant[]> {
  const { data, error } = await supabaseAdmin.from('plants').select(PLANT_SELECT).order('created_at', { ascending: false });
  if (error || !data) return [];
  return (data as unknown as PlantRow[]).map((row) => mapPlant(row));
}

export async function getPlantByIdForAdmin(id: string): Promise<Plant | null> {
  const { data, error } = await supabaseAdmin.from('plants').select(PLANT_SELECT).eq('id', id).single();
  if (error || !data) return null;
  return mapPlant(data as unknown as PlantRow);
}
