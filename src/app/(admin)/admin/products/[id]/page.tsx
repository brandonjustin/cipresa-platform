import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/product-form';
import { getProductByIdForAdmin, getProductCategories } from '@/lib/data/products';
import { updateProduct } from '@/lib/actions/admin/products';

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProductByIdForAdmin(params.id);
  if (!product) notFound();

  const categories = await getProductCategories();

  return (
    <>
      <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{product.name}</h1>
      <p className="text-sm text-gray-500 mb-6">/product/{product.slug}</p>
      <ProductForm categories={categories} product={product} action={updateProduct.bind(null, product.id)} />
    </>
  );
}
