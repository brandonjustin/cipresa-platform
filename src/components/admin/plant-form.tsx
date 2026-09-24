'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Plant, PlantCategory } from '@/types';

interface PlantFormProps {
  categories: PlantCategory[];
  action: (formData: FormData) => Promise<void>;
  plant?: Plant;
}

const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5';

export function PlantForm({ categories, action, plant }: PlantFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      await action(formData);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Une erreur est survenue.');
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 space-y-5 max-w-3xl">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Nom commun *</label>
          <input name="common_name" required defaultValue={plant?.commonName} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Nom scientifique</label>
          <input name="scientific_name" defaultValue={plant?.scientificName} className={inputClass} placeholder="Ex: Persea americana" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Images (une URL par ligne)</label>
        <textarea name="images" rows={2} defaultValue={plant?.images?.join('\n')} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea name="description" rows={3} defaultValue={plant?.description} className={inputClass} />
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Catégorie</label>
          <select name="category_id" defaultValue={plant?.category?.id} className={inputClass}>
            <option value="">—</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className={labelClass}>Besoin en eau</label>
          <select name="water_requirement" defaultValue={plant?.waterRequirement ?? 'medium'} className={inputClass}>
            <option value="low">Faible</option>
            <option value="medium">Moyen</option>
            <option value="high">Élevé</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Ensoleillement</label>
          <select name="sunlight" defaultValue={plant?.sunlight ?? 'full'} className={inputClass}>
            <option value="full">Plein soleil</option>
            <option value="partial">Mi-ombre</option>
            <option value="shade">Ombre</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className={labelClass}>Durée de croissance</label>
          <input name="growth_duration" defaultValue={plant?.growthDuration} className={inputClass} placeholder="Ex: 3-5 ans" />
        </div>
        <div>
          <label className={labelClass}>Période de récolte</label>
          <input name="harvest_time" defaultValue={plant?.harvestTime} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Rendement estimé</label>
          <input name="estimated_yield" defaultValue={plant?.estimatedYield} className={inputClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Climats compatibles (séparés par des virgules)</label>
          <input name="climate" defaultValue={plant?.climate?.join(', ')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Types de sol (séparés par des virgules)</label>
          <input name="soil_type" defaultValue={plant?.soilType?.join(', ')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Régions compatibles (séparées par des virgules)</label>
          <input name="region_compatibility" defaultValue={plant?.regionCompatibility?.join(', ')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Risques de maladies (séparés par des virgules)</label>
          <input name="disease_risks" defaultValue={plant?.diseaseRisks?.join(', ')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Bénéfices nutritionnels (séparés par des virgules)</label>
          <input name="nutritional_benefits" defaultValue={plant?.nutritionalBenefits?.join(', ')} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Valeur marchande</label>
          <input name="market_value" defaultValue={plant?.marketValue} className={inputClass} placeholder="Ex: CFA 1500-2000/pied" />
        </div>
      </div>

      <div>
        <label className={labelClass}>Prix indicatif (XAF, 0 si non applicable)</label>
        <input name="price" type="number" min={0} defaultValue={plant?.price ?? 0} className={inputClass} />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input type="checkbox" name="export_potential" defaultChecked={plant?.exportPotential} className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
          Potentiel export
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
          <input type="checkbox" name="availability" defaultChecked={plant?.availability ?? true} className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
          Disponible
        </label>
        {plant && (
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input type="checkbox" name="is_published" defaultChecked={plant.isPublished} className="rounded border-gray-300 text-blue-500 focus:ring-blue-500" />
            Publié
          </label>
        )}
      </div>

      <Button type="submit" loading={isSubmitting}>
        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : plant ? 'Enregistrer' : 'Créer la fiche'}
      </Button>
    </form>
  );
}
