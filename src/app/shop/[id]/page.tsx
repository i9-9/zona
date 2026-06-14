import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/ProductPage";
import { getProductById, products } from "@/data/products";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return { title: "Product | ZONA" };
  return {
    title: `${product.name} | ZONA`,
    description: product.description,
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  return <ProductPage product={product} />;
}
