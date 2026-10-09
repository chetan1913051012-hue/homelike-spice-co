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
    <div className="group relative rounded-2xl overflow-hidden bg-white border border-wood/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] flex flex-col">
      
      {/* Image Container with Zoom Effect - Keeping your Next.js Link & Image */}
      <Link href={`/shop/${product.slug}`} className="relative h-64 w-full overflow-hidden bg-parchment/30 block">
        <Image 
          src={product.image_url} 
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Your existing pack size tag */}
        <span className="absolute top-3 right-3 bg-cream/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-wood">
          {product.pack_size}
        </span>
        {/* New Premium Tag */}
        <div className="absolute top-3 left-3 bg-white/70 backdrop-blur-md border border-white/40 shadow-sm px-3 py-1 rounded-full text-xs font-bold text-forest uppercase tracking-wider">
          Best Seller
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/shop/${product.slug}`}>
            <h3 className="text-xl font-bold text-wood hover:text-forest transition-colors mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              {product.name}
            </h3>
          </Link>
          {/* Using your existing database fields if available */}
          <p className="text-sm text-wood/60 mb-4">{product.description || "Premium unadulterated spice"}</p>
          <p className="text-lg font-semibold text-forest mb-4">₹{product.price}</p>
        </div>
        
        {/* Hover Reveal Button - Connected to your existing useCart hook! */}
        <div className="overflow-hidden h-0 group-hover:h-12 transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 mt-2">
          <button 
            onClick={() => addToCart(product, qty)}
            className="w-full bg-wood text-parchment py-3 rounded-xl font-medium transition-colors hover:bg-forest flex items-center justify-center gap-2"
          >
            <ShoppingBag size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}