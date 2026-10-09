import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!product) return notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        <ProductCard product={product} />
        <div className="bg-parchment p-8 rounded-2xl border border-wood/10 space-y-6">
          <span className="inline-block px-3 py-1 rounded-full bg-turmeric/20 text-wood text-xs font-bold">
            Pack Size: {product.pack_size}
          </span>
          <h1 className="text-3xl font-bold text-wood">{product.name}</h1>
          <p className="text-wood/80 leading-relaxed">{product.description}</p>
          <div className="border-t border-wood/10 pt-4 text-sm text-wood/75 space-y-2">
            <p><strong>Origin:</strong> Packed in New Delhi, India</p>
            <p><strong>Estimated Dispatch:</strong> 24–48 hours</p>
            <p><strong>Estimated Delivery:</strong> 3–5 business days after dispatch</p>
          </div>
        </div>
      </div>
    </div>
  );
}