import { notFound } from 'next/navigation';
import { PlantForm } from '@/components/admin/plant-form';
import { getPlantByIdForAdmin, getPlantCategories } from '@/lib/data/plants';
import { updatePlant } from '@/lib/actions/admin/plants';

export default async function EditPlantPage({ params }: { params: { id: string } }) {
  const plant = await getPlantByIdForAdmin(params.id);
  if (!plant) notFound();

  const categories = await getPlantCategories();

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{plant.commonName}</h1>
      <p className="text-sm text-gray-500 mb-6">/plant/{plant.slug}</p>
      <PlantForm categories={categories} plant={plant} action={updatePlant.bind(null, plant.id)} />
    </>
  );
}
