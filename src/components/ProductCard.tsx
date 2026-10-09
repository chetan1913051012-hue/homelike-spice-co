"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, Plus, Minus } from "lucide-react";

export default function ProductCard({ product }: { product: any }) {
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);

  return (
    <div className="bg-white rounded-2xl border border-wood/10 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col">
      <Link href={`/shop/${product.slug}`} className="relative h-64 w-full bg-parchment block">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
        />
        <span className="absolute top-3 right-3 bg-cream/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-wood border border-wood/10">
          {product.pack_size}
        </span>
      </Link>

      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="text-lg font-bold text-wood hover:text-forest transition">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-wood/75 mt-1 line-clamp-2">{product.tagline}</p>
        </div>

        <div className="pt-2 border-t border-wood/10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xl font-bold text-wood">₹{Number(product.price).toFixed(2)}</span>
            <span className={`text-xs font-medium ${product.stock > 0 ? "text-forest" : "text-chilli"}`}>
              {product.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center border border-wood/20 rounded-full px-2 py-1">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="p-1 text-wood hover:text-forest"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 text-sm font-semibold text-wood">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="p-1 text-wood hover:text-forest"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              disabled={product.stock <= 0}
              onClick={() =>
                addToCart(
                  {
                    id: product.id,
                    name: product.name,
                    slug: product.slug,
                    pack_size: product.pack_size,
                    price: Number(product.price),
                    image_url: product.image_url,
                  },
                  qty
                )
              }
              className="flex-1 bg-forest text-white py-2.5 px-4 rounded-full text-sm font-semibold hover:bg-forest/90 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}